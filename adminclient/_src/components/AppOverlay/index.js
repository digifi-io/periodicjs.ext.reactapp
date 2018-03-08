'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _reBulma = require('re-bulma');

var _overlay = require('../AppSectionLoading/overlay');

var _overlay2 = _interopRequireDefault(_overlay);

var _AppLayoutMap = require('../AppLayoutMap');

var _util = require('../../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotificationUI = function (_Component) {
  (0, _inherits3.default)(NotificationUI, _Component);

  function NotificationUI() {
    (0, _classCallCheck3.default)(this, NotificationUI);
    return (0, _possibleConstructorReturn3.default)(this, (NotificationUI.__proto__ || (0, _getPrototypeOf2.default)(NotificationUI)).apply(this, arguments));
  }

  (0, _createClass3.default)(NotificationUI, [{
    key: 'render',
    value: function render() {
      var colorMap = {
        primary: 'isPrimary',
        info: 'isInfo',
        success: 'isSuccess',
        warning: 'isWarning',
        warn: 'isWarning',
        error: 'isDanger',
        danger: 'isDanger'
      };
      // closeButtonProps={{ onClick: () => console.log('clicked',this.props) }}
      return _react2.default.createElement(
        _reBulma.Notification,
        {
          color: colorMap[this.props.type],
          closeButtonProps: this.props.hide,
          style: { marginBottom: '1rem', marginLeft: '1rem' },
          enableCloseButton: true,
          className: 'animated fadeInLeft Medium-Speed'
        },
        typeof this.props.text !== 'string' ? this.props.dynamicRenderComponent(this.props.text) : this.props.text
      );
    }
  }]);
  return NotificationUI;
}(_react.Component);

var ModalUI = function (_Component2) {
  (0, _inherits3.default)(ModalUI, _Component2);

  function ModalUI() {
    (0, _classCallCheck3.default)(this, ModalUI);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (ModalUI.__proto__ || (0, _getPrototypeOf2.default)(ModalUI)).apply(this, arguments));

    _this2.state = {
      ui_is_loaded: false,
      async_data_is_loaded: false
    };
    _this2.uiLayout = {};
    _this2.uiResources = {};
    _this2.title = '';
    _this2.footer = '';
    _this2.text = '';
    _this2.getState = _this2.props.getState;
    _this2.getRenderedComponent = _this2.props.dynamicRenderComponent.bind(_this2);
    _this2.fetchData = _util2.default.fetchDynamicContent.bind(_this2);
    _this2.modalPathname = _this2.props.pathname;
    return _this2;
  }

  (0, _createClass3.default)(ModalUI, [{
    key: 'handleComponentLifecycle',
    value: function handleComponentLifecycle() {
      var _this3 = this;

      this.uiLayout = {};
      this.uiResources = {
        modalProps: {
          formdata: this.props.formdata,
          pathname: this.props.pathname,
          modalPathname: this.modalPathname,
          title: this.props.title
        }
      };
      if (typeof this.props.pathname === 'string') {
        if (this.props.pathnameParams && this.props.pathnameParams.length > 0) {
          this.props.pathnameParams.forEach(function (param) {
            _this3.modalPathname = _this3.modalPathname.replace(param.key, _this3.props.formdata[param.val]);
          });
        }
        this.fetchData(this.modalPathname);
      }
      this.title = this.props.title;
      this.footer = this.props.footer;
      this.text = this.props.text;
      this.setState({ ui_is_loaded: false, async_data_is_loaded: false });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleComponentLifecycle();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this.handleComponentLifecycle();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var initialize = function initialize(content) {
        var passedProps = {
          modalProps: {
            formdata: _this4.props.formdata,
            pathname: _this4.props.pathname,
            modalPathname: _this4.modalPathname,
            title: _this4.props.title
          }
        };

        // if (typeof this.text === 'object' && this.text.layout) {
        // }

        var modelContent = content ? content : typeof _this4.text !== 'string' ? _this4.props.dynamicRenderComponent(_this4.text, passedProps, true) : _this4.text;
        var footerContent = _this4.footer ? (0, _typeof3.default)(_this4.footer) === 'object' ? _this4.props.dynamicRenderComponent(_this4.footer) : _react2.default.createElement(
          'div',
          { style: { padding: '20px' } },
          _this4.footer
        ) : undefined;

        return _react2.default.createElement(
          'div',
          { style: (0, _assign2.default)({
              position: 'fixed',
              height: '100%',
              width: '100%',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(17,17,17,.6)'
            }, _this4.props.overlayProps) },
          _react2.default.createElement(
            _reBulma.Modal,
            {
              type: 'card',
              headerContent: (0, _typeof3.default)(_this4.title) === 'object' ? _this4.props.dynamicRenderComponent(_this4.title) : _this4.title,
              footerContent: footerContent,
              isActive: true,
              onCloseRequest: _this4.props.hide,
              className: 'animated ' + _this4.props.modalClassName + ' ' + (_this4.props.animation ? _this4.props.animation : 'zoomIn') + ' Medium-Speed',
              showOverlayCloseButton: false
            },
            _this4.props.noContentWrapper ? _react2.default.createElement(
              'div',
              _this4.props.modalContentProps,
              modelContent
            ) : _react2.default.createElement(
              _reBulma.Content,
              _this4.props.modalContentProps,
              modelContent
            )
          )
        );
      };
      if (typeof this.props.pathname === 'string') {
        return this.state.ui_is_loaded === false ? initialize(_react2.default.createElement(_overlay2.default, { display: true, heroProps: { size: "isSmall" } })) : initialize(this.uiLayout);
      } else return initialize();
    }
  }]);
  return ModalUI;
}(_react.Component);

