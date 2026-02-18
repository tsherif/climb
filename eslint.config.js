const js = require("@eslint/js");
const globals = require("globals");

module.exports = [{
    files: [
        "js/box.js",
        "js/player.js",
        "js/platform.js",
        "js/message.js",
        "js/climb.js"
    ],
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",
        globals: {
            ...globals.browser,
            oFactory: "readonly",
            tgame: "readonly",
            createBox: "readonly",
            createPlayer: "readonly",
            createPlatform: "readonly",
            createMessage: "readonly"
        }
    },
    rules: {
        ...js.configs.recommended.rules,
        eqeqeq: [ "error", "always"],
        "no-undef": "error",
        "no-unused-vars": [ "warn", { args: "none" }],
        "no-var": "off",
        "prefer-const": "off",
        indent: ["error", 2, { SwitchCase: 1 }],
        "no-trailing-spaces": "error"
    }
}];


