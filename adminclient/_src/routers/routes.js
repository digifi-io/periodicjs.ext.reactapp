'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRoutes = getRoutes;

var _index = require('../containers/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRoutes(appContainer) {
  var sharedChildRoutes = [{
    path: 'login**',
    component: _index2.default.PageComponents.LoginPage,
    indexRoute: {
      component: _index2.default.PageComponents.LoginPage
    }
  }, {
    path: '*',
    component: _index2.default.PageComponents.DynamicPage
  }];
  return {
    childRoutes: [{
      path: typeof window.__padmin.adminPath !== 'undefined' ? window.__padmin.adminPath : '/p-admin',
      component: appContainer,
      // onEnter: requireAuth,
      indexRoute: {
        // onEnter: requireAuth,
        component: _index2.default.PageComponents.LoginPage
      },
      childRoutes: sharedChildRoutes
    }, {
      path: '/',
      component: appContainer,
      // onEnter: requireAuth,
      indexRoute: {
        // onEnter: requireAuth,
        component: _index2.default.PageComponents.LoginPage
      },
      childRoutes: sharedChildRoutes
    }]
  };
}

//https://github.com/ReactTraining/react-router/blob/efac1a8ff4c26d6b7379adf2ab903f1892276362/examples/auth-flow/app.js#L122