var Overlay = function (_Component3) {
  (0, _inherits3.default)(Overlay, _Component3);

  function Overlay(props) {
    (0, _classCallCheck3.default)(this, Overlay);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (Overlay.__proto__ || (0, _getPrototypeOf2.default)(Overlay)).call(this, props));

    _this5.getRenderedComponent = _AppLayoutMap.getRenderedComponent.bind(_this5);
    return _this5;
  }

  (0, _createClass3.default)(Overlay, [{
    key: 'render',
    value: function render() {
      var _this6 = this;

      // console.log('Overlay this.props.notification', this.props.notification);
      window.overlayProps = this.props;
      var overlayStyleOverrides = this.props.getState().settings.ui.overlayStyleProps;
      var notices = this.props.notification.notifications && this.props.notification.notifications.length > 0 ? this.props.notification.notifications.map(function (notice, key) {
        return _react2.default.createElement(NotificationUI, (0, _extends3.default)({ dynamicRenderComponent: _this6.getRenderedComponent, hide: {
            onClick: function onClick() {
              _this6.props.hideNotification(notice.id);
            }
          }, key: key }, notice));
      }) : null;
      var modal = this.props.notification.modals && this.props.notification.modals.length > 0 ? this.props.notification.modals.map(function (modal, index) {
        return _react2.default.createElement(ModalUI, (0, _extends3.default)({}, _this6.props.notification.modals[index], {
          getState: _this6.props.getState,
          key: index,
          hide: function hide() {
            _this6.props.hideModal(_this6.props.notification.modals[index].id);
          },
          dynamicRenderComponent: _this6.getRenderedComponent }));
      })
      // <ModalUI {...this.props.notification.modals[ this.props.notification.modals.length - 1 ]}
      //   getState={this.props.getState}
      //   hide={() => {
      //     this.props.hideModal(this.props.notification.modals[0].id);
      //   } }  
      //   dynamicRenderComponent={this.getRenderedComponent} />
      : null;
      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({ className: '__reactapp_overlay' }, overlayStyleOverrides, { style: { position: 'fixed', bottom: 0, width: 'auto', zIndex: 100000 } }),
        modal,
        notices
      );
    }
  }]);
  return Overlay;
}(_react.Component);

exports.default = Overlay;