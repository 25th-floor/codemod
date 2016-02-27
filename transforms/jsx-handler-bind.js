const EVENT_REGEX = /^on.+$/;
const HANDLER_REGEX = /^(?:_?on|_?handle)(.+)$/;
const HANDLER_PREFIX = 'handle';

export default (file, api) => {
    const j = api.jscodeshift;

    // matches "this"
    const THIS_PATTERN = {
        type: 'ThisExpression',
    };

    // matches references to members of "this"
    const MEMBER_PATTERN = {
        type: 'MemberExpression',
        object: THIS_PATTERN,
    };

    // matches function references bound to "this" via .bind()
    const BIND_FUNC_PATTERN = {
        type: 'CallExpression',
        callee: {
            object: MEMBER_PATTERN,
            property: {
                name: 'bind',
            },
        },
        arguments: [
            THIS_PATTERN,
        ],
    };

    // matches function references bound to "this" via ::
    const BIND_OP_PATTERN = {
        type: 'BindExpression',
        callee: MEMBER_PATTERN,
    };

    // matches direct calls via arrow functions
    const ARROW_PATTERN = ({ params, body }) => j.match(body, {
        type: 'CallExpression',
        callee: MEMBER_PATTERN,
        arguments: args => (
            args.length === params.length &&
            j.match(args, params.map(({ type, name }) => ({ type, name })))
        ),
    });

    // searches for a bound assignment in the constructor
    const hasMethodBinding = (body, methodName) => j(body).find(j.ExpressionStatement, {
        expression: {
            type: 'AssignmentExpression',
            left: {
                type: 'MemberExpression',
                object: {
                    type: 'ThisExpression',
                },
                property: {
                    name: methodName,
                },
            },
        },
    });

    // creates a bound handler assignment for the constructor
    const createMethodBinding = methodName => {
        const method = j.memberExpression(
            j.thisExpression(),
            j.identifier(methodName)
        );

        return j.expressionStatement(
            j.assignmentExpression(
                '=',
                method,
                j.bindExpression(null, method)
            )
        );
    };

    // assigns or normalizes the bound handler in the constructor
    const ensureBindingInConstructor = (body, methodName) => {
        const binding = hasMethodBinding(body, methodName);
        const replacement = createMethodBinding(methodName);

        if (binding.size()) {
            binding.replaceWith(replacement);
        } else {
            body.value.push(replacement);
        }
    };

    // matches if at least one of the matchers returns true
    const oneOf = (...matchers) => val => !matchers || !matchers.length || matchers.some(m => j.match(val, m));

    // aggregates unique names of all handlers
    const getHandlerNames = methods => {
        const handlerMap = {};
        methods.forEach(m => { handlerMap[m.value.name] = true; });
        return Object.keys(handlerMap);
    };

    // enforces ::bind syntax for all usages
    const fixHandlerUsage = handler => j(handler)
        .closest(j.JSXExpressionContainer)
        .replaceWith(j.jsxExpressionContainer(
            j.memberExpression(
                j.thisExpression(),
                j.identifier(handler.value.name)
            )
        ));

    // enforces "handle.*" for all handlers
    const normalizeHandlerName = (classDef, name) => {
        const match = HANDLER_REGEX.exec(name);
        if (!match) return name;

        const newName = HANDLER_PREFIX + match[1];

        // rename the method definition
        classDef
            .find(j.MethodDefinition, { key: { name } })
            .forEach(p => p.get('key').replace(j.identifier(newName)));

        // replace all usages
        classDef
            .find(j.MemberExpression, MEMBER_PATTERN)
            .find(j.Identifier, { name })
            .replaceWith(j.identifier(newName));

        return newName;
    };

    // ensures the presence of a constructor
    const ensureConstructor = classDef => {
        let constructor = classDef.find(j.MethodDefinition, { kind: 'constructor' });

        // create a constructor
        if (constructor.size() === 0) {
            const args = [
                j.identifier('props'),
            ];

            const newConstructor = j.methodDefinition(
                'constructor',
                j.identifier('constructor'),
                j.functionExpression(
                    null,
                    args,
                    j.blockStatement([
                        j.expressionStatement(j.callExpression(j.super(), args)),
                    ])
                )
            );

            // insert the constructor before the first method
            const firstMethod = classDef.find(j.MethodDefinition, { static: false });
            if (firstMethod.size() > 0) {
                firstMethod.get().insertBefore(newConstructor);
            } else {
                classDef.get('body').get('body').value.push(newConstructor);
            }

            constructor = j(newConstructor);
        }

        return constructor
            .find(j.BlockStatement)
            .get('body');
    };

    // finds direct JSX event handlers within the given class
    const findHandlers = classDef => classDef
        .find(j.MethodDefinition, { key: { name: 'render' } })
        .find(j.JSXAttribute, {
            name: {
                name: name => EVENT_REGEX.test(name),
            },
            value: {
                expression: oneOf(
                    MEMBER_PATTERN,
                    BIND_FUNC_PATTERN,
                    BIND_OP_PATTERN,
                    ARROW_PATTERN
                ),
            },
        })
        .find(j.MemberExpression, { object: THIS_PATTERN })
        .find(j.Identifier);

    // normalizes all JSX event handlers within the given class
    const fixClassHandlers = classDef => {
        const handlers = findHandlers(classDef);
        if (handlers.size() === 0) return;

        // Fix all usages
        handlers.forEach(fixHandlerUsage);

        // Fix binding and naming
        const constructor = ensureConstructor(classDef);
        getHandlerNames(handlers)
            .map(name => normalizeHandlerName(classDef, name))
            .forEach(name => ensureBindingInConstructor(constructor, name));
    };

    // searches for classes extending React.Component
    const findReactComponentClasses = root => root.find(j.ClassDeclaration, {
        superClass: oneOf({
            type: 'Identifier',
            name: 'Component',
        }, {
            type: 'MemberExpression',
            object: {
                type: 'Identifier',
                name: 'React',
            },
            property: {
                type: 'Identifier',
                name: 'Component',
            },
        }),
    });

    const ast = j(file.source);
    findReactComponentClasses(ast)
        .forEach(c => fixClassHandlers(j(c)));
    return ast.toSource();
};
