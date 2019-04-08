'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _reactRouterRedux = require('react-router-redux');

var _reactRouter = require('react-router');

var _settings = require('@digifi/periodicjs.ext.reactapp/adminclient/src/content/config/settings.js');

var _settings2 = _interopRequireDefault(_settings);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var windowState = typeof window !== 'undefined' && window.__padmin ? window.__padmin : {}; // import promise from 'redux-promise';

var disableLogger = function disableLogger(store) {
  return function (next) {
    return function (action) {
      // console .log('dispatching: ', action,{store});
      return next(action);
    };
  };
};
var logger = windowState.disableLogger ? disableLogger : (0, _reduxLogger2.default)();
// const logger = (store) => (next) => (action) => {
//   console.log('dispatching: ', action,{store});
//   return next(action);
// };

var getRouterHistoryType = function getRouterHistoryType(routerHistoryType) {
  return routerHistoryType === 'browserHistory' ? _reactRouter.browserHistory : _reactRouter.hashHistory;
};

var AppReduxStore = (0, _redux.createStore)(_reducers2.default, (0, _redux.applyMiddleware)(_reduxThunk2.default, (0, _reactRouterRedux.routerMiddleware)(getRouterHistoryType(_settings2.default.routerHistory))
// promise,
, logger));

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept(_reducers2.default, function () {
    var nextRootReducer = _reducers2.default;
    AppReduxStore.replaceReducer(nextRootReducer);
  });
}

exports.default = AppReduxStore;