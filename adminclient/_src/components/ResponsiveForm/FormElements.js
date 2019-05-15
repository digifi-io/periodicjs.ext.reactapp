'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _clearImmediate2 = require('babel-runtime/core-js/clear-immediate');

var _clearImmediate3 = _interopRequireDefault(_clearImmediate2);

var _setImmediate2 = require('babel-runtime/core-js/set-immediate');

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.getPropertyAttribute = getPropertyAttribute;
exports.getFormDNDTable = getFormDNDTable;
exports.getFormDatatable = getFormDatatable;
exports.getFormDatalist = getFormDatalist;
exports.getFormDropdown = getFormDropdown;
exports.getFormRemoteDropdown = getFormRemoteDropdown;
exports.getFormMaskedInput = getFormMaskedInput;
exports.getFormTextInputArea = getFormTextInputArea;
exports.getFormImageCropper = getFormImageCropper;
exports.getFormTextArea = getFormTextArea;
exports.getFormSelect = getFormSelect;
exports.getFormCheckbox = getFormCheckbox;
exports.getFormButton = getFormButton;
exports.getFormSemanticCheckbox = getFormSemanticCheckbox;
exports.getFormProgressSteps = getFormProgressSteps;
exports.getFormSwitch = getFormSwitch;
exports.getRawInput = getRawInput;
exports.getSliderInput = getSliderInput;
exports.getHiddenInput = getHiddenInput;
exports.getImage = getImage;
exports.getFormLink = getFormLink;
exports.getFormGroup = getFormGroup;
exports.getFormTabs = getFormTabs;
exports.getFormCode = getFormCode;
exports.getFormColorPicker = getFormColorPicker;
exports.getFormDatePicker = getFormDatePicker;
exports.getFormEditor = getFormEditor;
exports.getFormSubmit = getFormSubmit;
exports.getCardFooterItem = getCardFooterItem;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormItem = require('../FormItem');

var _FormItem2 = _interopRequireDefault(_FormItem);

var _RACodeMirror = require('../RACodeMirror');

var _RACodeMirror2 = _interopRequireDefault(_RACodeMirror);

var _PreviewEditor = require('../PreviewEditor');

var _PreviewEditor2 = _interopRequireDefault(_PreviewEditor);

var _ResponsiveDatalist = require('../ResponsiveDatalist');

var _ResponsiveDatalist2 = _interopRequireDefault(_ResponsiveDatalist);

var _ResponsiveTable = require('../ResponsiveTable');

var _ResponsiveTable2 = _interopRequireDefault(_ResponsiveTable);

var _DNDTable = require('../DNDTable');

var _DNDTable2 = _interopRequireDefault(_DNDTable);

var _RemoteDropdown = require('../RemoteDropdown');

var _RemoteDropdown2 = _interopRequireDefault(_RemoteDropdown);

var _ResponsiveTabs = require('../ResponsiveTabs');

var _ResponsiveTabs2 = _interopRequireDefault(_ResponsiveTabs);

var _SingleDatePickerWrapper = require('../SingleDatePickerWrapper');

var _SingleDatePickerWrapper2 = _interopRequireDefault(_SingleDatePickerWrapper);

var _DateRangePickerWrapper = require('../DateRangePickerWrapper');

var _DateRangePickerWrapper2 = _interopRequireDefault(_DateRangePickerWrapper);

var _ColorPicker = require('../ColorPicker');

var _ColorPicker2 = _interopRequireDefault(_ColorPicker);

var _createNumberMask = require('text-mask-addons/dist/createNumberMask');

var _createNumberMask2 = _interopRequireDefault(_createNumberMask);

