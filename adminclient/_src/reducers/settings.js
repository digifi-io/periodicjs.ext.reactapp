'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _settings = require('../content/config/settings');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultUserNavigation = {
  wrapper: {
    style: {}
  },
  container: {
    style: {}
  },
  layout: {
    component: 'Menu',
    props: {
      style: {
        paddingBottom: 70,
        width: '10rem'
      }
    },
    children: [{
      component: 'MenuLabel',
      children: 'System'
    }, {
      component: 'MenuList',
      children: [{
        component: 'MenuAppLink',
        props: {
          href: '/dashboard',
          label: 'Dashboard',
          id: 'dashboard'
        }
      }, {
        component: 'MenuAppLink',
        props: {
          href: '/#logout',
          label: 'Logout',
          onClick: 'func:this.props.logoutUser'
        }
      }]
    }]
  }
};
var packageJSON = {
  name: 'adminclient',
  version: '10.1.1',
  'private': true,
  devDependencies: {
    'animate.css': '^3.5.2',
    capitalize: '^1.0.0',
    'font-awesome': '^4.7.0',
    'google-map-react': '^0.24.0',
    moment: '^2.17.1',
    numeral: '^2.0.6',
    pluralize: '^3.1.0',
    'react-addons-css-transition-group': '^15.4.1',
    'react-animate.css': '0.0.4',
    'react-native': '^0.39.2',
    'react-native-web': '0.0.60',
    'react-redux': '^4.4.6',
    'react-router': '^3.0.0',
    'react-router-redux': '^4.0.7',
    'react-scripts': '2.0.3',
    recharts: '^1.0.0-beta.1',
    redux: '^3.6.0',
    'redux-logger': '^2.7.4',
    'redux-thunk': '^2.1.0',
    'string-to-json': '^0.1.0',
    'ua-parser-js': '^0.7.12',
    useragent: '^2.1.13'
  },
  dependencies: {
    '@digifi/react-sortable-hoc': '0.0.2',
    axios: '^0.18.0',
    'babel-polyfill': '^6.23.0',
    'box-react-ui': '^30.0.0',
    'box-ui-elements': '^9.1.1',
    classnames: '^2.2.5',
    debounce: '^1.0.0',
    'draft-js': '^0.10.1',
    'eslint-plugin-react': '^7.12.4',
    'file-saver': '^1.3.3',
    filesize: '^3.6.0',
    flat: '^2.0.1',
    'form-serialize': '^0.7.2',
    immutable: '^3.7.4',
    'json-2-csv': '^2.1.0',
    jsuri: '^1.3.1',
    lodash: '^4.17.5',
    mime: '^1.3.6',
    mousetrap: '^1.6.1',
    'node-sass': '^4.11.0',
    pikaday: '^1.6.1',
    'query-string': '^5.1.1',
    'rc-slider': '^6.2.0',
    'rc-steps': '^2.5.1',
    'rc-switch': '^1.5.3',
    'rc-table': '^5.6.7',
    'rc-tree': '^1.7.4',
    're-bulma': '^0.4.3',
    react: '^16.7.0',
    'react-animate-height': '^2.0.4',
    'react-beautiful-dnd': '^9.0.2',
    'react-codemirror': '^0.3.0',
    'react-cropper': '^1.0.1',
    'react-dates': '^16.4.0',
    'react-dom': '^16.7.0',
    'react-draft-wysiwyg': '^1.7.6',
    'react-draggable': '^3.0.4',
    'react-file-reader-input': '^1.1.0',
    'react-immutable-proptypes': '^2.1.0',
    'react-intl': '^2.3.0',
    'react-measure': '^2.2.2',
    'react-modal': '^3.5.1',
    'react-moment-proptypes': '^1.5.0',
    'react-process-string': '^1.2.0',
    'react-responsive-carousel': '^3.1.3',
    'react-router-dom': '^4.3.1',
    'react-slick': '^0.15.4',
    'react-sortable-hoc': '^0.6.8',
    'react-tether': '^1.0.0',
    'react-text-mask': '^5.0.2',
    'react-textarea-autosize': '^6.1.0',
    'react-virtualized': '^9.20.1',
    'regenerator-runtime': '^0.11.1',
    'scroll-into-view-if-needed': '^1.5.0',
    'semantic-ui-css': '^2.2.12',
    'semantic-ui-react': '^0.77.2',
    tabbable: '^1.1.2',
    'text-mask-addons': '^3.6.0',
    uuid: '^3.3.2',
    'validate.js': '^0.11.1',
    victory: '^0.24.0',
    'whatwg-fetch': '^2.0.3'
  },
  scripts: {
    start: 'react-scripts start',
    build: 'react-scripts --max_old_space_size=4096 build',
    test: 'react-scripts test --env=jsdom',
    eject: 'react-scripts eject'
  },
  proxy: 'https://localhost:8787',
  homepage: '/extensions/periodicjs.ext.reactapp',
  browserslist: ['>0.2%', 'not dead', 'not ie <= 11', 'not op_mini all']
};

