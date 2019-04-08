'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historySettings = undefined;
exports.getHistory = getHistory;

var _reactRouter = require('react-router');

var _reactRouterRedux = require('react-router-redux');

// import { Platform, } from 'react-native';
var historySettings = exports.historySettings = {
  browserHistory: _reactRouter.browserHistory,
  hashHistory: _reactRouter.hashHistory,
  createMemoryHistory: _reactRouter.createMemoryHistory
};

function getHistory(historySettings, AppConfigSettings, store) {
  return (0, _reactRouterRedux.syncHistoryWithStore)(historySettings[AppConfigSettings.routerHistory], store);
}