var _capitalize = require('capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _util = require('../../util');

var _util2 = _interopRequireDefault(_util);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _rcSlider = require('rc-slider');

var _rcSlider2 = _interopRequireDefault(_rcSlider);

var _rcSwitch = require('rc-switch');

var _rcSwitch2 = _interopRequireDefault(_rcSwitch);

var _reBulma = require('re-bulma');

var _reactTextMask = require('react-text-mask');

var _reactTextMask2 = _interopRequireDefault(_reactTextMask);

var _semanticUiReact = require('semantic-ui-react');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

var _styles = require('../../styles');

var _styles2 = _interopRequireDefault(_styles);

var _ResponsiveCropper = require('../ResponsiveCropper');

var _ResponsiveCropper2 = _interopRequireDefault(_ResponsiveCropper);

var _FormHelpers = require('./FormHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import RAEditor from '../RAEditor';
// import ResponsiveButton from '../ResponsiveButton';
// import { EditorState, } from 'draft-js';
function getPropertyAttribute(options) {
  var property = options.property,
      element = options.element;

  var attribute = element.name;
  var selector = element.idSelector;
  // console.log({ options });
  var returnVal = void 0;
  if (attribute.indexOf('.') === -1) {
    returnVal = property[attribute];
  } else {
    var attrArray = attribute.split('.');
    returnVal = property[attrArray[0]] ? property[attrArray[0]][attrArray[1]] : undefined;
  }

  if (selector && !options.skipSelector) {
    return returnVal[selector];
  } else {
    return returnVal;
  }
}

function getErrorStatus(state, name) {
  return state.formDataErrors && state.formDataErrors[name];
}

function getValidStatus(state, name) {
  return state.formDataValid && state.formDataValid[name];
}

function getFormElementHelp(hasError, state, name) {
  return hasError ? {
    color: 'isDanger',
    text: state.formDataErrors[name][0]
  } : undefined;
}

function getCustomErrorLabel(hasError, state, formelement) {
  return hasError ? _react2.default.createElement(
    'span',
    { className: '__re-bulma_help __re-bulma_is-danger', style: formelement.customErrorProps },
    state.formDataErrors[formelement.name][0]
  ) : null;
}

function getCustomErrorIcon(hasError, isValid, state, formelement) {
  var iconStyle = formelement.customIconStyle;
  var iconVar = hasError ? formelement.errorIcon || 'fa fa-exclamation' : isValid ? formelement.validIcon || 'fa fa-check' : formelement.initialIcon ? formelement.initialIcon : '';

  return formelement.errorIconRight || formelement.errorIconLeft ? _react2.default.createElement('i', { className: '__re-bulma_fa ' + iconVar, style: iconStyle }) : null;
}

function getCustomLeftIcon(formElement, state) {
  state = state || {};
  var iconVar = formElement.updateIconOnChange && state[formElement.name] ? formElement.options.filter(function (obj) {
    return obj.value === state[formElement.name];
  })[0].icon : formElement.leftIcon ? formElement.leftIcon : null;
  if (iconVar) {
    return _react2.default.createElement('i', { className: '__re-bulma_icon icon ' + iconVar, style: { position: 'absolute', top: '9px', left: '6px', zIndex: 1 }, 'aria-hidden': 'true' });
  }
}

function valueChangeHandler(formElement) {
  var _this = this;

  return function (event) {
    var text = event.target.value;
    // console.debug({ text, formElement, });
    var updatedStateProp = {};
    updatedStateProp[formElement.name] = text;
    if (formElement.onChangeFilter) {
      var onChangeFunc = getFunctionFromProps.call(_this, { propFunc: formElement.onChangeFilter });
      updatedStateProp = onChangeFunc.call(_this, (0, _assign2.default)({}, _this.state, updatedStateProp), updatedStateProp);
    }
    _this.setState(updatedStateProp, function () {
      if (formElement.validateOnChange) {
        _this.validateFormElement({ formElement: formElement });
      } else if (formElement.valueCheckOnChange) {
        _this.valueCheckFormElement({ formElement: formElement });
      }
    });
  };
}

function getFormLabel(formElement) {
  return formElement.label ? formElement.layoutProps && formElement.layoutProps.horizontalform ? _react2.default.createElement(
    _reBulma.ControlLabel,
    formElement.labelProps,
    this && this.state && this.state[formElement.formdata_label] ? this.state[formElement.formdata_label] : formElement.label
  ) : _react2.default.createElement(
    _reBulma.Label,
    formElement.labelProps,
    this && this.state && this.state[formElement.formdata_label] ? this.state[formElement.formdata_label] : formElement.label
  ) : null;
}
function getCustomFormLabel(formElement) {
  return formElement.customLabel ? formElement.layoutProps && formElement.layoutProps.horizontalform ? _react2.default.createElement(
    _reBulma.ControlLabel,
    formElement.labelProps,
    formElement.label && !Array.isArray(formElement.customLabel) && (0, _typeof3.default)(formElement.customLabel) === 'object' ? this.getRenderedComponent(formElement.customLabel) : formElement.customLabel
  ) : _react2.default.createElement(
    _reBulma.Label,
    formElement.labelProps,
    formElement.customLabel && !Array.isArray(formElement.customLabel) && (0, _typeof3.default)(formElement.customLabel) === 'object' ? this.getRenderedComponent(formElement.customLabel) : formElement.customLabel
  ) : null;
}
function getInitialValue(formElement, state) {
  // console.debug({formElement, state})
  var formElementValue = formElement.value;

  if (!formElement.showNullValue && (state[formElement.name] === null || formElementValue === null || formElementValue === 'null')) {
    return '';
  } else {
    var returnVal = typeof state[formElement.name] !== 'undefined' ? state[formElement.name] : formElementValue;

    if (formElement.momentFormat) {
      returnVal = (0, _moment2.default)(returnVal).format(formElement.momentFormat);
    }
    if (formElement.numeralFormat) {
      returnVal = (0, _numeral2.default)(returnVal).format(formElement.numeralFormat);
    }

    return returnVal;
  }
}

function getPassablePropsKeyEvents(passableProps, formElement) {
  var _this2 = this;

  if (formElement.keyPress) {
    var customKeyPress = function customKeyPress() {};
    if (typeof formElement.keyPress === 'string' && formElement.keyPress.indexOf('func:this.props') !== -1) {
      customKeyPress = this.props[formElement.keyPress.replace('func:this.props.', '')];
    } else if (typeof formElement.keyPress === 'string' && formElement.keyPress.indexOf('func:window') !== -1 && typeof window[formElement.keyPress.replace('func:window.', '')] === 'function') {
      customKeyPress = window[formElement.keyPress.replace('func:window.', '')].bind(this);
      // console.debug({ customKeyPress });
    }
    passableProps.onKeyPress = function (e) {
      if (formElement.validateOnKeypress) {
        _this2.validateFormElement({ formElement: formElement });
      }
      customKeyPress(e, formElement);
      // console.debug('custom press');
    };
  } else if (formElement.submitOnEnter) {
    passableProps.onKeyPress = function (e) {
      if (formElement.submitOnEnter && (e.key === 'Enter' || e.which === 13)) {
        _this2.submitForm();
      }
    };
  }
  if (formElement.onBlur) {
    var customonBlur = function customonBlur() {};
    if (typeof formElement.onBlur === 'string' && formElement.onBlur.indexOf('func:this.props') !== -1) {
      customonBlur = this.props[formElement.onBlur.replace('func:this.props.', '')];
    } else if (typeof formElement.onBlur === 'string' && formElement.onBlur.indexOf('func:window') !== -1 && typeof window[formElement.onBlur.replace('func:window.', '')] === 'function') {
      customonBlur = window[formElement.onBlur.replace('func:window.', '')].bind(this);
    }
    passableProps.onBlur = function (e) {
      if (formElement.validateOnBlur) {
        _this2.validateFormElement({ formElement: formElement });
      } else if (formElement.valueCheckOnBlur) {
        _this2.valueCheckFormElement({ formElement: formElement });
      }
      customonBlur(e, formElement);
    };
  }
  if (formElement.onFocus) {
    var customFocus = function customFocus() {};
    if (typeof formElement.onFocus === 'string' && formElement.onFocus.indexOf('func:this.props') !== -1) {
      customFocus = this.props[formElement.onFocus.replace('func:this.props.', '')];
    } else if (typeof formElement.onFocus === 'string' && formElement.onFocus.indexOf('func:window') !== -1 && typeof window[formElement.onFocus.replace('func:window.', '')] === 'function') {
      customFocus = window[formElement.onFocus.replace('func:window.', '')].bind(this);
    }
    passableProps.onFocus = function (e) {
      customFocus(e, formElement);
    };
  }
  if (formElement.keyUp) {
    var customkeyUp = function customkeyUp() {};
    if (typeof formElement.keyUp === 'string' && formElement.keyUp.indexOf('func:this.props') !== -1) {
      customkeyUp = this.props[formElement.keyUp.replace('func:this.props.', '')];
    } else if (typeof formElement.keyUp === 'string' && formElement.keyUp.indexOf('func:window') !== -1 && typeof window[formElement.keyUp.replace('func:window.', '')] === 'function') {
      customkeyUp = window[formElement.keyUp.replace('func:window.', '')].bind(this);
    }
    passableProps.onKeyUp = function (e) {
      if (formElement.validateOnKeyup) {
        _this2.validateFormElement({ formElement: formElement });
      }
      customkeyUp(e, formElement);
    };
  }
  return passableProps;
}

function getFunctionFromProps(options) {
  var propFunc = options.propFunc;


  if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props.reduxRouter') !== -1) {
    return this.props.reduxRouter[this.props.replace('func:this.props.reduxRouter.', '')];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props') !== -1) {
    return this.props[this.props.replace('func:this.props.', '')];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:window') !== -1 && typeof window[propFunc.replace('func:window.', '')] === 'function') {
    return window[propFunc.replace('func:window.', '')];
  } else if (typeof this.props[propFunc] === 'function') {
    return propFunc;
  } else {
    return function () {};
  }
}

function getFormDNDTable(options) {
  var _this3 = this;

  var formElement = options.formElement,
      i = options.i;
  // let initialValue = getInitialValue(formElement,
  // (Object.keys(this.state.formDataTables).length && this.state.formDataTables[formElement.name])?this.state.formDataTables :  Object.assign({}, this.state, unflatten(this.state, { overwrite: true })));

  var initialValue = this.state[formElement.name];
  // console.debug({ initialValue },this.state, this.state[formElement.name]);
  var hasError = getErrorStatus(this.state, formElement.name);
  var getTableHeaders = function getTableHeaders(row) {
    return row.map(function (rowkey) {
      var selectOptions = _this3.state.__formOptions && _this3.state.__formOptions[rowkey] ? _this3.state.__formOptions[rowkey] : [];
      // console.log({ selectOptions });
      return {
        label: (0, _capitalize2.default)(rowkey),
        sortid: rowkey,
        sortable: typeof formElement.sortable !== 'undefined' ? formElement.sortable : true,
        formtype: formElement.tableHeaderType && formElement.tableHeaderType[rowkey] ? formElement.tableHeaderType[rowkey] : 'text',
        defaultValue: formElement.tableHeaderDefaultValue && formElement.tableHeaderDefaultValue[rowkey] ? formElement.tableHeaderDefaultValue[rowkey] : selectOptions.length ? selectOptions[0].value : undefined,
        formoptions: selectOptions,
        footerFormElementPassProps: (0, _assign2.default)({
          placeholder: (0, _capitalize2.default)(rowkey)
        }, formElement.footerFormElementPassProps)
      };
    });
  };
  var handleRowUpdate = function handleRowUpdate() {
    console.debug('Error handleRowUpdate function does not exists');
  };
  if (formElement.handleRowUpdate && formElement.handleRowUpdate.indexOf('func:window') !== -1 && typeof window[formElement.handleRowUpdate.replace('func:window.', '')] === 'function') {
    handleRowUpdate = window[formElement.handleRowUpdate.replace('func:window.', '')].bind(this, formElement);
  }
  var useRowButtons = formElement.rowButtons;
  var ignoreTableHeaders = formElement.ignoreTableHeaders || [];
  var tableHeaders = formElement.headers ? formElement.useStandardHeaders ? getTableHeaders(formElement.headers.map(function (header) {
    return header.sortid;
  })) : formElement.headers : initialValue && Array.isArray(initialValue) && initialValue.length ? getTableHeaders((0, _keys2.default)(initialValue[0]).filter(function (header) {
    return ignoreTableHeaders.indexOf(header) === -1;
  })) : [];
  tableHeaders = useRowButtons ? tableHeaders.concat({
    label: formElement.rowOptionsLabel || '',
    formtype: false,
    formRowButtons: true,
    formRowButtonProps: formElement.formRowButtonProps
  }) : tableHeaders.concat({
    label: '',
    formtype: false
  });
  tableHeaders = tableHeaders.map(function (header) {
    if ((header.formtype === 'select' || header.formtype === 'dropdown') && !header.formoptions) {
      header.formoptions = header.sortid && _this3.state.__formOptions && _this3.state.__formOptions[header.sortid] ? _this3.state.__formOptions[header.sortid] : [];
    }
    return header;
  });
  var passedProps = (0, _assign2.default)({}, this.props, {
    rows: initialValue,
    headers: tableHeaders,
    toggleRowKeys: formElement.toggleRowKeys,
    toggleRowClass: formElement.toggleRowClass
  }, formElement.passProps);
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    getFormLabel(formElement),
    _react2.default.createElement(_DNDTable2.default, (0, _extends3.default)({}, passedProps, {
      handleRowUpdate: handleRowUpdate.bind(this),
      value: initialValue })),
    getCustomErrorLabel(hasError, this.state, formElement)
  );
}

