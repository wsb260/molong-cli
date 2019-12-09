module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [
        "airbnb-base"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": { // 0=off,1=warn,2=error
        "semi":0, // 句末不加分号
        "no-console":0,
        "linebreak-style":0,
        "comma-dangle":0
    }
};