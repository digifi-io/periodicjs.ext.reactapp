'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _Error = require('./Error404');

var _Error2 = _interopRequireDefault(_Error);

var _DynamicPage = require('./DynamicPage');

var _DynamicPage2 = _interopRequireDefault(_DynamicPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  containers: {
    PageComponents: {
      LoginPage: _login2.default,
      Error404: _Error2.default,
      DynamicPage: _DynamicPage2.default
    }
  }
};