function getFormDatatable(options) {
  var _this4 = this;

  var formElement = options.formElement,
      i = options.i;

  var initialValue = getInitialValue(formElement, (0, _keys2.default)(this.state.formDataTables).length && this.state.formDataTables[formElement.name] ? this.state.formDataTables : (0, _assign2.default)({}, this.state, (0, _flat.unflatten)(this.state, { overwrite: true })));
  // console.debug({ initialValue },this.state, this.state[formElement.name]);
  var hasError = getErrorStatus(this.state, formElement.name);
  var getTableHeaders = function getTableHeaders(row) {
    return row.map(function (rowkey) {
      var selectOptions = _this4.state.__formOptions && _this4.state.__formOptions[rowkey] ? _this4.state.__formOptions[rowkey] : [];
      return {
        label: (0, _capitalize2.default)(rowkey),
        sortid: rowkey,
        sortable: typeof formElement.sortable !== 'undefined' ? formElement.sortable : true,
        formtype: formElement.tableHeaderType && formElement.tableHeaderType[rowkey] ? formElement.tableHeaderType[rowkey] : 'text',
        defaultValue: formElement.tableHeaderDefaultValue && formElement.tableHeaderDefaultValue[rowkey] ? formElement.tableHeaderDefaultValue[rowkey] : selectOptions.length ? selectOptions[0].value : undefined,
        formoptions: selectOptions,
        footerFormElementPassProps: (0, _assign2.default)({
          placeholder: (0, _capitalize2.default)(rowkey)
        }, formElement.footerFormElementPassProps)
      };
    });
  };
  var useRowButtons = formElement.rowButtons;
  var ignoreTableHeaders = formElement.ignoreTableHeaders || [];
  var tableHeaders = formElement.headers ? formElement.useStandardHeaders ? getTableHeaders(formElement.headers.map(function (header) {
    return header.sortid;
  })) : formElement.headers : initialValue && Array.isArray(initialValue) && initialValue.length ? getTableHeaders((0, _keys2.default)(initialValue[0]).filter(function (header) {
    return ignoreTableHeaders.indexOf(header) === -1;
  })) : [];
  tableHeaders = useRowButtons ? tableHeaders.concat({
    label: formElement.rowOptionsLabel || '',
    formtype: false,
    formRowButtons: true,
    formRowButtonProps: formElement.formRowButtonProps
  }) : tableHeaders.concat({
    label: '',
    formtype: false
  });
  tableHeaders = tableHeaders.map(function (header) {
    if ((header.formtype === 'select' || header.formtype === 'dropdown') && !header.formoptions) {
      header.formoptions = header.sortid && _this4.state.__formOptions && _this4.state.__formOptions[header.sortid] ? _this4.state.__formOptions[header.sortid] : [];
    }
    return header;
  });
  var passedProps = (0, _assign2.default)({}, this.props, {
    selectEntireRow: formElement.selectEntireRow,
    insertSelectedRowHeaderIndex: formElement.insertSelectedRowHeaderIndex,
    selectOptionSortId: formElement.selectOptionSortId,
    selectOptionSortIdLabel: formElement.selectOptionSortIdLabel,
    flattenRowData: formElement.flattenRowData,
    addNewRows: formElement.addNewRows,
    sortable: formElement.sortable,
    replaceButton: false,
    uploadAddButton: true,
    useInputRows: formElement.useInputRows,
    rows: initialValue,
    headers: tableHeaders,
    limit: 5000,
    hasPagination: false,
    tableForm: true,
    uniqueFormOptions: formElement.uniqueFormOptions
  }, formElement.passProps); // formElement.datalist,
  // console.log({ tableHeaders, useRowButtons,passedProps });
  // console.debug({tableHeaders})
  // let shape ={};// this is the header of of the footer which has elements for new insert
  // let inlineshape ={};// if true, should look like a regular form row, else form below
  // console.debug({formElement,initialValue, },'this.state',this.state);
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    getFormLabel(formElement),
    _react2.default.createElement(_ResponsiveTable2.default, (0, _extends3.default)({}, passedProps, {
      onChange: function onChange(newvalue) {
        var selectedRowData = formElement.selectEntireRow && (newvalue.selectedRowData || newvalue.selectedRowIndex) ? (0, _defineProperty3.default)({}, formElement.name + '__tabledata', {
          selectedRowData: newvalue.selectedRowData,
          selectedRowIndex: newvalue.selectedRowIndex
        }) : {};
        var flattenedData = _this4.props.flattenFormData ? (0, _flat2.default)((0, _assign2.default)({}, selectedRowData, (0, _defineProperty3.default)({}, formElement.name, newvalue.rows))) : {};
        var updatedStateProp = (0, _assign2.default)((0, _defineProperty3.default)({
          formDataTables: (0, _assign2.default)({}, _this4.state.formDataTables, (0, _defineProperty3.default)({}, formElement.name, newvalue.rows))
        }, formElement.name, newvalue.rows), flattenedData, selectedRowData);
        if (formElement.onChangeFilter) {
          var onChangeFunc = getFunctionFromProps.call(_this4, { propFunc: formElement.onChangeFilter });
          updatedStateProp = onChangeFunc.call(_this4, (0, _assign2.default)({}, _this4.state, updatedStateProp), updatedStateProp);
        }
        // console.debug('DATATABLE', updatedStateProp);
        _this4.setState(updatedStateProp);
      },
      value: initialValue })),
    getCustomErrorLabel(hasError, this.state, formElement)
  );
}

function getFormDatalist(options) {
  var _this5 = this;

  var formElement = options.formElement,
      i = options.i;

  var initialValue = getInitialValue(formElement, (0, _assign2.default)({}, this.state, (0, _flat.unflatten)(this.state)));
  var hasError = getErrorStatus(this.state, formElement.name);
  var passedProps = (0, _assign2.default)({}, this.props, {
    wrapperProps: {
      style: {
        display: 'flex',
        width: '100%',
        flex: '5',
        alignItems: 'stretch',
        flexDirection: 'column'
      }
    },
    passableProps: {
      help: getFormElementHelp(hasError, this.state, formElement.name),
      color: hasError ? 'isDanger' : undefined,
      icon: hasError ? formElement.errorIcon || 'fa fa-exclamation' : undefined,
      placeholder: formElement.placeholder,
      style: {
        width: '100%'
      }
    }
  }, formElement.datalist);
  // console.debug({formElement,initialValue, },'this.state',this.state);
  // console.debug({ passedProps });
  if (formElement.datalist.staticSearch) {
    // let datalistdata = this.state[formElement.name];
    var datalistdata = [];
    if (this.props.__formOptions && this.props.__formOptions[formElement.name]) {
      datalistdata = this.props.__formOptions[formElement.name];
    } else {
      datalistdata = this.props.formdata[(0, _pluralize2.default)(formElement.datalist.entity)] || [];
    }
    passedProps.datalistdata = datalistdata;
  }
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    getFormLabel(formElement),
    _react2.default.createElement(_ResponsiveDatalist2.default, (0, _extends3.default)({}, passedProps, {
      onChange: function onChange(newvalue) {
        var updatedStateProp = {};
        updatedStateProp[formElement.name] = newvalue;
        _this5.setState(updatedStateProp);
      },
      value: initialValue }))
  );
}
function getFormDropdown(options) {
  var _this6 = this;

  var formElement = options.formElement,
      i = options.i;

  var initialValue = getInitialValue(formElement, (0, _assign2.default)({}, this.state, (0, _flat.unflatten)(this.state)));
  var hasError = getErrorStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  var isValid = getValidStatus(this.state, formElement.name);
  var customLabel = getCustomFormLabel.bind(this);
  var wrapperProps = (0, _assign2.default)({
    className: '__re-bulma_control'
  }, formElement.wrapperProps);

  wrapperProps.className = (hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft) ? formElement.errorIconRight ? wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-right' : wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-left' : wrapperProps.className;
  wrapperProps.className = formElement.leftIcon || formElement.updateIconOnChange ? wrapperProps.className + ' __ra-left-icon' : wrapperProps.className;

  var _onChange = void 0;
  var passedProps = formElement.passProps;
  var getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passedProps = getPassablePropkeyevents(passedProps, formElement);
  var dropdowndata = [];
  var displayField = formElement.passProps.displayField ? formElement.passProps.displayField : 'label';
  var valueField = formElement.passProps.valueField ? formElement.passProps.valueField : 'value';
  var imageField = formElement.passProps.imageField ? formElement.passProps.imageField : 'image';
  if (this.props.__formOptions && formElement.formoptions_field && this.props.__formOptions[formElement.formoptions_field]) {
    dropdowndata = this.props.__formOptions[formElement.formoptions_field];
    dropdowndata = dropdowndata.map(function (option) {
      return option[imageField] ? { text: option[displayField], value: option[valueField], key: option[valueField], image: { avatar: true, src: option[imageField] } } : { text: option[displayField], value: option[valueField], key: option[valueField], icon: option.icon, selectedLabelStyle: option.selectedLabelStyle, content: option.content ? _this6.getRenderedComponent(option.content) : null };
    });
  } else if (this.props.__formOptions && this.props.__formOptions[formElement.name]) {
    dropdowndata = this.props.__formOptions[formElement.name];
    dropdowndata = dropdowndata.map(function (option) {
      return option[imageField] ? { text: option[displayField], value: option[valueField], key: option[valueField], image: { avatar: true, src: option[imageField] } } : { text: option[displayField], value: option[valueField], key: option[valueField], icon: option.icon, selectedLabelStyle: option.selectedLabelStyle, content: option.content ? _this6.getRenderedComponent(option.content) : null };
    });
  } else {
    dropdowndata = formElement.options || [];
    dropdowndata = dropdowndata.map(function (option) {
      return option[imageField] ? { text: option[displayField], value: option[valueField], key: option[valueField], image: { avatar: true, src: option[imageField] } } : { text: option[displayField], value: option[valueField], key: option[valueField], icon: option.icon, selectedLabelStyle: option.selectedLabelStyle, content: option.content ? _this6.getRenderedComponent(option.content) : null };
    });
  }
  passedProps.options = dropdowndata;
  if (formElement.disableOnChange) {
    _onChange = function onChange() {
      return function () {};
    };
  } else if (!_onChange && formElement.passProps.multiple) {
    _onChange = function onChange(event, newvalue) {
      var updatedStateProp = {};
      newvalue.options.forEach(function (val, idx) {
        if (newvalue.value[idx]) updatedStateProp[formElement.name + '.' + idx] = newvalue.value[idx];else updatedStateProp[formElement.name + '.' + idx] = undefined;
      });
      _this6.setState(updatedStateProp, function () {
        if (formElement.validateOnChange) {
          _this6.validateFormElement({ formElement: formElement });
        } else if (formElement.valueCheckOnChange) {
          _this6.valueCheckFormElement({ formElement: formElement });
        }
      });
    };
  } else if (!_onChange) {
    _onChange = function onChange(event, newvalue) {
      var updatedStateProp = {};
      updatedStateProp[formElement.name] = newvalue.value;
      _this6.setState(updatedStateProp, function () {
        if (formElement.validateOnChange) {
          _this6.validateFormElement({ formElement: formElement });
        } else if (formElement.valueCheckOnChange) {
          _this6.valueCheckFormElement({ formElement: formElement });
        }
      });
    };
  }
  var customCallbackfunction = void 0;
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[formElement.customOnChange.replace('func:this.props.', '')];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
      customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(this, formElement);
    }
  }

  formElement.customIconStyle = (0, _assign2.default)({}, { right: "24px" }, formElement.customIconStyle);

  if (formElement.passProps.multiple && Array.isArray((0, _flat.unflatten)(this.state)[formElement.name])) {
    initialValue = (0, _flat.unflatten)(this.state)[formElement.name].filter(function (i) {
      return i !== undefined;
    });
  }
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { initialIcon: formElement.initialIcon, isValid: isValid, hasError: hasError, hasValue: hasValue }),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      'div',
      (0, _extends3.default)({}, wrapperProps, { style: (0, _assign2.default)({}, wrapperProps.style, { position: 'relative' }) }),
      _react2.default.createElement(_semanticUiReact.Dropdown, (0, _extends3.default)({
        fluid: true,
        selection: true
      }, passedProps, {
        renderLabel: function renderLabel(label) {
          return {
            icon: label.icon,
            content: label.text,
            image: label.image,
            style: label.selectedLabelStyle
          };
        },
        value: initialValue,
        onChange: function onChange(event, newvalue) {
          _onChange.call(_this6, event, newvalue);
          if (customCallbackfunction) customCallbackfunction(event, newvalue);
        }
      })),
      getCustomLeftIcon(formElement, this.state),
      getCustomErrorIcon(hasError, isValid, this.state, formElement),
      getCustomErrorLabel(hasError, this.state, formElement)
    )
  );
}