var windowState = typeof window !== 'undefined' && window.__padmin ? window.__padmin : {};

var initialState = (0, _assign2.default)({ version: packageJSON.version }, _settings2.default, windowState);
initialState.user = (0, _assign2.default)({
  navigation: defaultUserNavigation
}, initialState.user);

// console.log({ initialState });
var settingsReducer = function settingsReducer(state, action) {
  var user = void 0;
  switch (action.type) {
    case _constants2.default.settings.UPDATE_APP_SETTINGS:
      var updatedSettings = action.payload;
      return (0, _assign2.default)({}, state, updatedSettings);
    case _constants2.default.user.PREFERENCE_REQUEST:
      user = (0, _assign2.default)({}, state.user);
      user.preferences = (0, _assign2.default)({}, user.preferences, {
        isFetching: true
      });
      return (0, _assign2.default)({}, state, { user: user });
    case _constants2.default.user.PREFERENCE_LOAD_ERROR:
      user = (0, _assign2.default)({}, state.user);
      user.preferences = (0, _assign2.default)({}, user.preferences, {
        isFetching: false
      }, action.payload);
      return (0, _assign2.default)({}, state, { user: user });
    case _constants2.default.user.PREFERENCE_LOAD_SUCCESS:
      user = (0, _assign2.default)({}, state.user);
      user.preferences = (0, _assign2.default)({}, user.preferences, {
        isFetching: false,
        updatedAt: action.payload.updatedAt,
        timestamp: action.payload.timestamp,
        hasLoaded: true,
        error: undefined
      }, action.payload.preferences);
      return (0, _assign2.default)({}, state, { user: user });
    case _constants2.default.user.NAVIGATION_REQUEST:
      user = (0, _assign2.default)({}, state.user);
      user.navigation = (0, _assign2.default)({}, user.navigation, {
        isFetching: true
      });
      return (0, _assign2.default)({}, state, { user: user });
    case _constants2.default.user.NAVIGATION_LOAD_ERROR:
      user = (0, _assign2.default)({}, state.user);
      user.navigation = (0, _assign2.default)({}, user.navigation, {
        isFetching: false
      }, action.payload);
      return (0, _assign2.default)({}, state, { user: user });
    case _constants2.default.user.NAVIGATION_LOAD_SUCCESS:
      user = (0, _assign2.default)({}, state.user);
      user.navigation = (0, _assign2.default)({}, user.navigation, {
        isFetching: false,
        updatedAt: action.payload.updatedAt,
        timestamp: action.payload.timestamp,
        hasLoaded: true,
        error: undefined
      }, action.payload.navigation);
      return (0, _assign2.default)({}, state, { user: user });
    default:
      return (0, _assign2.default)(initialState, state);
  }
};

exports.default = settingsReducer;