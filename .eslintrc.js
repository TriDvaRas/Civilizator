module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "accessor-pairs": "error",
        "array-bracket-newline": "error",
        "array-bracket-spacing": [
            "error",
            "never"
        ],
        "array-callback-return": "error",
        "array-element-newline": "off",
        "arrow-body-style": "off",
        "arrow-parens": [
            "error",
            "as-needed"
        ],
        "arrow-spacing": [
            "error",
            {
                "after": true,
                "before": true
            }
        ],
        "block-scoped-var": "error",
        "block-spacing": "error",
        "brace-style": [
            "error",
            "stroustrup",
            { "allowSingleLine": true }
        ],
        "camelcase": "error",
        "capitalized-comments": "off",
        "class-methods-use-this": "error",
        "comma-dangle": "off",
        "comma-spacing": "off",
        "comma-style": [
            "error",
            "last"
        ],
        "complexity": "error",
        "computed-property-spacing": [
            "error",
            "never"
        ],
        "consistent-return": "off",
        "consistent-this": "error",
        "curly": "off",
        "default-case": "error",
        "default-case-last": "error",
        "default-param-last": "error",
        "dot-location": [
            "error",
            "property"
        ],
        "dot-notation": "off",
        "eol-last": [
            "error",
            "never"
        ],
        "eqeqeq": "off",
        "func-call-spacing": "error",
        "func-name-matching": "error",
        "func-names": "error",
        "func-style": [
            "error",
            "declaration"
        ],
        "function-paren-newline": "off",
        "generator-star-spacing": "error",
        "grouped-accessor-pairs": "error",
        "guard-for-in": "error",
        "id-denylist": "error",
        "id-length": "off",
        "id-match": "error",
        "implicit-arrow-linebreak": [
            "error",
            "beside"
        ],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "init-declarations": "error",
        "jsx-quotes": "error",
        "key-spacing": "error",
        "keyword-spacing": "error",
        "line-comment-position": "off",
        "linebreak-style": [
            "error",
            "windows"
        ],
        "lines-around-comment": "error",
        "lines-between-class-members": [
            "error",
            "always"
        ],
        "max-classes-per-file": "error",
        "max-depth": "error",
        "max-len": "off",
        "max-lines": "off",
        "max-lines-per-function": "error",
        "max-nested-callbacks": "error",
        "max-params": "off",
        "max-statements": "off",
        "max-statements-per-line": "error",
        "multiline-comment-style": [
            "error",
            "separate-lines"
        ],
        "new-cap": "error",
        "new-parens": "error",
        "newline-per-chained-call": "off",
        "no-alert": "error",
        "no-array-constructor": "error",
        "no-await-in-loop": "off",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-confusing-arrow": "off",
        "no-console": "warn",
        "no-constructor-return": "error",
        "no-continue": "error",
        "no-div-regex": "error",
        "no-duplicate-imports": "error",
        "no-else-return": "error",
        "no-empty-function": "off",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-extra-parens": "off",
        "no-floating-decimal": "off",
        "no-implicit-globals": "off",
        "no-implied-eval": "error",
        "no-inline-comments": "off",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "off",
        "no-loop-func": "off",
        "no-loss-of-precision": "error",
        "no-magic-numbers": "off",
        "no-mixed-operators": "error",
        "no-multi-assign": "error",
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-multiple-empty-lines": "error",
        "no-negated-condition": "error",
        "no-nested-ternary": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-new-wrappers": "error",
        "no-nonoctal-decimal-escape": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "off",
        "no-plusplus": "off",
        "no-promise-executor-return": "error",
        "no-proto": "error",
        "no-restricted-exports": "error",
        "no-restricted-globals": "error",
        "no-restricted-imports": "error",
        "no-restricted-properties": "error",
        "no-restricted-syntax": "error",
        "no-return-assign": "error",
        "no-return-await": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-shadow": "off",
        "no-tabs": "error",
        "no-template-curly-in-string": "error",
        "no-ternary": "off",
        "no-throw-literal": "error",
        "no-undef-init": "error",
        "no-undefined": "error",
        "no-underscore-dangle": "off",
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": "off",
        "no-unreachable-loop": "error",
        "no-unsafe-optional-chaining": "error",
        "no-unused-expressions": "error",
        "no-unused-vars": "off",
        "no-use-before-define": "off",
        "no-useless-backreference": "error",
        "no-useless-call": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "no-void": "error",
        "no-warning-comments": "off",
        "no-whitespace-before-property": "error",
        "object-curly-newline": "error",
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "object-property-newline": "off",
        "object-shorthand": "off",
        "one-var": "off",
        "one-var-declaration-per-line": "error",
        "operator-assignment": "error",
        "operator-linebreak": "error",
        "padded-blocks": "off",
        "padding-line-between-statements": "error",
        "prefer-arrow-callback": "error",
        "prefer-const": "off",
        "prefer-destructuring": "error",
        "prefer-exponentiation-operator": "error",
        "prefer-named-capture-group": "error",
        "prefer-numeric-literals": "error",
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": [
            "error",
            {
                "allowEmptyReject": false
            }
        ],
        "prefer-regex-literals": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "quote-props": "off",
        "quotes": "off",
        "radix": "off",
        "require-atomic-updates": "error",
        "require-await": "error",
        "require-unicode-regexp": "error",
        "rest-spread-spacing": "error",
        "semi": "off",
        "semi-spacing": "error",
        "semi-style": [
            "error",
            "last"
        ],
        "sort-imports": "error",
        "sort-keys": "off",
        "sort-vars": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": "off",
        "space-in-parens": [
            "error",
            "never"
        ],
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "spaced-comment": "off",
        "strict": [
            "error",
            "never"
        ],
        "switch-colon-spacing": "error",
        "symbol-description": "error",
        "template-curly-spacing": [
            "error",
            "never"
        ],
        "template-tag-spacing": "error",
        "unicode-bom": [
            "error",
            "never"
        ],
        "vars-on-top": "error",
        "wrap-iife": "error",
        "wrap-regex": "error",
        "yield-star-spacing": "error",
        "yoda": [
            "error",
            "never"
        ]
    }
};