function getFormRemoteDropdown(options) {
  var _this7 = this;

  var formElement = options.formElement,
      i = options.i;

  var initialValue = getInitialValue(formElement, (0, _assign2.default)({}, this.state, (0, _flat.unflatten)(this.state)));
  var hasError = getErrorStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  var isValid = getValidStatus(this.state, formElement.name);
  var customLabel = getCustomFormLabel.bind(this);
  var wrapperProps = (0, _assign2.default)({
    className: '__re-bulma_control'
  }, formElement.wrapperProps);

  wrapperProps.className = (hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft) ? formElement.errorIconRight ? wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-right' : wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-left' : wrapperProps.className;

  var _onChange2 = void 0;
  var passedProps = (0, _assign2.default)({}, this.props, formElement.passProps);
  var getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passedProps = getPassablePropkeyevents(passedProps, formElement);
  var dropdowndata = [];
  var updatedState = {};
  if (formElement.disableOnChange) {
    _onChange2 = function onChange() {
      return function () {};
    };
  } else if (!_onChange2 && formElement.passProps.multiple) {
    _onChange2 = function onChange(event, newvalue) {
      var updatedStateProp = {};
      newvalue.options.forEach(function (val, idx) {
        if (newvalue.value[idx]) updatedStateProp[formElement.name + '.' + idx] = newvalue.value[idx];else updatedStateProp[formElement.name + '.' + idx] = undefined;
      });
      _this7.setState(updatedStateProp, function () {
        if (formElement.validateOnChange) {
          _this7.validateFormElement({ formElement: formElement });
        } else if (formElement.valueCheckOnChange) {
          _this7.valueCheckFormElement({ formElement: formElement });
        }
      });
    };
  } else if (!_onChange2) {
    _onChange2 = function onChange(event, newvalue) {
      var updatedStateProp = {};
      updatedStateProp[formElement.name] = newvalue.value;
      _this7.setState(updatedStateProp, function () {
        if (formElement.validateOnChange) {
          _this7.validateFormElement({ formElement: formElement });
        } else if (formElement.valueCheckOnChange) {
          _this7.valueCheckFormElement({ formElement: formElement });
        }
      });
    };
  }
  var customCallbackfunction = void 0;
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[formElement.customOnChange.replace('func:this.props.', '')];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
      customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(this, formElement);
    }
  }

  formElement.customIconStyle = (0, _assign2.default)({}, { right: "24px" }, formElement.customIconStyle);

  if (formElement.passProps.multiple && Array.isArray((0, _flat.unflatten)(this.state)[formElement.name])) {
    initialValue = (0, _flat.unflatten)(this.state)[formElement.name].filter(function (i) {
      return i !== undefined;
    });
  }
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { initialIcon: formElement.initialIcon, isValid: isValid, hasError: hasError, hasValue: hasValue }),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      'div',
      wrapperProps,
      _react2.default.createElement(_RemoteDropdown2.default, (0, _extends3.default)({}, passedProps, {
        value: initialValue,
        onChange: function onChange(event, newvalue) {
          _onChange2.call(_this7, event, newvalue);
          if (customCallbackfunction) customCallbackfunction(event, newvalue);
        }
      })),
      getCustomErrorIcon(hasError, isValid, this.state, formElement),
      getCustomErrorLabel(hasError, this.state, formElement)
    )
  );
}

function getFormMaskedInput(options) {
  var _this8 = this;

  var formElement = options.formElement,
      i = options.i,
      onChange = options.onChange;

  var initialValue = getInitialValue(formElement, this.state);
  var getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  var fileClassname = '__reactapp_file_' + formElement.name;
  var hasError = getErrorStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  var isValid = getValidStatus(this.state, formElement.name);
  var customLabel = getCustomFormLabel.bind(this);
  var passableProps = (0, _assign2.default)({
    type: 'text',
    className: '__re-bulma_input'
  }, formElement.passProps);

  if (typeof initialValue !== 'string') {
    initialValue = (0, _stringify2.default)(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    onChange = function onChange() {};
  } else if (!onChange) {
    onChange = function onChange(event) {
      var text = event.target.value;
      var updatedStateProp = {};
      if (passableProps && passableProps.multiple) {
        document.querySelector('.' + fileClassname + ' input').setAttribute('multiple', true);
      }
      updatedStateProp[formElement.name] = passableProps.maxLength ? text.substring(0, passableProps.maxLength) : text;
      _this8.setState(updatedStateProp);
    };
  }
  passableProps = getPassablePropkeyevents(passableProps, formElement);
  if (passableProps && passableProps.multiple) {
    var t = (0, _setImmediate3.default)(function () {
      document.querySelector('.' + fileClassname + ' input').setAttribute('multiple', true);
      (0, _clearImmediate3.default)(t);
    });
  }

  formElement.customErrorProps = formElement.customErrorProps ? (0, _assign2.default)({}, { marginTop: '6px' }, formElement.customErrorProps) : { marginTop: '6px' };

  var mask = [];
  function maskFunction(maskProp) {
    return function () {
      // return [ '(', /[1-9]/, /\d/, /\d/, ')', '\u2000', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ];
      if (Array.isArray(maskProp)) {
        var maskArray = maskProp.map(function (maskItem) {
          if (maskItem.charAt(0) === '/' && maskItem.charAt(maskItem.length - 1) === '/') {
            if (maskItem.charAt(1) === '[') {
              return new RegExp(maskItem.slice(1, maskItem.length - 1));
            } else {
              return new RegExp('\\' + maskItem.slice(1, maskItem.length - 1));
            }
          } else {
            return maskItem;
          }
        });
        return maskArray;
      } else {
        return maskProp;
      }
    };
  }
  if (formElement.createNumberMask && typeof passableProps.mask === 'string' && passableProps.mask.indexOf('func:window') !== -1 && typeof window[passableProps.mask.replace('func:window.', '')] === 'function') {
    var numberMaskConfig = (0, _typeof3.default)(window[passableProps.mask.replace('func:window.', '')].call(this, formElement)) === 'object' ? window[passableProps.mask.replace('func:window.', '')].call(this, formElement) : {};
    mask = (0, _createNumberMask2.default)(numberMaskConfig);
  } else if (typeof passableProps.mask === 'string' && passableProps.mask.indexOf('func:window') !== -1 && typeof window[passableProps.mask.replace('func:window.', '')] === 'function') {
    mask = window[passableProps.mask.replace('func:window.', '')].bind(this, formElement);
  } else if (formElement.createNumberMask) {
    // console.log('passableProps.numberMask',passableProps.numberMask)
    mask = (0, _createNumberMask2.default)(maskFunction(passableProps.mask));
  } else if (passableProps.mask) {
    mask = maskFunction(passableProps.mask);
  }
  // console.log({mask})
  var wrapperProps = (0, _assign2.default)({
    className: '__re-bulma_control'
  }, formElement.wrapperProps);

  wrapperProps.className = (hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft) ? formElement.errorIconRight ? wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-right' : wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-left' : wrapperProps.className;
  wrapperProps.className = formElement.leftIcon ? wrapperProps.className + ' __ra-left-icon' : wrapperProps.className;

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { initialIcon: formElement.initialIcon, isValid: isValid, hasError: hasError, hasValue: hasValue }),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      'span',
      (0, _extends3.default)({}, wrapperProps, { style: (0, _assign2.default)({}, wrapperProps.style, { position: 'relative' }) }),
      getCustomLeftIcon(formElement),
      _react2.default.createElement(_reactTextMask2.default, (0, _extends3.default)({}, passableProps, {
        mask: mask,
        className: hasError ? passableProps.className + ' __re-bulma_is-danger' : passableProps.className,
        color: hasError ? 'isDanger' : undefined,
        onChange: onChange,
        placeholder: formElement.placeholder,
        value: initialValue })),
      getCustomErrorIcon(hasError, isValid, this.state, formElement),
      getCustomErrorLabel(hasError, this.state, formElement)
    )
  );
}

