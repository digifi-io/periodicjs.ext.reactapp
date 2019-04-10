'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _contentExplorer = require('box-ui-elements/es/elements/content-explorer');

var _contentExplorer2 = _interopRequireDefault(_contentExplorer);

var _enUS = require('box-ui-elements/i18n/en-US');

var _enUS2 = _interopRequireDefault(_enUS);

var _AppLayoutMap = require('../AppLayoutMap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  // example props for the demo
  // autoFocus: PropTypes.bool,
};

var defaultProps = {};
function getToken() {
  this.props.token = 'abc123';
}

var BoxContentExplorer = function (_Component) {
  (0, _inherits3.default)(BoxContentExplorer, _Component);

  function BoxContentExplorer(props) {
    (0, _classCallCheck3.default)(this, BoxContentExplorer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BoxContentExplorer.__proto__ || (0, _getPrototypeOf2.default)(BoxContentExplorer)).call(this, props));

    _this.getToken = getToken.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(BoxContentExplorer, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_contentExplorer2.default, {
          language: 'en-US',
          messages: _enUS2.default,
          token: this.getToken(),
          contentPreviewProps: {
            contentSidebarProps: {
              hasActivityFeed: true,
              hasSkills: true,
              hasMetadata: true,
              detailsSidebarProps: {
                hasProperties: true,
                hasNotices: true,
                hasAccessStats: true,
                hasVersions: true
              }
            }
          }
        })
      );
    }
  }]);
  return BoxContentExplorer;
}(_react.Component);

BoxContentExplorer.propTypes = propTypes;
BoxContentExplorer.defaultProps = defaultProps;

exports.default = BoxContentExplorer;