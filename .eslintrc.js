module.exports = {
    'extends': 'airbnb',
    'rules': {
        // disallow double-negation boolean casts in a boolean context
        'no-extra-boolean-cast': 2,
        // ensure JSDoc comments are valid
        'valid-jsdoc': [1, { 'requireReturn': false }],
        // Avoid code that looks like two expressions but is actually one
        'no-unexpected-multiline': 1,

        // specify curly brace conventions for all control statements
        'curly': [2, 'multi-line', 'consistent'],
        // enforces consistent newlines before or after dots
        'dot-location': [1, 'property'],
        // require the use of === and !==
        'eqeqeq': [2, 'allow-null'],
        // disallow division operators explicitly at beginning of regular expression
        'no-else-return': 0,
        // disallow magic numbers in favor of named constants
        'no-magic-numbers': 0,
        // disallow parameter object manipulation
        // rule: http://eslint.org/docs/rules/no-param-reassign.html
        'no-param-reassign': [0, { 'props': true }],
        // disallow unnecessary .call() and .apply()
        'no-useless-call': 1,
        // requires to declare all vars on top of their containing scope
        'vars-on-top': 0,

        // disallow var and named functions in global scope
        // http://eslint.org/docs/rules/no-implicit-globals
        'no-implicit-globals': 2,
        // disallow labels that share a name with a variable
        'no-label-var': 2,
        // disallow use of undefined variable
        'no-undefined': 2,
        // disallow use of variables before they are defined
        'no-use-before-define': [2, 'nofunc'],

        // enforce spacing inside block braces
        'block-spacing': [1, 'always'],
        // enforces consistent naming when capturing the current execution context
        'consistent-this': [2, 'that'],
        // this option sets a specific tab width for your code
        // https://github.com/eslint/eslint/blob/master/docs/rules/indent.md
        'indent': [2, 4],
        // specify the maximum length of a line in your program
        // https://github.com/eslint/eslint/blob/master/docs/rules/max-len.md
        'max-len': [2, 120, 4, {
            'ignoreUrls': true,
            'ignoreComments': false
        }],
        // disallow use of the Array constructor
        'no-array-constructor': 2,
        // allow just one var statement per function
        'one-var': [2, { 'initialized': 'never', 'uninitialized': 'always' }],
        // require assignment operator shorthand where possible or prohibit it entirely
        'operator-assignment': [1, 'always'],
        // enforce operators to be placed before or after line breaks
        'operator-linebreak': [1, 'after'],
        // Require or disallow spaces before/after unary operators
        'space-unary-ops': 2,

        // require parens in arrow function arguments
        'arrow-parens': [2, 'as-needed'],
        // verify super() callings in constructors
        'constructor-super': 2,
        // disallow modifying variables of class declarations
        'no-class-assign': 2,
        // disallow to use this/super before super() calling in constructors.
        'no-this-before-super': 2,
        // suggest using the spread operator instead of .apply()
        'prefer-spread': 2,

        // Enforce boolean attributes notation in JSX
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
        'react/jsx-boolean-value': [2, 'always'],
        // Validate closing bracket location in JSX
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
        'react/jsx-closing-bracket-location': 0,
        // Enforce or disallow spaces around JSX attribute assignments
        'react/jsx-equals-spacing': [2, 'never'],
        // Enforce event handler naming conventions in JSX
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
        'react/jsx-handler-names': 2,
        // Validate props indentation in JSX
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
        'react/jsx-indent-props': [1, 4],
        // Validate JSX has key prop when in array or iterator
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-key.md
        'react/jsx-key': 2,
        // Prevent duplicate props in JSX
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
        'react/jsx-no-duplicate-props': [2, { 'ignoreCase': true }],
        // Enforce PascalCase for user-defined JSX components
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
        'react/jsx-pascal-case': 2,

        // Prevent direct mutation of this.state
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
        'react/no-direct-mutation-state': 2,
        // Enforce component methods order
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
        'react/sort-comp': [1, {
            'order': [
                'static-methods',
                'lifecycle',
                '/^_?handle.+$/',
                '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
                'everything-else',
                '/^_?render.+$/',
                'render'
            ],
            groups: {
                lifecycle: [
                    'displayName',
                    'propTypes',
                    'contextTypes',
                    'childContextTypes',
                    'mixins',
                    'statics',
                    'defaultProps',
                    'state',
                    'constructor',
                    'getDefaultProps',
                    'getInitialState',
                    'getChildContext',
                    'componentWillMount',
                    'componentDidMount',
                    'componentWillReceiveProps',
                    'shouldComponentUpdate',
                    'componentWillUpdate',
                    'componentDidUpdate',
                    'componentWillUnmount'
                ]
            }
        }],
        // Prevent missing parentheses around multilines JSX
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/wrap-multilines.md
        'react/wrap-multilines': 0
    }
};