function getFormTextInputArea(options) {
  var _this9 = this;

  var formElement = options.formElement,
      i = options.i,
      onChange = options.onChange;

  var initialValue = getInitialValue(formElement, this.state); //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  var getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  var fileClassname = '__reactapp_file_' + formElement.name;
  var hasError = getErrorStatus(this.state, formElement.name);
  var isValid = getValidStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  var customLabel = getCustomFormLabel.bind(this);
  var submitMultipartForm = void 0;
  var passableProps = (0, _assign2.default)({
    type: formElement.type || 'text'
  }, formElement.passProps);
  if (passableProps && passableProps.type === 'file') {
    passableProps.className = fileClassname;
  }
  var wrapperProps = (0, _assign2.default)({}, formElement.wrapperProps, {
    className: '__re-bulma_control' + (formElement.leftIcon ? ' __ra-left-icon' : '') + ' ' + (formElement.wrapperProps && formElement.wrapperProps.className ? formElement.wrapperProps.className : '')
  });

  if (typeof initialValue !== 'string') {
    initialValue = (0, _stringify2.default)(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    onChange = function onChange() {};
  } else if (!onChange) {
    onChange = function onChange(event) {
      var text = event.target.value;
      var updatedStateProp = {};
      var customCallbackfunction = void 0;
      if (passableProps && passableProps.multiple) {
        document.querySelector('.' + fileClassname + ' input').setAttribute('multiple', true);
      }

      if (passableProps && passableProps.type === 'file') {
        updatedStateProp.formDataFiles = (0, _assign2.default)({}, _this9.state.formDataFiles, (0, _defineProperty3.default)({}, formElement.name, document.querySelector('.' + fileClassname + ' input')));
        if (formElement.submitOnChange) {
          submitMultipartForm = setTimeout(function () {
            _this9.submitForm();
          }, 0);
          setTimeout(function () {
            window.location.reload();
          }, 1000);
        }
      } else {
        updatedStateProp[formElement.name] = passableProps.maxLength ? text.substring(0, passableProps.maxLength) : text;
      }
      if (formElement.onChangeFilter) {
        var onChangeFunc = getFunctionFromProps.call(_this9, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(_this9, (0, _assign2.default)({}, _this9.state, updatedStateProp), updatedStateProp);
      } else if (formElement.customOnChange) {
        if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
          customCallbackfunction = _this9.props[formElement.customOnChange.replace('func:this.props.', '')];
        } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
          customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(_this9, formElement);
        }
      }
      _this9.setState(updatedStateProp);
      if (typeof customCallbackfunction === 'function') customCallbackfunction();
    };
  }
  passableProps = getPassablePropkeyevents(passableProps, formElement);

  // console.debug({ passableProps });
  if (passableProps && passableProps.multiple) {
    var t = (0, _setImmediate3.default)(function () {
      document.querySelector('.' + fileClassname + ' input').setAttribute('multiple', true);
      (0, _clearImmediate3.default)(t);
    });
  }
  if (submitMultipartForm) clearTimeout(submitMultipartForm);
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { initialIcon: formElement.initialIcon, isValid: isValid, hasError: hasError, hasValue: hasValue }),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      'div',
      (0, _extends3.default)({}, wrapperProps, { style: (0, _assign2.default)({}, wrapperProps.style, { position: 'relative' }) }),
      getCustomLeftIcon(formElement),
      _react2.default.createElement(_reBulma.Input, (0, _extends3.default)({}, passableProps, {
        help: getFormElementHelp(hasError, this.state, formElement.name),
        color: hasError ? 'isDanger' : undefined,
        icon: hasError ? formElement.errorIcon || 'fa fa-exclamation' : isValid ? formElement.validIcon || 'fa fa-check' : formElement.initialIcon ? formElement.initialIcon : undefined,
        hasIconRight: formElement.errorIconRight,
        onChange: onChange,
        placeholder: formElement.placeholder,
        value: initialValue }))
    )
  );
}

function getFormImageCropper(options) {
  var self = this;
  var customLabel = getCustomFormLabel.bind(this);
  var formElement = options.formElement,
      i = options.i,
      onChange = options.onChange;

  var initialValue = getInitialValue(formElement, this.state);
  try {
    initialValue = JSON.parse(initialValue);
  } catch (e) {
    initialValue = { "height": 0, "width": 0, "x": 0, "y": 0 };
  }
  var fileClassname = '__reactapp_file_' + formElement.name;
  var passProps = (0, _assign2.default)({}, formElement.passProps, { fileInputProps: { className: fileClassname } });
  if (passProps.cropperSrc && this.state[passProps.cropperSrc]) {
    passProps.src = this.state[passProps.cropperSrc];
  }
  passProps.cropperProps.data = initialValue;
  var getFileData = function getFileData(filedata) {
    var formDataFiles = (0, _assign2.default)({}, this.state.formDataFiles, (0, _defineProperty3.default)({}, formElement.name, filedata));
    this.setState({
      formDataFiles: formDataFiles
    });
  };
  var getCropperBoxData = function getCropperBoxData(boxdata) {
    this.setState((0, _defineProperty3.default)({}, formElement.name, (0, _stringify2.default)(boxdata)));
  };
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(_ResponsiveCropper2.default, (0, _extends3.default)({ getFileData: getFileData.bind(self), getCropperBoxData: getCropperBoxData.bind(self) }, passProps))
  );
}

function getFormTextArea(options) {
  var formElement = options.formElement,
      i = options.i,
      _onChange3 = options.onChange;

  var initialValue = getInitialValue(formElement, this.state); //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  var hasError = getErrorStatus(this.state, formElement.name);
  var isValid = getValidStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  var customLabel = getCustomFormLabel.bind(this);
  var passableProps = (0, _assign2.default)({}, formElement.passProps);
  var getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passableProps = getPassablePropkeyevents(passableProps, formElement);

  if (typeof initialValue !== 'string') {
    initialValue = (0, _stringify2.default)(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    _onChange3 = function onChange() {
      return function () {};
    };
  } else if (!_onChange3) {
    _onChange3 = valueChangeHandler.bind(this, formElement);
  }

  var iconClassNames = (hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft) ? formElement.errorIconRight ? ' __re-bulma_has-icon __re-bulma_has-icon-right' : ' __re-bulma_has-icon __re-bulma_has-icon-left' : '';

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { initialIcon: formElement.initialIcon, isValid: isValid, hasError: hasError, hasValue: hasValue }),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      'p',
      { className: "__re-bulma_control" + iconClassNames },
      _react2.default.createElement(_reBulma.Textarea, (0, _extends3.default)({}, passableProps, {
        onChange: function onChange(event) {
          return _onChange3()(event);
        },
        help: getFormElementHelp(hasError, this.state, formElement.name),
        icon: hasError ? formElement.errorIcon || 'fa fa-exclamation' : isValid ? formElement.validIcon || 'fa fa-check' : formElement.initialIcon ? formElement.initialIcon : undefined,
        color: hasError ? 'isDanger' : undefined,
        hasIconRight: formElement.errorIconRight,
        placeholder: formElement.placeholder || formElement.label,
        value: this.state[formElement.name] || initialValue })),
      getCustomErrorIcon(hasError, isValid, this.state, formElement)
    )
  );
}

function getFormSelect(options) {
  var formElement = options.formElement,
      i = options.i,
      _onChange4 = options.onChange;

  var initialValue = getInitialValue(formElement, this.state); //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  var hasError = getErrorStatus(this.state, formElement.name);
  var isValid = getValidStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  var customLabel = getCustomFormLabel.bind(this);
  var selectOptions = this.state.__formOptions && this.state.__formOptions[formElement.name] ? this.state.__formOptions[formElement.name] : formElement.options || [];
  if (typeof initialValue !== 'string') {
    initialValue = (0, _stringify2.default)(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    _onChange4 = function onChange() {
      return function () {};
    };
  } else if (!_onChange4) {
    _onChange4 = valueChangeHandler.bind(this, formElement);
  }
  var customCallbackfunction = void 0;
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[formElement.customOnChange.replace('func:this.props.', '')];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
      customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(this, formElement);
    }
  }

  var iconClassNames = (hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft) ? formElement.errorIconRight ? ' __re-bulma_has-icon __re-bulma_has-icon-right' : ' __re-bulma_has-icon __re-bulma_has-icon-left' : '';
  iconClassNames = formElement.leftIcon ? +' __ra-left-icon' : '';

  formElement.customIconStyle = (0, _assign2.default)({}, { right: "24px" }, formElement.customIconStyle);

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { initialIcon: formElement.initialIcon, isValid: isValid, hasError: hasError, hasValue: hasValue }),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      'span',
      { className: "__re-bulma_control" + iconClassNames, style: { position: 'relative', display: 'block' } },
      getCustomLeftIcon(formElement),
      _react2.default.createElement(
        _reBulma.Select,
        (0, _extends3.default)({}, formElement.passProps, {
          style: (0, _assign2.default)({}, { flex: 'inherit', marginBottom: 0 }, formElement.passProps && formElement.passProps.style ? formElement.passProps.style : {}),
          help: getFormElementHelp(hasError, this.state, formElement.name),
          color: hasError ? 'isDanger' : undefined,
          onChange: function onChange(event) {
            _onChange4()(event);
            if (customCallbackfunction) customCallbackfunction(event);
          },
          placeholder: formElement.placeholder || formElement.label,
          value: this.state[formElement.name] || initialValue }),
        selectOptions.map(function (opt, k) {
          return _react2.default.createElement(
            'option',
            { key: k, disabled: opt.disabled, value: opt.value },
            opt.label || opt.value
          );
        })
      ),
      !formElement.errorIconLeft ? getCustomErrorIcon(hasError, isValid, this.state, formElement) : null
    )
  );
}

function getFormCheckbox(options) {
  var _this10 = this;

  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;

  var hasError = getErrorStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  var customLabel = getCustomFormLabel.bind(this);
  if (formElement.disableOnChange) {
    onValueChange = function onValueChange() {};
  } else if (!onValueChange) {
    onValueChange = function onValueChange() /*event*/{
      // let text = event.target.value;
      var updatedStateProp = {};
      // console.debug('before', { updatedStateProp, formElement, }, event.target);
      if (formElement.type === 'radio') {
        // event.target.value = 'on';
        updatedStateProp[_this10.state[formElement.formdata_name] || formElement.name] = _this10.state[formElement.formdata_value] || formElement.value || 'on';
      } else {
        updatedStateProp[_this10.state[formElement.formdata_name] || formElement.name] = _this10.state[_this10.state[formElement.formdata_name] || formElement.name] ? 0 : 'on';
      }
      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChangeFilter) {
        var onChangeFunc = getFunctionFromProps.call(_this10, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(_this10, (0, _assign2.default)({}, _this10.state, updatedStateProp), updatedStateProp);
      }
      _this10.setState(updatedStateProp, function () {
        if (formElement.validateOnChange) {
          _this10.validateFormElement({ formElement: formElement });
        }
      });
    };
  }
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { hasError: hasError, hasValue: hasValue }),
    !formElement.customLabel ? getFormLabel(formElement) : null,
    _react2.default.createElement('input', (0, _extends3.default)({}, formElement.passProps, {
      type: formElement.type || 'checkbox',
      name: this.state[formElement.formdata_name] || formElement.name,
      checked: formElement.type === 'radio' ? this.state[formElement.name] === formElement.value : this.state[formElement.name],
      onChange: onValueChange
    })),
    customLabel(formElement),
    _react2.default.createElement(
      'span',
      formElement.placeholderProps,
      this.state[formElement.formdata_placeholder] || formElement.placeholder
    ),
    getCustomErrorLabel(hasError, this.state, formElement)
  );
}

