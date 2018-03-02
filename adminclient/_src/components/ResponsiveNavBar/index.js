'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _reactRouter = require('react-router');

var _AppLayoutMap = require('../AppLayoutMap');

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  activeLinkStyle: _react.PropTypes.object,
  linkProps: _react.PropTypes.object,
  navData: _react.PropTypes.array,
  navSections: _react.PropTypes.array,
  params: _react.PropTypes.array,
  active: _react.PropTypes.boolean
};

var defaultProps = {
  activeLinkStyle: {},
  navData: [],
  navSections: [],
  params: [],
  linkProps: {},
  toggleData: {}
};

var ResponsiveNavBar = function (_Component) {
  (0, _inherits3.default)(ResponsiveNavBar, _Component);

  function ResponsiveNavBar(props) {
    (0, _classCallCheck3.default)(this, ResponsiveNavBar);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ResponsiveNavBar.__proto__ || (0, _getPrototypeOf2.default)(ResponsiveNavBar)).call(this, props));

    var navData = props.navData || [];
    var navSections = props.navSections || [];
    var params = props.params || [];
    var linkProps = props.linkProps || {};
    var toggleData = props.toggleData || {};
    _this.state = {
      initialActiveIndex: -1,
      activeIndex: _this.props.navSections.map(function (section, idx) {
        if (_this.props.navData[idx]) {
          _this.props.navData[idx].map(function (link, linkIdx) {
            var linkURL = _this.getBaseUrl(section.baseURL, _this.props.params, _this.props, linkIdx);
            link.linkURL = linkURL;
          });
          return idx;
        }
      })
    };
    _this.handleClick = _this.handleClick.bind(_this);
    _this.getBaseUrl = _this.getBaseUrl.bind(_this);
    _this.getRenderedComponent = _AppLayoutMap.getRenderedComponent.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(ResponsiveNavBar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'getBaseUrl',
    value: function getBaseUrl(baseurl, params, prop, index) {
      var returnLink = baseurl;
      if (params && params.length > 0) {
        params.forEach(function (param) {
          if (param.key === ":index") {
            returnLink = returnLink.replace(":index", index);
          } else {
            returnLink = returnLink.replace(param.key, prop[param.val]);
          }
        });
      }
      return returnLink;
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e, titleProps) {
      var index = titleProps.index;
      var activeIndex = this.state.activeIndex;

      if (activeIndex.indexOf(index) === -1) {
        this.setState({
          activeIndex: [].concat((0, _toConsumableArray3.default)(activeIndex), [index])
        });
      } else {
        var newIndexArray = activeIndex;
        newIndexArray.splice(newIndexArray.indexOf(index), 1);
        this.setState({
          activeIndex: newIndexArray
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var activeIndex = this.state.activeIndex;

      var navMenu = this.props.navSections.map(function (section, idx) {
        if (section.toggle && !_this2.props.toggleData[section.toggle]) {
          return;
        }

        var subMenu = _this2.props.navData[idx].map(function (link, linkIdx) {
          var itemProps = _this2.props.linkProps && _this2.props.linkProps.className ? _this2.props.linkProps.className : '';
          var activeClass = link.linkURL === _this2.props.location.pathname ? 'active-nav-link nav-link' + itemProps : 'nav-link' + itemProps;
          return _react2.default.createElement(
            'div',
            (0, _extends3.default)({}, _this2.props.itemProps, {
              key: idx + '-' + linkIdx,
              className: activeClass }),
            _react2.default.createElement(
              _reactRouter.Link,
              (0, _extends3.default)({
                to: link.linkURL
              }, _this2.props.linkProps),
              link.name
            ),
            section.buttons ? section.buttons.map(function (button) {
              return _this2.getRenderedComponent((0, _assign2.default)({
                component: 'ResponsiveButton',
                props: (0, _assign2.default)({
                  buttonProps: {}
                }, button.passProps, {
                  onclickProps: _this2.getBaseUrl(button.passProps.onclickBaseUrl, button.passProps.onclickLinkParams, _this2.props, linkIdx),
                  onclickBaseUrl: null,
                  onclickLinkParams: null
                })
              }));
            }) : null
          );
        });

        return _react2.default.createElement(
          _semanticUiReact.Menu.Item,
          _this2.props.sectionProps,
          _react2.default.createElement(_semanticUiReact.Accordion.Title, (0, _extends3.default)({
            active: activeIndex.indexOf(idx) !== -1,
            index: idx, onClick: _this2.handleClick,
            content: section.title
          }, _this2.props.titleProps)),
          _react2.default.createElement(
            _semanticUiReact.Accordion.Content,
            (0, _extends3.default)({
              active: activeIndex.indexOf(idx) !== -1
            }, _this2.props.contentProps),
            subMenu
          )
        );
      });
      return _react2.default.createElement(
        _semanticUiReact.Accordion,
        (0, _extends3.default)({
          as: _semanticUiReact.Menu,
          vertical: true
        }, this.props.accordionProps),
        navMenu
      );
    }
  }]);
  return ResponsiveNavBar;
}(_react.Component);

ResponsiveNavBar.propType = propTypes;
ResponsiveNavBar.defaultProps = defaultProps;

exports.default = ResponsiveNavBar;