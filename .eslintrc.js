module.exports = {

  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },

  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2015,
    "sourceType": "module"
  },

  "rules": {
    "no-console":0,
    "indent": [ "error", 2 ],
    "linebreak-style": [ "error", "unix" ],
    "quotes": [ "error", "double" ],
    "semi": [ "error", "always" ]
  }
};