function getFormButton(options) {
  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;

  if (formElement.value) {
    this.setState((0, _defineProperty3.default)({}, formElement.name, formElement.value));
  }
  var hasError = getErrorStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  var customLabel = getCustomFormLabel.bind(this);
  var onClickHandler = void 0;
  if (formElement.onClick) {
    if (formElement.onClick.indexOf('func:this.props') !== -1) {
      onClickHandler = this.props[formElement.onClick.replace('func:this.props.', '')];
    } else if (formElement.onClick.indexOf('func:window') !== -1 && typeof window[formElement.onClick.replace('func:window.', '')] === 'function') {
      onClickHandler = window[formElement.onClick.replace('func:window.', '')].bind(this, formElement);
    } else {
      onClickHandler = function onClickHandler() {};
    }
  } else {
    onClickHandler = function onClickHandler() {};
  }

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { hasError: hasError, hasValue: hasValue }),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(_reBulma.Button, (0, _extends3.default)({}, formElement.passProps, {
      type: formElement.type,
      name: this.state[formElement.formdata_name] || formElement.name,
      onClick: onClickHandler
    })),
    _react2.default.createElement(
      'span',
      formElement.placeholderProps,
      this.state[formElement.formdata_placeholder] || formElement.placeholder
    ),
    getCustomErrorLabel(hasError, this.state, formElement)
  );
}

function getFormSemanticCheckbox(options) {
  var _this11 = this;

  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;

  var hasError = getErrorStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  if (formElement.disableOnChange) {
    onValueChange = function onValueChange() {};
  } else if (!onValueChange) {
    onValueChange = function onValueChange() /*event*/{
      // let text = event.target.value;
      var updatedStateProp = {};
      // console.debug('before', { updatedStateProp, formElement, }, event.target);

      updatedStateProp[_this11.state[formElement.formdata_name] || formElement.name] = _this11.state[_this11.state[formElement.formdata_name] || formElement.name] ? 0 : 'on';
      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChangeFilter) {
        var onChangeFunc = getFunctionFromProps.call(_this11, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(_this11, (0, _assign2.default)({}, _this11.state, updatedStateProp), updatedStateProp);
      }
      _this11.setState(updatedStateProp, function () {
        if (formElement.validateOnChange) {
          _this11.validateFormElement({ formElement: formElement });
        }
      });
    };
  }
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { hasError: hasError, hasValue: hasValue }),
    _react2.default.createElement(_semanticUiReact.Checkbox, (0, _extends3.default)({}, formElement.passProps, {
      name: this.state[formElement.formdata_name] || formElement.name,
      checked: this.state[formElement.name] === "on" ? true : false,
      onChange: onValueChange,
      label: typeof formElement.label === "string" ? formElement.label : (0, _typeof3.default)(formElement.label) === "object" ? this.getRenderedComponent(formElement.label) : null
    })),
    getCustomErrorLabel(hasError, this.state, formElement)
  );
}

function getFormProgressSteps(options) {
  var _this12 = this;

  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;

  var hasError = getErrorStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  if (formElement.disableOnChange) {
    onValueChange = function onValueChange() {};
  } else if (!onValueChange) {
    onValueChange = function onValueChange(event) {
      var updatedStateProp = {};
      updatedStateProp[_this12.state[formElement.formdata_name] || formElement.name] = event.target.value;
      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChangeFilter) {
        var onChangeFunc = getFunctionFromProps.call(_this12, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(_this12, (0, _assign2.default)({}, _this12.state, updatedStateProp), updatedStateProp);
      }
      _this12.setState(updatedStateProp, function () {
        if (formElement.validateOnChange) {
          _this12.validateFormElement({
            formElement: formElement
          });
        }
      });
    };
  }
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { hasError: hasError, hasValue: hasValue }),
    _react2.default.createElement(
      _semanticUiReact.Step.Group,
      (0, _extends3.default)({ fluid: true }, formElement.passProps),
      formElement.steps.map(function (step, idx) {
        return _react2.default.createElement(
          _semanticUiReact.Step,
          (0, _extends3.default)({}, step.stepProps, {
            disabled: formElement.passProps && formElement.passProps.disabled ? formElement.passProps.disabled : null,
            active: _this12.state[formElement.name] == idx ? true : null,
            key: formElement.name + '-' + idx
          }),
          _react2.default.createElement(
            'label',
            { style: { position: 'relative', cursor: 'pointer' } },
            _react2.default.createElement('input', {
              type: 'radio',
              name: _this12.state[formElement.formdata_name] || formElement.name,
              checked: _this12.state[formElement.name] == idx ? true : false,
              onChange: onValueChange,
              value: idx,
              style: { position: 'absolute', opacity: 0, top: 0, left: 0 }
            }),
            _react2.default.createElement(
              _semanticUiReact.Step.Content,
              null,
              !Array.isArray(step.title) && (0, _typeof3.default)(step.title) === 'object' ? _this12.getRenderedComponent(step.title) : _react2.default.createElement(
                'div',
                null,
                step.title
              )
            )
          )
        );
      })
    ),
    getCustomErrorLabel(hasError, this.state, formElement)
  );
}

function getFormSwitch(options) {
  var _this13 = this;

  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;

  var hasError = getErrorStatus(this.state, formElement.name);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  var customLabel = getCustomFormLabel.bind(this);
  if (formElement.disableOnChange) {
    onValueChange = function onValueChange() {};
  } else if (!onValueChange) {
    onValueChange = function onValueChange() /*event*/{
      // let text = event.target.value;
      var updatedStateProp = {};
      // console.debug('before', { updatedStateProp, formElement, }, event.target);
      updatedStateProp[_this13.state[formElement.formdata_name] || formElement.name] = _this13.state[_this13.state[formElement.formdata_name] || formElement.name] ? 0 : 'on';

      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChange) {
        var onChangeFunc = getFunctionFromProps.call(_this13, { propFunc: formElement.onChange });
        onChangeFunc.call(_this13, (0, _assign2.default)({}, _this13.state, updatedStateProp), updatedStateProp);
      }
      if (formElement.onChangeFilter) {
        var _onChangeFunc = getFunctionFromProps.call(_this13, { propFunc: formElement.onChangeFilter });
        updatedStateProp = _onChangeFunc.call(_this13, (0, _assign2.default)({}, _this13.state, updatedStateProp), updatedStateProp);
      }
      _this13.setState(updatedStateProp, function () {
        if (formElement.validateOnChange) {
          _this13.validateFormElement({ formElement: formElement });
        }
      });
    };
  }

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { hasError: hasError, hasValue: hasValue }),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_rcSwitch2.default, (0, _extends3.default)({}, formElement.passProps, {
        // type={formElement.type || 'checkbox'}
        // name={this.state[ formElement.formdata_name] || formElement.name}
        checked: this.state[formElement.name]
        // disabled={this.state.disabled}
        // checkedChildren={'on'}
        // unCheckedChildren={''}
        , onChange: onValueChange
      }))
    ),
    _react2.default.createElement(
      'span',
      formElement.placeholderProps,
      this.state[formElement.formdata_placeholder] || formElement.placeholder
    ),
    getCustomErrorLabel(hasError, this.state, formElement)
  );
}

function getRawInput(options) {
  var _this14 = this;

  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;

  var hasError = getErrorStatus(this.state, formElement.name);
  var customLabel = getCustomFormLabel.bind(this);
  var wrapperProps = (0, _assign2.default)({
    style: {
      overflow: 'auto',
      backgroundColor: 'white',
      border: hasError ? '1px solid #ed6c63' : '1px solid #d3d6db',
      borderRadius: 3,
      height: 'auto',
      boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)'
    }
  }, formElement.wrapperProps, {
    className: (formElement.leftIcon ? '__ra-left-icon' : '') + ' ' + (formElement.wrapperProps && formElement.wrapperProps.className ? formElement.wrapperProps.className : '')
  });
  var passableProps = formElement.passProps;
  var getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passableProps = getPassablePropkeyevents(passableProps, formElement);
  if (!onValueChange) {
    onValueChange = function onValueChange() /*event*/{
      // let text = event.target.value;
      var updatedStateProp = {};
      updatedStateProp[formElement.name] = _this14.state[formElement.name] ? false : 'on';
      // console.log({ updatedStateProp });
      if (formElement.onChangeFilter) {
        var onChangeFunc = getFunctionFromProps.call(_this14, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(_this14, (0, _assign2.default)({}, _this14.state, updatedStateProp), updatedStateProp);
      }
      _this14.setState(updatedStateProp);
    };
  }

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      'div',
      (0, _extends3.default)({}, wrapperProps, { style: (0, _assign2.default)({}, wrapperProps.style, { position: 'relative' }) }),
      getCustomLeftIcon(formElement),
      _react2.default.createElement('input', (0, _extends3.default)({}, passableProps, {
        type: formElement.type,
        checked: this.state[formElement.name],
        onChange: onValueChange
      })),
      getCustomErrorLabel(hasError, this.state, formElement)
    )
  );
}

function getSliderInput(options) {
  var _this15 = this;

  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;
  // const Handle = (
  // );

  var hasError = getErrorStatus(this.state, formElement.name);
  var wrapperProps = (0, _assign2.default)({
    style: {
      overflow: 'auto',
      backgroundColor: 'white',
      border: hasError ? '1px solid #ed6c63' : '1px solid #d3d6db',
      borderRadius: 3,
      height: 'auto',
      boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)'
    }
  }, formElement.wrapperProps);
  var passableProps = (0, _assign2.default)({}, formElement.passProps);
  var customCallbackfunction = function customCallbackfunction() {};
  if (formElement.handle) {
    passableProps.handle = function (_ref2) {
      var value = _ref2.value,
          offset = _ref2.offset;
      return _react2.default.createElement(
        'div',
        { style: { left: offset + '%' }, className: '__reactapp_slider__handle' },
        _react2.default.createElement('span', { className: '__reactapp_arrow-left' }),
        formElement.numeralFormat ? (0, _numeral2.default)(value).format(formElement.numeralFormat) : value,
        _react2.default.createElement('span', { className: '__reactapp_arrow-right' })
      );
    };
  }
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[formElement.customOnChange.replace('func:this.props.', '')];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[formElement.customOnChange.replace('func:window.', '')] === 'function') {
      customCallbackfunction = window[formElement.customOnChange.replace('func:window.', '')].bind(this);
    }
  }
  if (!onValueChange) {
    onValueChange = function onValueChange(val) {
      // console.debug({ val });
      var updatedStateProp = {};
      updatedStateProp[formElement.name] = val;
      // console.log({ updatedStateProp });
      if (formElement.onChangeFilter) {
        var onChangeFunc = getFunctionFromProps.call(_this15, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(_this15, (0, _assign2.default)({}, _this15.state, updatedStateProp), updatedStateProp);
      }
      _this15.setState(updatedStateProp);
      customCallbackfunction(val);
    };
  }
  var initValue = formElement.name && this.state[formElement.name] !== undefined ? this.state[formElement.name] : formElement.value !== undefined ? formElement.value : formElement.passProps && formElement.passProps.defaultValue ? formElement.passProps.defaultValue : formElement.passProps && formElement.passProps.min ? formElement.passProps.min : null;

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    getFormLabel(formElement),
    _react2.default.createElement(
      'div',
      wrapperProps,
      _react2.default.createElement(
        _rcSlider2.default,
        (0, _extends3.default)({}, passableProps, {
          onChange: onValueChange,
          value: initValue
        }),
        formElement.leftLabel ? _react2.default.createElement(
          'span',
          { className: '__reactapp_slider__label __reactapp_slider__label_left' },
          formElement.leftLabel
        ) : null,
        formElement.rightLabel ? _react2.default.createElement(
          'span',
          { className: '__reactapp_slider__label __reactapp_slider__label_right' },
          formElement.rightLabel
        ) : null
      ),
      getCustomErrorLabel(hasError, this.state, formElement)
    )
  );
}

function getHiddenInput(options) {
  var formElement = options.formElement,
      i = options.i;

  var initialValue = this.state[formElement.formdata_name] || this.state[formElement.name] || formElement.value;

  return _react2.default.createElement('input', (0, _extends3.default)({ key: i }, formElement.passProps, {
    type: 'hidden',
    value: initialValue }));
}

function getImage(options) {
  var formElement = options.formElement,
      i = options.i;

  var initialValue = getInitialValue(formElement, this.state);
  var imageProps = (0, _assign2.default)({
    style: {
      textAlign: 'center'
    }
  }, formElement.passProps);
  //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    getFormLabel(formElement),
    formElement.link ? _react2.default.createElement(
      'a',
      { href: initialValue, target: '_blank' },
      _react2.default.createElement(_reBulma.Image, (0, _extends3.default)({ key: i }, imageProps, { src: this.state[formElement.preview] || initialValue }))
    ) : _react2.default.createElement(_reBulma.Image, (0, _extends3.default)({ key: i }, imageProps, { src: this.state[formElement.preview] || initialValue }))
  );
}

function getFormLink(options) {
  var formElement = options.formElement,
      i = options.i,
      button = options.button;


  var wrapperProps = (0, _assign2.default)({
    style: _styles2.default.inputStyle
  }, formElement.wrapperProps);
  var linkWrapperProps = (0, _assign2.default)({
    style: {
      padding: '0 5px'
    }
  }, formElement.linkWrapperProps);
  // console.debug({ linkWrapperProps, formElement });

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    getFormLabel(formElement),
    _react2.default.createElement(
      'span',
      wrapperProps,
      _react2.default.createElement(
        'span',
        linkWrapperProps,
        button
      )
    )
  );
}

function getFormGroup(options) {
  var customLabel = getCustomFormLabel.bind(this);
  var formElement = options.formElement,
      i = options.i,
      groupElements = options.groupElements;

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      _reBulma.Group,
      formElement.passProps,
      groupElements
    )
  );
}

function getFormTabs(options) {
  var customLabel = getCustomFormLabel.bind(this);
  var formElement = options.formElement,
      i = options.i,
      tabs = options.tabs;

  var self = this;
  tabs = tabs.map(function (tab) {
    tab.formElements = tab.formElements || [];
    tab.layout = {
      formElements: tab.formElements || []
    };
    return tab;
  });
  var getFormElementsWrapper = function getFormElementsWrapper(tab) {
    return _react2.default.createElement(
      'div',
      tab.tabProps,
      tab.formElements.map(formElement.getFormElements.bind(self))
    );
  };
  var onTabChange = function onTabChange(currentTab) {
    if (formElement.name) {
      self.setState((0, _defineProperty3.default)({}, formElement.name, currentTab.name));
    }
  };
  getFormElementsWrapper = getFormElementsWrapper.bind(self);
  onTabChange = formElement.passProps.markActiveTab ? onTabChange.bind(this) : function () {};
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(_ResponsiveTabs2.default, (0, _extends3.default)({}, formElement.passProps, { onChange: onTabChange, isForm: true, tabs: tabs, getFormElements: getFormElementsWrapper
    }))
  );
}

function getFormCode(options) {
  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;

  var hasError = getErrorStatus(this.state, formElement.name);
  var initialVal = getInitialValue(formElement, this.state) || '';
  var customLabel = getCustomFormLabel.bind(this);
  var CodeMirrorProps = (0, _assign2.default)({
    codeMirrorProps: (0, _assign2.default)({
      lineNumbers: true,
      value: formElement.stringify ? (0, _stringify2.default)(initialVal, null, 2) : initialVal, //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
      //value: this.state[ formElement.name ] || formElement.value,
      style: {
        minHeight: 200
      },
      lineWrapping: true,
      onChange: !onValueChange ? function (newvalue) {
        newvalue = formElement.stringify ? JSON.parse(newvalue) : newvalue;
        var updatedStateProp = {};
        updatedStateProp[formElement.name] = newvalue;
        if (formElement.onChangeFilter) {
          var onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
          updatedStateProp = onChangeFunc.call(this, (0, _assign2.default)({}, this.state, updatedStateProp), updatedStateProp);
        }
        this.setState(updatedStateProp);
      }.bind(this) : onValueChange
    }, formElement.codeMirrorProps),
    wrapperProps: (0, _assign2.default)({
      style: {
        overflow: 'auto',
        backgroundColor: 'white',
        border: hasError ? '1px solid #ed6c63' : '1px solid #d3d6db',
        borderRadius: 3,
        height: 'auto',
        boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)'
      }
    }, formElement.codeMirrorWrapperProps)
  }, formElement.passProps);

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(_RACodeMirror2.default, (0, _extends3.default)({ key: i }, CodeMirrorProps)),
    getCustomErrorLabel(hasError, this.state, formElement)
  );
}

function getFormColorPicker(options) {
  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;

  var hasError = getErrorStatus(this.state, formElement.name);
  var isValid = getValidStatus(this.state, formElement.name);
  var initialVal = getInitialValue(formElement, this.state) || '';
  var customLabel = getCustomFormLabel.bind(this);
  var ColorPickerProps = (0, _assign2.default)({
    onChange: !onValueChange ? function (newvalue) {
      if ((typeof newvalue === 'undefined' ? 'undefined' : (0, _typeof3.default)(newvalue)) === 'object' && newvalue.hex) {
        newvalue = newvalue.hex;
      }
      newvalue = formElement.stringify ? JSON.parse(newvalue) : newvalue;
      var updatedStateProp = {};
      updatedStateProp[formElement.name] = newvalue;
      if (formElement.onChangeFilter) {
        var onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, (0, _assign2.default)({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp);
    }.bind(this) : onValueChange
  }, formElement.passProps);

  var passableProps = (0, _assign2.default)({
    type: formElement.type || 'text'
  }, formElement.passProps);
  if (typeof initialVal !== 'string') {
    initialVal = (0, _stringify2.default)(initialVal, null, 2);
  }

  var handleOnChange = function handleOnChange(e, second) {
    this.setState((0, _defineProperty3.default)({}, formElement.name, e.target.value));
  };
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      'div',
      { style: { display: 'flex' }, className: '__ra_color_picker' },
      _react2.default.createElement(_ColorPicker2.default, (0, _extends3.default)({ key: i }, ColorPickerProps, { color: this.state[formElement.name] }, this.state)),
      _react2.default.createElement(_reBulma.Input, (0, _extends3.default)({}, passableProps, {
        help: getFormElementHelp(hasError, this.state, formElement.name),
        color: hasError ? 'isDanger' : undefined,
        icon: hasError ? formElement.errorIcon || 'fa fa-exclamation' : isValid ? formElement.validIcon || 'fa fa-check' : formElement.initialIcon ? formElement.initialIcon : undefined,
        hasIconRight: formElement.errorIconRight,
        onChange: handleOnChange.bind(this),
        placeholder: formElement.placeholder,
        value: initialVal }))
    )
  );
}

function getFormDatePicker(options) {
  var customLabel = getCustomFormLabel.bind(this);
  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;

  var hasError = getErrorStatus(this.state, formElement.name);
  var isValid = getValidStatus(this.state, formElement.name);
  var initialVal = getInitialValue(formElement, this.state);
  var hasValue = formElement.name && this.state[formElement.name] ? true : false;
  var singleCustomOnChange = function singleCustomOnChange(_ref3) {
    var _this16 = this;

    var date = _ref3.date;

    this.setState((0, _defineProperty3.default)({}, formElement.name, date ? date.toISOString() : null), function () {
      if (formElement.validateOnChange) {
        _this16.validateFormElement({ formElement: formElement });
      } else if (formElement.valueCheckOnChange) {
        _this16.valueCheckFormElement({ formElement: formElement });
      }
    });
  };
  var rangeCustomOnChange = function rangeCustomOnChange(_ref4) {
    var _this17 = this;

    var startDate = _ref4.startDate,
        endDate = _ref4.endDate;

    var combined_date = startDate.toISOString() + ';' + endDate.toISOString();
    this.setState((0, _defineProperty3.default)({}, formElement.name, combined_date), function () {
      if (formElement.validateOnChange) {
        _this17.validateFormElement({ formElement: formElement });
      } else if (formElement.valueCheckOnChange) {
        _this17.valueCheckFormElement({ formElement: formElement });
      }
    });
  };
  var SingleDatePickerProps = (0, _assign2.default)({}, {
    customOnChange: singleCustomOnChange.bind(this),
    initialDate: initialVal ? new _moment2.default(initialVal) : null
  }, formElement.passProps);
  var RangeDatePickerProps = (0, _assign2.default)({}, {
    customOnChange: rangeCustomOnChange.bind(this),
    initialDate: initialVal ? new _moment2.default(initialVal) : null
  }, formElement.passProps);
  if (formElement.type === 'singleDatePicker') {
    return _react2.default.createElement(
      _FormItem2.default,
      (0, _extends3.default)({ key: i }, formElement.layoutProps, { initialIcon: formElement.initialIcon, isValid: isValid, hasError: hasError, hasValue: hasValue }),
      formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
      _react2.default.createElement(
        'div',
        { className: '__re-bulma_control  __re-bulma_has-icon __re-bulma_has-icon-right' + (formElement.leftIcon ? ' __ra-left-icon' : ''), style: { position: 'relative' } },
        getCustomLeftIcon(formElement),
        _react2.default.createElement(_SingleDatePickerWrapper2.default, (0, _extends3.default)({ key: i }, SingleDatePickerProps)),
        getCustomErrorIcon(hasError, isValid, this.state, formElement),
        getCustomErrorLabel(hasError, this.state, formElement)
      )
    );
  } else if (formElement.type === 'rangeDatePicker') {
    return _react2.default.createElement(
      _FormItem2.default,
      (0, _extends3.default)({ key: i }, formElement.layoutProps, { initialIcon: formElement.initialIcon, isValid: isValid, hasError: hasError, hasValue: hasValue }),
      formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
      _react2.default.createElement(
        'div',
        { className: '__re-bulma_control  __re-bulma_has-icon __re-bulma_has-icon-right' + (formElement.leftIcon ? ' __ra-left-icon' : ''), style: { position: 'relative' } },
        getCustomLeftIcon(formElement),
        _react2.default.createElement(_DateRangePickerWrapper2.default, (0, _extends3.default)({ key: i }, RangeDatePickerProps)),
        getCustomErrorIcon(hasError, isValid, this.state, formElement),
        getCustomErrorLabel(hasError, this.state, formElement)
      )
    );
  }
}

function getFormEditor(options) {
  var _this18 = this;

  var formElement = options.formElement,
      i = options.i,
      onValueChange = options.onValueChange;

  var initialVal = getInitialValue(formElement, this.state);
  var customLabel = getCustomFormLabel.bind(this);
  if (!onValueChange) {
    onValueChange = function onValueChange(newvalue) {
      // console.debug({ newvalue, });
      var updatedStateProp = {};
      updatedStateProp[formElement.name] = newvalue.target.value;
      if (formElement.onChangeFilter) {
        var onChangeFunc = getFunctionFromProps.call(_this18, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(_this18, (0, _assign2.default)({}, _this18.state, updatedStateProp), updatedStateProp);
      }
      _this18.setState(updatedStateProp);
    };
  }
  // console.debug({ initialVal });
  var EditorProps = (0, _assign2.default)({}, this.props, {
    // wrapperProps: {
    //   style: {
    //     overflow: 'hidden',
    //     backgroundColor: 'white',
    //     border: '1px solid #d3d6db',
    //     borderRadius: 3,
    //     minHeight:'2rem',
    //     display:'flex',
    //     boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
    //   },
    // },
    passProps: {
      // toolbarStyle: {
      //   borderTop: 'none',
      //   borderLeft: 'none',
      //   borderRight: 'none',
      //   padding: '5px 0 0',
      // },
    },
    onChange: onValueChange
  }, formElement.passProps);

  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(_PreviewEditor2.default, (0, _extends3.default)({ key: i }, EditorProps, { value: initialVal }))
  );
}

function getConfirmModal(options) {
  var _this19 = this;

  var formElement = options.formElement;

  var confirmModal = void 0;
  var modalContent = formElement.confirmModal.textContent || [];
  var onSubmit = void 0;
  if (formElement.confirmModal.type === 'comment') {
    var name = formElement.confirmModal.name || 'comment';
    onSubmit = function onSubmit(e) {
      if (_this19.props.formgroups[_this19.props.formgroups.length - 1] && _this19.props.formgroups[_this19.props.formgroups.length - 1].formElements) {
        _this19.props.formgroups[_this19.props.formgroups.length - 1].formElements.push({ name: name });
        _this19.props.hideModal('last');
        _this19.submitForm.call(_this19);
        _this19.props.formgroups[_this19.props.formgroups.length - 1].formElements = _this19.props.formgroups[_this19.props.formgroups.length - 1].formElements.filter(function (formElement) {
          return formElement.name !== name;
        });
      } else {
        _this19.submitForm.call(_this19);
      }
    };
    var comment_box = (0, _assign2.default)({}, {
      component: 'Input',
      type: 'commentbox',
      props: {
        onChange: function onChange(e) {
          return _this19.setState((0, _defineProperty3.default)({}, name, e.target.value));
        }
      }
    }, formElement.confirmModal.comment);
    if (modalContent && modalContent[modalContent.length - 1] && modalContent[modalContent.length - 1].type === 'commentbox') {
      modalContent.pop();
      modalContent.push(comment_box);
    } else {
      modalContent.push(comment_box);
    }
  } else {
    onSubmit = function onSubmit() {
      _this19.props.hideModal('last');
      _this19.submitForm.call(_this19);
    };
  }
  confirmModal = (0, _assign2.default)({
    title: 'Please Confirm',
    text: {
      component: 'div',
      props: (0, _assign2.default)({
        style: {
          textAlign: 'center'
        },
        className: '__ra_rf_fe_s_cm'
      }, formElement.confirmModal.contentWrapperProps),
      children: [{
        component: 'div',
        props: {
          className: '__ra_rf_fe_s_cm_t'
        },
        children: modalContent || ''
      }, {
        component: 'div',
        props: (0, _assign2.default)({
          className: '__ra_rf_fe_s_cm_bc'
        }, formElement.confirmModal.buttonWrapperProps),
        children: [{
          component: 'ResponsiveButton',
          props: (0, _assign2.default)({
            style: {
              margin: 10
            },
            buttonProps: {
              size: 'isMedium',

              color: 'isPrimary'
            },
            onClick: onSubmit,
            onclickProps: 'last'
          }, formElement.confirmModal.yesButtonProps),
          children: formElement.confirmModal.yesButtonText || 'Yes'
        }, {
          component: 'ResponsiveButton',
          props: (0, _assign2.default)({
            style: {
              margin: 10
            },
            buttonProps: {
              size: 'isMedium'
            },
            onClick: 'func:this.props.hideModal',
            onclickProps: 'last'
          }, formElement.confirmModal.noButtonProps),
          children: formElement.confirmModal.noButtonText || 'No'
        }]
      }]
    }
  }, formElement.confirmModal);
  this.props.createModal(confirmModal);
}

function getFormSubmit(options) {
  var _this20 = this;

  var formElement = options.formElement,
      i = options.i;

  var customLabel = getCustomFormLabel.bind(this);
  var passableProps = (0, _assign2.default)({
    state: formElement.confirmModal && (0, _keys2.default)(this.state.formDataErrors).length > 0 ? 'isDisabled' : undefined
  }, this.props.useLoadingButtons && this.state.__formIsSubmitting ? {
    state: 'isLoading'
  } : {}, formElement.passProps);
  return _react2.default.createElement(
    _FormItem2.default,
    (0, _extends3.default)({ key: i }, formElement.layoutProps),
    formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement),
    _react2.default.createElement(
      _reBulma.Button,
      (0, _extends3.default)({}, passableProps, {
        onClick: function onClick() {
          var validated_formdata = _FormHelpers.validateForm.call(_this20, { formdata: _this20.state, validationErrors: {} });
          var updateStateData = {
            formDataErrors: validated_formdata.validationErrors
          };
          if (_this20.props.sendSubmitButtonVal) {
            updateStateData['submitButtonVal'] = formElement.value;
          }
          _this20.setState(updateStateData, function () {
            formElement.confirmModal && (0, _keys2.default)(_this20.state.formDataErrors).length < 1 ? getConfirmModal.call(_this20, { formElement: formElement }) : _this20.submitForm.call(_this20);
          });
        } }),
      formElement.value
    )
  );
}

function getCardFooterItem(options) {
  var formElement = options.formElement,
      i = options.i;

  formElement.layoutProps = (0, _assign2.default)({
    style: { cursor: 'pointer', textAlign: 'center' }
  }, formElement.layoutProps);
  return _react2.default.createElement(
    _reBulma.CardFooterItem,
    (0, _extends3.default)({ key: i }, formElement.layoutProps, { onClick: this.submitForm.bind(this) }),
    _react2.default.createElement(
      _reBulma.Label,
      formElement.passProps,
      formElement.value
    )
  );
}