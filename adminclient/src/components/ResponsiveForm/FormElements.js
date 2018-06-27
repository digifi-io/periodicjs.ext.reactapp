import React from 'react';
import FormItem from '../FormItem';
import RACodeMirror from '../RACodeMirror';
import PreviewEditor from '../PreviewEditor';
import ResponsiveDatalist from '../ResponsiveDatalist';
import ResponsiveTable from '../ResponsiveTable';
import DNDTable from '../DNDTable';
import SingleDatePickerWrapper from '../SingleDatePickerWrapper';
import DateRangePickerWrapper from '../DateRangePickerWrapper';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import capitalize from 'capitalize';
import utilities from '../../util';
import qs from 'querystring';
// import RAEditor from '../RAEditor';
// import ResponsiveButton from '../ResponsiveButton';
// import { EditorState, } from 'draft-js';
import Slider from 'rc-slider';
import { default as RCSwitch } from 'rc-switch';
import { ControlLabel, Label, Input, Button, CardFooterItem, Select, Textarea, Group, Image, } from 're-bulma';
import MaskedInput from 'react-text-mask';
import { Dropdown, Checkbox } from 'semantic-ui-react';
import moment from 'moment';
import numeral from 'numeral';
import pluralize from 'pluralize';
import flatten, { unflatten, } from 'flat';
import styles from '../../styles';
import { validateForm, } from './FormHelpers';
import debounce from 'debounce';

export function getPropertyAttribute(options) {
  let { property, element, } = options;
  let attribute = element.name;
  let selector = element.idSelector;
  // console.log({ options });
  let returnVal;
  if (attribute.indexOf('.') === -1) {
    returnVal = property[ attribute ];
  } else {
    let attrArray = attribute.split('.');
    returnVal = (property[ attrArray[ 0 ] ]) ? property[ attrArray[ 0 ] ][ attrArray[ 1 ] ] : undefined;
  }

  if (selector && !options.skipSelector) {
    return returnVal[ selector ];
  } else {
    return returnVal;
  }
}

function getErrorStatus(state, name) {
  return (state.formDataErrors && state.formDataErrors[ name ]);
}

function getValidStatus(state, name) {
  return (state.formDataValid && state.formDataValid[ name ]);
}


function getFormElementHelp(hasError, state, name) {
  return (hasError) ? {
    color: 'isDanger',
    text: state.formDataErrors[ name ][ 0 ],
  } : undefined;
}

function getCustomErrorLabel(hasError, state, formelement) {
  return (hasError) ? (
    <span className="__re-bulma_help __re-bulma_is-danger" style={formelement.customErrorProps}>{state.formDataErrors[ formelement.name ][ 0 ]}</span>
  ) : null;
}

function getCustomErrorIcon(hasError, isValid, state, formelement) {
  let iconStyle = formelement.customIconStyle;
  let iconVar = (hasError)
    ? formelement.errorIcon || 'fa fa-warning'
    : (isValid)
      ? formelement.validIcon || 'fa fa-check'
      : (formelement.initialIcon)
        ? formelement.initialIcon
        : '';

  return (formelement.errorIconRight || formelement.errorIconLeft)
    ? <i className={`__re-bulma_fa ${iconVar}`} style={iconStyle}></i>
    : null;
}

function valueChangeHandler(formElement) {
  return (event) => {
    let text = event.target.value;
    // console.debug({ text, formElement, });
    let updatedStateProp = {};
    updatedStateProp[ formElement.name ] = text;
    if (formElement.onChangeFilter) {
      const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
      updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
    }
    this.setState(updatedStateProp, () => {
      if (formElement.validateOnChange) {
        this.validateFormElement({ formElement, });
      } else if (formElement.valueCheckOnChange) {
        this.valueCheckFormElement({ formElement })
      }
    });
  };
}

function getFormLabel(formElement) {
  return (formElement.label)
    ? (formElement.layoutProps && formElement.layoutProps.horizontalform)
      ? (<ControlLabel {...formElement.labelProps}>{
        (this && this.state && this.state[ formElement.formdata_label ])
          ? this.state[ formElement.formdata_label ]
          : formElement.label}</ControlLabel>)
      : (<Label {...formElement.labelProps}>{(this && this.state && this.state[ formElement.formdata_label ])
        ? this.state[ formElement.formdata_label ]
        : formElement.label}</Label>)
    : null;
}
function getCustomFormLabel(formElement) {
  return (formElement.customLabel)
    ? (formElement.layoutProps && formElement.layoutProps.horizontalform)
      ? (<ControlLabel {...formElement.labelProps}>{(formElement.label && !Array.isArray(formElement.customLabel) && typeof formElement.customLabel === 'object')
        ? this.getRenderedComponent(formElement.customLabel)
        : formElement.customLabel}</ControlLabel>)
      : (<Label {...formElement.labelProps}>{(formElement.customLabel && !Array.isArray(formElement.customLabel) && typeof formElement.customLabel === 'object')
        ? this.getRenderedComponent(formElement.customLabel)
        : formElement.customLabel}</Label>)
    : null;
}
function getInitialValue(formElement, state) {
  // console.debug({formElement, state})
  let formElementValue = formElement.value;

  if (!formElement.showNullValue && (state[ formElement.name ] === null || formElementValue === null || formElementValue === 'null')) {
    return '';
  } else {
    let returnVal = (typeof state[ formElement.name ] !== 'undefined')
      ? state[ formElement.name ]
      : formElementValue;

    if (formElement.momentFormat) {
      returnVal = moment(returnVal).format(formElement.momentFormat);
    }
    if (formElement.numeralFormat) {
      returnVal = numeral(returnVal).format(formElement.numeralFormat);
    }

    return returnVal;
  }
}

function getPassablePropsKeyEvents(passableProps, formElement) {
  if (formElement.keyPress) {
    let customKeyPress = () => { };
    if (typeof formElement.keyPress === 'string' && formElement.keyPress.indexOf('func:this.props') !== -1) {
      customKeyPress = this.props[ formElement.keyPress.replace('func:this.props.', '') ];
    } else if (typeof formElement.keyPress === 'string' && formElement.keyPress.indexOf('func:window') !== -1 && typeof window[ formElement.keyPress.replace('func:window.', '') ] === 'function') {
      customKeyPress = window[ formElement.keyPress.replace('func:window.', '') ].bind(this);
      // console.debug({ customKeyPress });
    }
    passableProps.onKeyPress = (e) => {
      if (formElement.validateOnKeypress) {
        this.validateFormElement({ formElement, });
      }
      customKeyPress(e, formElement);
      // console.debug('custom press');
    };
  } else if (formElement.submitOnEnter) {
    passableProps.onKeyPress = (e) => {
      if (formElement.submitOnEnter && (e.key === 'Enter' || e.which === 13)) {
        this.submitForm();
      }
    };
  }
  if (formElement.onBlur) {
    let customonBlur = () => { };
    if (typeof formElement.onBlur === 'string' && formElement.onBlur.indexOf('func:this.props') !== -1) {
      customonBlur = this.props[ formElement.onBlur.replace('func:this.props.', '') ];
    } else if (typeof formElement.onBlur === 'string' && formElement.onBlur.indexOf('func:window') !== -1 && typeof window[ formElement.onBlur.replace('func:window.', '') ] === 'function') {
      customonBlur = window[ formElement.onBlur.replace('func:window.', '') ].bind(this);
    }
    passableProps.onBlur = (e) => {
      if (formElement.validateOnBlur) {
        this.validateFormElement({ formElement, });
      } else if (formElement.valueCheckOnBlur) {
        this.valueCheckFormElement({ formElement, });
      }
      customonBlur(e, formElement);
    };
  }
  if (formElement.onFocus) {
    let customFocus = () => { };
    if (typeof formElement.onFocus === 'string' && formElement.onFocus.indexOf('func:this.props') !== -1) {
      customFocus = this.props[ formElement.onFocus.replace('func:this.props.', '') ];
    } else if (typeof formElement.onFocus === 'string' && formElement.onFocus.indexOf('func:window') !== -1 && typeof window[ formElement.onFocus.replace('func:window.', '') ] === 'function') {
      customFocus = window[ formElement.onFocus.replace('func:window.', '') ].bind(this);
    }
    passableProps.onFocus = (e) => {
      customFocus(e, formElement);
    };
  }
  if (formElement.keyUp) {
    let customkeyUp = () => { };
    if (typeof formElement.keyUp === 'string' && formElement.keyUp.indexOf('func:this.props') !== -1) {
      customkeyUp = this.props[ formElement.keyUp.replace('func:this.props.', '') ];
    } else if (typeof formElement.keyUp === 'string' && formElement.keyUp.indexOf('func:window') !== -1 && typeof window[ formElement.keyUp.replace('func:window.', '') ] === 'function') {
      customkeyUp = window[ formElement.keyUp.replace('func:window.', '') ].bind(this);
    }
    passableProps.onKeyUp = (e) => {
      if (formElement.validateOnKeyup) {
        this.validateFormElement({ formElement, });
      }
      customkeyUp(e, formElement);
    };
  }
  return passableProps;
}

function getFunctionFromProps(options) {
  const { propFunc } = options;

  if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props.reduxRouter') !== -1) {
    return this.props.reduxRouter[ this.props.replace('func:this.props.reduxRouter.', '') ];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:this.props') !== -1) {
    return this.props[ this.props.replace('func:this.props.', '') ];
  } else if (typeof propFunc === 'string' && propFunc.indexOf('func:window') !== -1 && typeof window[ propFunc.replace('func:window.', '') ] === 'function') {
    return window[ propFunc.replace('func:window.', '') ];
  } else if (typeof this.props[ propFunc ] === 'function') {
    return propFunc;
  } else {
    return function () { }
  }
}

export function getFormDNDTable(options) {
  let { formElement, i, } = options;
  // let initialValue = getInitialValue(formElement,
  // (Object.keys(this.state.formDataTables).length && this.state.formDataTables[formElement.name])?this.state.formDataTables :  Object.assign({}, this.state, unflatten(this.state, { overwrite: true })));
  let initialValue = this.state[ formElement.name ];
  // console.debug({ initialValue },this.state, this.state[formElement.name]);
  let hasError = getErrorStatus(this.state, formElement.name);
  const getTableHeaders = (row) => {
    return row.map(rowkey => {
      let selectOptions = (this.state.__formOptions && this.state.__formOptions[ rowkey ])
        ? this.state.__formOptions[ rowkey ]
        : [];
      // console.log({ selectOptions });
      return {
        label: capitalize(rowkey),
        sortid: rowkey,
        sortable: (typeof formElement.sortable !== 'undefined')
          ? formElement.sortable
          : true,
        formtype: (formElement.tableHeaderType && formElement.tableHeaderType[ rowkey ])
          ? formElement.tableHeaderType[ rowkey ]
          : 'text',
        defaultValue: (formElement.tableHeaderDefaultValue && formElement.tableHeaderDefaultValue[ rowkey ])
          ? formElement.tableHeaderDefaultValue[ rowkey ]
          : (selectOptions.length)
            ? selectOptions[ 0 ].value
            : undefined,
        formoptions: selectOptions,
        footerFormElementPassProps: Object.assign({
          placeholder: capitalize(rowkey),
        }, formElement.footerFormElementPassProps),
      };
    });
  };
  let handleRowUpdate = () => { console.debug('Error handleRowUpdate function does not exists') };
  if (formElement.handleRowUpdate && formElement.handleRowUpdate.indexOf('func:window') !== -1 && typeof window[ formElement.handleRowUpdate.replace('func:window.', '') ] === 'function') {
    handleRowUpdate = window[ formElement.handleRowUpdate.replace('func:window.', '') ].bind(this, formElement);
  }
  let useRowButtons = formElement.rowButtons;
  let ignoreTableHeaders = formElement.ignoreTableHeaders || [];
  let tableHeaders = (formElement.headers)
    ? (formElement.useStandardHeaders)
      ? getTableHeaders(formElement.headers.map(header => header.sortid))
      : formElement.headers
    : (initialValue && Array.isArray(initialValue) && initialValue.length)
      ? getTableHeaders(Object.keys(initialValue[ 0 ]).filter(header => ignoreTableHeaders.indexOf(header) === -1))
      : [];
  tableHeaders = (useRowButtons)
    ? tableHeaders.concat({
      label: formElement.rowOptionsLabel || '',
      formtype: false,
      formRowButtons: true,
      formRowButtonProps: formElement.formRowButtonProps,
    })
    : tableHeaders.concat({
      label: '',
      formtype: false,
    });
  tableHeaders = tableHeaders.map(header => {
    if ((header.formtype === 'select' || header.formtype === 'dropdown') && !header.formoptions) {
      header.formoptions = (header.sortid && this.state.__formOptions && this.state.__formOptions[ header.sortid ])
        ? this.state.__formOptions[ header.sortid ]
        : [];
    }
    return header;
  })
  let passedProps = Object.assign(
    {},
    this.props,
    {
      rows: initialValue,
      headers: tableHeaders,
      toggleRowKeys: formElement.toggleRowKeys,
      toggleRowClass: formElement.toggleRowClass,
    },
    formElement.passProps
  );
  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    <DNDTable {...passedProps}
      handleRowUpdate={handleRowUpdate.bind(this)}
      value={initialValue} />
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}

export function getFormDatatable(options) {
  let { formElement, i, } = options;
  let initialValue = getInitialValue(formElement,
    (Object.keys(this.state.formDataTables).length && this.state.formDataTables[ formElement.name ]) ? this.state.formDataTables : Object.assign({}, this.state, unflatten(this.state, { overwrite: true })));
  // console.debug({ initialValue },this.state, this.state[formElement.name]);
  let hasError = getErrorStatus(this.state, formElement.name);
  const getTableHeaders = (row) => {
    return row.map(rowkey => {
      let selectOptions = (this.state.__formOptions && this.state.__formOptions[ rowkey ])
        ? this.state.__formOptions[ rowkey ]
        : [];
      return {
        label: capitalize(rowkey),
        sortid: rowkey,
        sortable: (typeof formElement.sortable !== 'undefined')
          ? formElement.sortable
          : true,
        formtype: (formElement.tableHeaderType && formElement.tableHeaderType[ rowkey ])
          ? formElement.tableHeaderType[ rowkey ]
          : 'text',
        defaultValue: (formElement.tableHeaderDefaultValue && formElement.tableHeaderDefaultValue[ rowkey ])
          ? formElement.tableHeaderDefaultValue[ rowkey ]
          : (selectOptions.length)
            ? selectOptions[ 0 ].value
            : undefined,
        formoptions: selectOptions,
        footerFormElementPassProps: Object.assign({
          placeholder: capitalize(rowkey),
        }, formElement.footerFormElementPassProps),
      };
    });
  };
  let useRowButtons = formElement.rowButtons;
  let ignoreTableHeaders = formElement.ignoreTableHeaders || [];
  let tableHeaders = (formElement.headers)
    ? (formElement.useStandardHeaders)
      ? getTableHeaders(formElement.headers.map(header => header.sortid))
      : formElement.headers
    : (initialValue && Array.isArray(initialValue) && initialValue.length)
      ? getTableHeaders(Object.keys(initialValue[ 0 ]).filter(header => ignoreTableHeaders.indexOf(header) === -1))
      : [];
  tableHeaders = (useRowButtons)
    ? tableHeaders.concat({
      label: formElement.rowOptionsLabel || '',
      formtype: false,
      formRowButtons: true,
      formRowButtonProps: formElement.formRowButtonProps,
    })
    : tableHeaders.concat({
      label: '',
      formtype: false,
    });
  tableHeaders = tableHeaders.map(header => {
    if ((header.formtype === 'select' || header.formtype === 'dropdown') && !header.formoptions) {
      header.formoptions = (header.sortid && this.state.__formOptions && this.state.__formOptions[ header.sortid ])
        ? this.state.__formOptions[ header.sortid ]
        : [];
    }
    return header;
  })
  let passedProps = Object.assign(
    {},
    this.props,
    {
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
      uniqueFormOptions: formElement.uniqueFormOptions,
    },
    formElement.passProps
  );// formElement.datalist,
  // console.log({ tableHeaders, useRowButtons,passedProps });
  // console.debug({tableHeaders})
  // let shape ={};// this is the header of of the footer which has elements for new insert
  // let inlineshape ={};// if true, should look like a regular form row, else form below
  // console.debug({formElement,initialValue, },'this.state',this.state);
  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    <ResponsiveTable {...passedProps}
      onChange={(newvalue) => {
        let selectedRowData = (formElement.selectEntireRow && (newvalue.selectedRowData || newvalue.selectedRowIndex))
          ? {
            [ `${formElement.name}__tabledata` ]: {
              selectedRowData: newvalue.selectedRowData,
              selectedRowIndex: newvalue.selectedRowIndex,
            },
          }
          : {};
        let flattenedData = (this.props.flattenFormData)
          ? flatten(Object.assign({}, selectedRowData, { [ formElement.name ]: newvalue.rows, }))
          : {};
        let updatedStateProp = Object.assign({
          formDataTables: Object.assign({}, this.state.formDataTables, { [ formElement.name ]: newvalue.rows, }),
          [ formElement.name ]: newvalue.rows,
        }, flattenedData, selectedRowData);
        if (formElement.onChangeFilter) {
          const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
          updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
        }
        // console.debug('DATATABLE', updatedStateProp);
        this.setState(updatedStateProp);
      }}
      value={initialValue} />
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}

export function getFormDatalist(options) {
  let { formElement, i, } = options;
  let initialValue = getInitialValue(formElement, Object.assign({}, this.state, unflatten(this.state)));
  let hasError = getErrorStatus(this.state, formElement.name);
  let passedProps = Object.assign({},
    this.props,
    {
      wrapperProps: {
        style: {
          display: 'flex',
          width: '100%',
          flex: '5',
          alignItems: 'stretch',
          flexDirection: 'column',
        },
      },
      passableProps: {
        help: getFormElementHelp(hasError, this.state, formElement.name),
        color: (hasError) ? 'isDanger' : undefined,
        icon: (hasError) ? formElement.errorIcon || 'fa fa-warning' : undefined,
        placeholder: formElement.placeholder,
        style: {
          width: '100%',
        },
      },
    },
    formElement.datalist);
  // console.debug({formElement,initialValue, },'this.state',this.state);
  // console.debug({ passedProps });
  if (formElement.datalist.staticSearch) {
    // let datalistdata = this.state[formElement.name];
    let datalistdata = [];
    if (this.props.__formOptions && this.props.__formOptions[ formElement.name ]) {
      datalistdata = this.props.__formOptions[ formElement.name ];
    } else {
      datalistdata = this.props.formdata[ pluralize(formElement.datalist.entity) ] || [];
    }
    passedProps.datalistdata = datalistdata;
  }
  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    <ResponsiveDatalist {...passedProps}
      onChange={(newvalue) => {
        let updatedStateProp = {};
        updatedStateProp[ formElement.name ] = newvalue;
        this.setState(updatedStateProp);
      }}
      value={initialValue} />
  </FormItem>);
}

export function getFormDropdown(options) {
  let { formElement, i, } = options;
  let initialValue = getInitialValue(formElement, Object.assign({}, this.state, unflatten(this.state)));
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[ formElement.name ]) ? true : false;
  let isValid = getValidStatus(this.state, formElement.name);
  let customLabel = getCustomFormLabel.bind(this);
  let wrapperProps = Object.assign({
    className: '__re-bulma_control',
  }, formElement.wrapperProps)

  wrapperProps.className = ((hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft)) ? (formElement.errorIconRight) ?
    wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-right'
    : wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-left'
    : wrapperProps.className;

  let onChange;
  let passedProps = formElement.passProps;
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passedProps = getPassablePropkeyevents(passedProps, formElement);
  let dropdowndata = [];
  let displayField = (formElement.passProps.displayField) ? formElement.passProps.displayField : 'label';
  let valueField = (formElement.passProps.valueField) ? formElement.passProps.valueField : 'value';
  let updatedState = {};
  if (formElement.searchProps && passedProps.search) {
    let prev;
    passedProps.search = (dropdowns, query) => {
      // debounce(() => {
      //   console.log({query, dropdowns, prev})
      //   if (prev !== query) {
      //     prev = query;
      //     console.log('DIFF');
      //     return [ 'diff' ];
      //   } else {
      //     console.log('SAME');
      //     return ['same'];
      //   }
      // }, 3000)()

      debounce(() => {
        console.log({query, dropdowns, prev})
        if (prev !== query) {
          prev = query;
          console.log('DIFF');
          let options = formElement.searchProps;
          if (options.pagenum < 1) {
            options.pagenum = 1;
          }
          let stateProps = this.props.getState();
          let fetchURL = `${stateProps.settings.basename}${options.baseUrl}&${qs.stringify({
            limit: this.state.limit || this.props.limit || 50,
            sort: '-createdat',
            query: options.search,
            allowSpecialCharacters: true,
            pagenum: options.pagenum || 1,
          })}`;
          return [ 'diff' ];
        } else {
          console.log('SAME');
          return ['same'];
        }
      }, 3000)()

      // debounce(() => {
      //   if (!prev || (prev !== query)) {
      //     console.log({ prev, query });
      //     prev = query;
      //     let options = formElement.searchProps;
      //     if (options.pagenum < 1) {
      //       options.pagenum = 1;
      //     }
      //     this.setState({ isLoading: true, });
      //     let stateProps = this.props.getState();
      //     let fetchURL = `${stateProps.settings.basename}${options.baseUrl}&${qs.stringify({
      //       limit: this.state.limit || this.props.limit || 50,
      //       sort: '-createdat',
      //       // fq: (this.state.filterRowData && this.state.filterRowData.length)
      //       //   ? this.state.filterRowData.map(frd => {
      //       //     return `${frd.property}|||${frd.filter_value}|||${frd.value}`;
      //       //   })
      //       //   : undefined,
      //       query: options.search,
      //       allowSpecialCharacters: true,
      //       pagenum: options.pagenum || 1,
      //     })}`;
      //     // console.debug('this.state.filterRowData', this.state.filterRowData, { options, fetchURL, });
      //     let headers = Object.assign({
      //       'x-access-token': stateProps.user.jwt_token,
      //     }, stateProps.settings.userprofile.options.headers);
      //     console.log({ headers, fetchURL })
      //     utilities.fetchComponent(fetchURL, { headers, })()
      //       .then(response => {
      //         console.log({ response })
      //         // let usingResponsePages = false;
      //         // console.debug('this.props.dataMap',this.props.dataMap)
      //         // console.log({ response })
      //         if (response.data && response.result && response.status) {
      //           // console.log('USE DATA FROM RESPONSE', response.data)
      //           // console.log('this.props.dataMap',this.props.dataMap)
      //           response = response.data;
      //         }
      //         updatedState.numPages = Math.ceil(updatedState.numItems / this.state.limit);
      //         updatedState.limit = this.state.limit;
      //         updatedState.currentPage = (typeof options.pagenum !== 'undefined') ? options.pagenum : this.props.currentPage;
      //         updatedState.isLoading = false;
      //         this.setState(updatedState);
      //         return [];
      //       }, e => {
      //         console.log({ e })
      //         this.props.errorNotification(e);
      //       });
      //   } else {
      //     prev = query;
      //     return options;
      //   }
      // }, 3000)()

    }
  }
  else if (this.props.__formOptions && formElement.formoptions_field && this.props.__formOptions[ formElement.formoptions_field ]) {
    dropdowndata = this.props.__formOptions[ formElement.formoptions_field ];
    dropdowndata = dropdowndata.map(option => ({ text: option[ displayField ], value: option[ valueField ], key: option[ valueField ] }));
  }
  else if (this.props.__formOptions && this.props.__formOptions[ formElement.name ]) {
    dropdowndata = this.props.__formOptions[ formElement.name ];
    dropdowndata = dropdowndata.map(option => ({ text: option[ displayField ], value: option[ valueField ], key: option[ valueField ] }));
  } else {
    dropdowndata = formElement.options || [];
    dropdowndata = dropdowndata.map(option => ({ text: option[ displayField ], value: option[ valueField ], key: option[ valueField ] }));
  }
  passedProps.options = dropdowndata;
  if (formElement.disableOnChange) {
    onChange = () => { return () => { } };
  } else if (!onChange && formElement.passProps.multiple) {
    onChange = (event, newvalue) => {
      let updatedStateProp = {};
      newvalue.options.forEach((val, idx) => {
        if (newvalue.value[ idx ]) updatedStateProp[ `${formElement.name}.${idx}` ] = newvalue.value[ idx ];
        else updatedStateProp[ `${formElement.name}.${idx}` ] = undefined;
      });
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        } else if (formElement.valueCheckOnChange) {
          this.valueCheckFormElement({ formElement })
        }
      });
    }
  } else if (!onChange) {
    onChange = (event, newvalue) => {
      let updatedStateProp = {};
      updatedStateProp[ formElement.name ] = newvalue.value;
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        } else if (formElement.valueCheckOnChange) {
          this.valueCheckFormElement({ formElement })
        }
      });
    }
  }
  let customCallbackfunction;
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[ formElement.customOnChange.replace('func:this.props.', '') ];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[ formElement.customOnChange.replace('func:window.', '') ] === 'function') {
      customCallbackfunction = window[ formElement.customOnChange.replace('func:window.', '') ].bind(this, formElement);
    }
  }

  formElement.customIconStyle = Object.assign({}, { right: "24px" }, formElement.customIconStyle);

  if (formElement.passProps.multiple && Array.isArray(unflatten(this.state)[ formElement.name ])) {
    initialValue = unflatten(this.state)[ formElement.name ].filter(i => i !== undefined);
  }

  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue}>
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div {...wrapperProps}>
      <Dropdown {...passedProps}
        value={initialValue}
        onChange={(event, newvalue) => {
          onChange.call(this, event, newvalue);
          if (customCallbackfunction) customCallbackfunction(event, newvalue);
        }}
      />
      {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </div>
  </FormItem>);
}

export function getFormMaskedInput(options) {
  let { formElement, i, /*formgroup, width,*/ onChange, } = options;
  let initialValue = getInitialValue(formElement, this.state);
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  let fileClassname = `__reactapp_file_${formElement.name}`;
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[ formElement.name ]) ? true : false;
  let isValid = getValidStatus(this.state, formElement.name);
  let customLabel = getCustomFormLabel.bind(this);
  let passableProps = Object.assign({
    type: 'text',
    className: '__re-bulma_input',
  }, formElement.passProps);

  if (typeof initialValue !== 'string') {
    initialValue = JSON.stringify(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    onChange = () => { };
  } else if (!onChange) {
    onChange = (event) => {
      let text = event.target.value;
      let updatedStateProp = {};
      if (passableProps && passableProps.multiple) {
        document.querySelector(`.${fileClassname} input`).setAttribute('multiple', true);
      }
      updatedStateProp[ formElement.name ] = (passableProps.maxLength) ? text.substring(0, passableProps.maxLength) : text;
      this.setState(updatedStateProp);
    };
  }
  passableProps = getPassablePropkeyevents(passableProps, formElement);
  if (passableProps && passableProps.multiple) {
    let t = setImmediate(() => {
      document.querySelector(`.${fileClassname} input`).setAttribute('multiple', true);
      clearImmediate(t);
    });
  }

  formElement.customErrorProps = (formElement.customErrorProps) ? Object.assign({}, { marginTop: '6px' }, formElement.customErrorProps) : { marginTop: '6px' };

  let mask = [];
  function maskFunction(maskProp) {
    return function () {
      // return [ '(', /[1-9]/, /\d/, /\d/, ')', '\u2000', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ];
      if (Array.isArray(maskProp)) {
        const maskArray = maskProp.map(maskItem => {
          if (maskItem.charAt(0) === '/' && maskItem.charAt(maskItem.length - 1) === '/') {
            if (maskItem.charAt(1) === '[') {
              return new RegExp(maskItem.slice(1, maskItem.length - 1));
            } else {
              return new RegExp(`\\${maskItem.slice(1, maskItem.length - 1)}`);
            }
          } else {
            return maskItem;
          }
        });
        return maskArray;
      } else {
        return maskProp;
      }
    }
  }
  if (formElement.createNumberMask && typeof passableProps.mask === 'string' && passableProps.mask.indexOf('func:window') !== -1 && typeof window[ passableProps.mask.replace('func:window.', '') ] === 'function') {
    let numberMaskConfig = (typeof window[ passableProps.mask.replace('func:window.', '') ].call(this, formElement) === 'object') ? window[ passableProps.mask.replace('func:window.', '') ].call(this, formElement) : {};
    mask = createNumberMask(numberMaskConfig);
  } else if (typeof passableProps.mask === 'string' && passableProps.mask.indexOf('func:window') !== -1 && typeof window[ passableProps.mask.replace('func:window.', '') ] === 'function') {
    mask = window[ passableProps.mask.replace('func:window.', '') ].bind(this, formElement);
  } else if (formElement.createNumberMask) {
    // console.log('passableProps.numberMask',passableProps.numberMask)
    mask = createNumberMask(maskFunction(passableProps.mask));
  } else if (passableProps.mask) {
    mask = maskFunction(passableProps.mask);
  }
  // console.log({mask})
  let wrapperProps = Object.assign({
    className: '__re-bulma_control',
  }, formElement.wrapperProps);

  wrapperProps.className = ((hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft)) ? (formElement.errorIconRight) ?
    wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-right'
    : wrapperProps.className + ' __re-bulma_has-icon __re-bulma_has-icon-left'
    : wrapperProps.className;

  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <span {...wrapperProps}>
      <MaskedInput
        {...passableProps}
        mask={mask}
        className={(hasError) ? passableProps.className + ' __re-bulma_is-danger' : passableProps.className}
        color={(hasError) ? 'isDanger' : undefined}
        onChange={onChange}
        placeholder={formElement.placeholder}
        value={initialValue} />
      {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </span>
  </FormItem>);
}

export function getFormTextInputArea(options) {
  let { formElement, i, /*formgroup, width,*/ onChange, } = options;
  let initialValue = getInitialValue(formElement, this.state); //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  let fileClassname = `__reactapp_file_${formElement.name}`;
  let hasError = getErrorStatus(this.state, formElement.name);
  let isValid = getValidStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[ formElement.name ]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  let submitMultipartForm;
  let passableProps = Object.assign({
    type: formElement.type || 'text',
  }, formElement.passProps);
  if (passableProps && passableProps.type === 'file') {
    passableProps.className = fileClassname;
  }
  if (typeof initialValue !== 'string') {
    initialValue = JSON.stringify(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    onChange = () => { };
  } else if (!onChange) {
    onChange = (event) => {
      let text = event.target.value;
      let updatedStateProp = {};
      let customCallbackfunction;
      if (passableProps && passableProps.multiple) {
        document.querySelector(`.${fileClassname} input`).setAttribute('multiple', true);
      }

      if (passableProps && passableProps.type === 'file') {
        updatedStateProp.formDataFiles = Object.assign({}, this.state.formDataFiles, {
          [ formElement.name ]: document.querySelector(`.${fileClassname} input`),
        });
        if (formElement.submitOnChange) {
          submitMultipartForm = setTimeout(() => {
            this.submitForm();
          }, 0);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        updatedStateProp[ formElement.name ] = (passableProps.maxLength) ? text.substring(0, passableProps.maxLength) : text;
      }
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      } else if (formElement.customOnChange) {
        if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
          customCallbackfunction = this.props[ formElement.customOnChange.replace('func:this.props.', '') ];
        } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[ formElement.customOnChange.replace('func:window.', '') ] === 'function') {
          customCallbackfunction = window[ formElement.customOnChange.replace('func:window.', '') ].bind(this, formElement);
        }
      }
      this.setState(updatedStateProp);
      if (typeof customCallbackfunction === 'function') customCallbackfunction();
    };
  }
  passableProps = getPassablePropkeyevents(passableProps, formElement);

  // console.debug({ passableProps });
  if (passableProps && passableProps.multiple) {
    let t = setImmediate(() => {
      document.querySelector(`.${fileClassname} input`).setAttribute('multiple', true);
      clearImmediate(t);
    });
  }
  if (submitMultipartForm) clearTimeout(submitMultipartForm);
  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <Input {...passableProps}
      help={getFormElementHelp(hasError, this.state, formElement.name)}
      color={(hasError) ? 'isDanger' : undefined}
      icon={(hasError) ? formElement.errorIcon || 'fa fa-warning' : (isValid) ? formElement.validIcon || 'fa fa-check' : (formElement.initialIcon) ? formElement.initialIcon : undefined}
      hasIconRight={formElement.errorIconRight}
      onChange={onChange}
      placeholder={formElement.placeholder}
      value={initialValue} />
  </FormItem>);
}

export function getFormTextArea(options) {
  let { formElement, i, /*formgroup, width,*/ onChange, } = options;
  let initialValue = getInitialValue(formElement, this.state); //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  let hasError = getErrorStatus(this.state, formElement.name);
  let isValid = getValidStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[ formElement.name ]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  let passableProps = Object.assign({
  }, formElement.passProps);
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passableProps = getPassablePropkeyevents(passableProps, formElement);

  if (typeof initialValue !== 'string') {
    initialValue = JSON.stringify(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    onChange = () => { return () => { } };
  } else if (!onChange) {
    onChange = valueChangeHandler.bind(this, formElement);
  }

  let iconClassNames = ((hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft))
    ? (formElement.errorIconRight)
      ? ' __re-bulma_has-icon __re-bulma_has-icon-right'
      : ' __re-bulma_has-icon __re-bulma_has-icon-left'
    : '';

  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <p className={"__re-bulma_control" + iconClassNames}>
      <Textarea {...passableProps}
        onChange={(event) => onChange()(event)}
        help={getFormElementHelp(hasError, this.state, formElement.name)}
        icon={(hasError) ? formElement.errorIcon || 'fa fa-warning' : (isValid) ? formElement.validIcon || 'fa fa-check' : (formElement.initialIcon) ? formElement.initialIcon : undefined}
        color={(hasError) ? 'isDanger' : undefined}
        hasIconRight={formElement.errorIconRight}
        placeholder={formElement.placeholder || formElement.label}
        value={this.state[ formElement.name ] || initialValue} />
      {getCustomErrorIcon(hasError, isValid, this.state, formElement)}
    </p>
  </FormItem>);
}

export function getFormSelect(options) {
  let { formElement, i, /*formgroup, width,*/ onChange, } = options;
  let initialValue = getInitialValue(formElement, this.state); //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  let hasError = getErrorStatus(this.state, formElement.name);
  let isValid = getValidStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[ formElement.name ]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  let selectOptions = (this.state.__formOptions && this.state.__formOptions[ formElement.name ])
    ? this.state.__formOptions[ formElement.name ]
    : formElement.options || [];
  if (typeof initialValue !== 'string') {
    initialValue = JSON.stringify(initialValue, null, 2);
  }
  if (formElement.disableOnChange) {
    onChange = () => { return () => { } };
  } else if (!onChange) {
    onChange = valueChangeHandler.bind(this, formElement);
  }
  let customCallbackfunction;
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[ formElement.customOnChange.replace('func:this.props.', '') ];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[ formElement.customOnChange.replace('func:window.', '') ] === 'function') {
      customCallbackfunction = window[ formElement.customOnChange.replace('func:window.', '') ].bind(this, formElement);
    }
  }

  let iconClassNames = ((hasError || isValid || formElement.initialIcon) && (formElement.errorIconRight || formElement.errorIconLeft))
    ? (formElement.errorIconRight)
      ? ' __re-bulma_has-icon __re-bulma_has-icon-right'
      : ' __re-bulma_has-icon __re-bulma_has-icon-left'
    : '';

  formElement.customIconStyle = Object.assign({}, { right: "24px" }, formElement.customIconStyle);

  return (<FormItem key={i} {...formElement.layoutProps} initialIcon={formElement.initialIcon} isValid={isValid} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <span className={"__re-bulma_control" + iconClassNames} style={{ position: 'relative', display: 'block' }}>
      <Select {...formElement.passProps}
        style={Object.assign({}, { flex: 'inherit', marginBottom: 0 }, (formElement.passProps && formElement.passProps.style) ? formElement.passProps.style : {})}
        help={getFormElementHelp(hasError, this.state, formElement.name)}
        color={(hasError) ? 'isDanger' : undefined}
        onChange={(event) => {
          onChange()(event);
          if (customCallbackfunction) customCallbackfunction(event);
        }}
        placeholder={formElement.placeholder || formElement.label}
        value={this.state[ formElement.name ] || initialValue} >
        {selectOptions.map((opt, k) => {
          return <option key={k} disabled={opt.disabled} value={opt.value}>{opt.label || opt.value}</option>;
        })}
      </Select>
      {(!formElement.errorIconLeft) ? getCustomErrorIcon(hasError, isValid, this.state, formElement) : null}
    </span>
  </FormItem>);
}

export function getFormCheckbox(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[ formElement.name ]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  if (formElement.disableOnChange) {
    onValueChange = () => { };
  } else if (!onValueChange) {
    onValueChange = (/*event*/) => {
      // let text = event.target.value;
      let updatedStateProp = {};
      // console.debug('before', { updatedStateProp, formElement, }, event.target);
      if (formElement.type === 'radio') {
        // event.target.value = 'on';
        updatedStateProp[ this.state[ formElement.formdata_name ] || formElement.name ] = this.state[ formElement.formdata_value ] || formElement.value || 'on';
      } else {
        updatedStateProp[ this.state[ formElement.formdata_name ] || formElement.name ] = (this.state[ this.state[ formElement.formdata_name ] || formElement.name ]) ? 0 : 'on';
      }
      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        }
      });
    };
  }
  return (<FormItem key={i} {...formElement.layoutProps} hasError={hasError} hasValue={hasValue} >
    {(!formElement.customLabel) ? getFormLabel(formElement) : null}
    <input {...formElement.passProps}
      type={formElement.type || 'checkbox'}
      name={this.state[ formElement.formdata_name ] || formElement.name}
      checked={(formElement.type === 'radio')
        ? this.state[ formElement.name ] === formElement.value
        : this.state[ formElement.name ]}
      onChange={onValueChange}
    >
    </input>
    {customLabel(formElement)}
    <span {...formElement.placeholderProps}>{this.state[ formElement.formdata_placeholder ] || formElement.placeholder}</span>
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}

export function getFormButton(options) {
  let { formElement, i, onValueChange, } = options;
  if (formElement.value) {
    this.setState({ [ formElement.name ]: formElement.value })
  }
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[ formElement.name ]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  let onClickHandler;
  if (formElement.onClick) {
    if (formElement.onClick.indexOf('func:this.props') !== -1) {
      onClickHandler = this.props[ formElement.onClick.replace('func:this.props.', '') ];
    } else if (formElement.onClick.indexOf('func:window') !== -1 && typeof window[ formElement.onClick.replace('func:window.', '') ] === 'function') {
      onClickHandler = window[ formElement.onClick.replace('func:window.', '') ].bind(this, formElement);
    } else {
      onClickHandler = () => { };
    }
  } else {
    onClickHandler = () => { };
  }


  return (<FormItem key={i} {...formElement.layoutProps} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <Button {...formElement.passProps}
      type={formElement.type}
      name={this.state[ formElement.formdata_name ] || formElement.name}
      onClick={onClickHandler}
    >
    </Button>
    <span {...formElement.placeholderProps}>{this.state[ formElement.formdata_placeholder ] || formElement.placeholder}</span>
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}


export function getFormSemanticCheckbox(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[ formElement.name ]) ? true : false;
  if (formElement.disableOnChange) {
    onValueChange = () => { };
  } else if (!onValueChange) {
    onValueChange = (/*event*/) => {
      // let text = event.target.value;
      let updatedStateProp = {};
      // console.debug('before', { updatedStateProp, formElement, }, event.target);

      updatedStateProp[ this.state[ formElement.formdata_name ] || formElement.name ] = (this.state[ this.state[ formElement.formdata_name ] || formElement.name ]) ? 0 : 'on';
      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        }
      });
    };
  }
  return (<FormItem key={i} {...formElement.layoutProps} hasError={hasError} hasValue={hasValue} >
    <Checkbox {...formElement.passProps}
      name={this.state[ formElement.formdata_name ] || formElement.name}
      checked={(this.state[ formElement.name ] === "on") ? true : false}
      onChange={onValueChange}
      label={(typeof formElement.label === "string")
        ? formElement.label
        : (typeof formElement.label === "object")
          ? this.getRenderedComponent(formElement.label)
          : null}
    >
    </Checkbox>
    {/*<span {...formElement.placeholderProps}>{this.state[ formElement.formdata_placeholder] || formElement.placeholder}</span>*/}
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}

export function getFormSwitch(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let hasValue = (formElement.name && this.state[ formElement.name ]) ? true : false;
  let customLabel = getCustomFormLabel.bind(this);
  if (formElement.disableOnChange) {
    onValueChange = () => { };
  } else if (!onValueChange) {
    onValueChange = (/*event*/) => {
      // let text = event.target.value;
      let updatedStateProp = {};
      // console.debug('before', { updatedStateProp, formElement, }, event.target);
      updatedStateProp[ this.state[ formElement.formdata_name ] || formElement.name ] = (this.state[ this.state[ formElement.formdata_name ] || formElement.name ]) ? 0 : 'on';

      // console.debug('after', { updatedStateProp, formElement, }, event.target);
      if (formElement.onChange) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChange });
        onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp, () => {
        if (formElement.validateOnChange) {
          this.validateFormElement({ formElement, });
        }
      });
    };
  }

  return (<FormItem key={i} {...formElement.layoutProps} hasError={hasError} hasValue={hasValue} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div>
      <RCSwitch
        {...formElement.passProps}
        // type={formElement.type || 'checkbox'}
        // name={this.state[ formElement.formdata_name] || formElement.name}
        checked={this.state[ formElement.name ]}
        // disabled={this.state.disabled}
        // checkedChildren={'on'}
        // unCheckedChildren={''}
        onChange={onValueChange}
      />
    </div>
    <span {...formElement.placeholderProps}>{this.state[ formElement.formdata_placeholder ] || formElement.placeholder}</span>
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>);
}

export function getRawInput(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let customLabel = getCustomFormLabel.bind(this);
  let wrapperProps = Object.assign({
    style: {
      overflow: 'auto',
      backgroundColor: 'white',
      border: (hasError) ? '1px solid #ed6c63' : '1px solid #d3d6db',
      borderRadius: 3,
      height: 'auto',
      boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
    },
  }, formElement.wrapperProps);
  let passableProps = formElement.passProps;
  let getPassablePropkeyevents = getPassablePropsKeyEvents.bind(this);
  passableProps = getPassablePropkeyevents(passableProps, formElement);
  if (!onValueChange) {
    onValueChange = (/*event*/) => {
      // let text = event.target.value;
      let updatedStateProp = {};
      updatedStateProp[ formElement.name ] = (this.state[ formElement.name ]) ? false : 'on';
      // console.log({ updatedStateProp });
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp);
    };
  }

  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <div {...wrapperProps}>
      <input {...passableProps}
        type={formElement.type}
        checked={this.state[ formElement.name ]}
        onChange={onValueChange}
      >
      </input>
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </div>
  </FormItem>);
}

export function getSliderInput(options) {
  let { formElement, i, onValueChange, } = options;
  // const Handle = (
  // );
  let hasError = getErrorStatus(this.state, formElement.name);
  let wrapperProps = Object.assign({
    style: {
      overflow: 'auto',
      backgroundColor: 'white',
      border: (hasError) ? '1px solid #ed6c63' : '1px solid #d3d6db',
      borderRadius: 3,
      height: 'auto',
      boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
    },
  }, formElement.wrapperProps);
  let passableProps = Object.assign({}, formElement.passProps);
  let customCallbackfunction = () => { };
  if (formElement.handle) {
    passableProps.handle = ({ value, offset, }) => (
      <div style={{ left: `${offset}%`, }} className="__reactapp_slider__handle">
        <span className="__reactapp_arrow-left" />
        {(formElement.numeralFormat) ? numeral(value).format(formElement.numeralFormat) : value}
        <span className="__reactapp_arrow-right" />
      </div>
    );
  }
  if (formElement.customOnChange) {
    if (formElement.customOnChange.indexOf('func:this.props') !== -1) {
      customCallbackfunction = this.props[ formElement.customOnChange.replace('func:this.props.', '') ];
    } else if (formElement.customOnChange.indexOf('func:window') !== -1 && typeof window[ formElement.customOnChange.replace('func:window.', '') ] === 'function') {
      customCallbackfunction = window[ formElement.customOnChange.replace('func:window.', '') ].bind(this);
    }
  }
  if (!onValueChange) {
    onValueChange = (val) => {
      // console.debug({ val });
      let updatedStateProp = {};
      updatedStateProp[ formElement.name ] = val;
      // console.log({ updatedStateProp });
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp);
      customCallbackfunction(val);
    };
  }


  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    <div {...wrapperProps}>
      <Slider {...passableProps}
        onChange={onValueChange}
      >
        {(formElement.leftLabel)
          ? (<span className="__reactapp_slider__label __reactapp_slider__label_left">{formElement.leftLabel}</span>)
          : null
        }
        {(formElement.rightLabel)
          ? (<span className="__reactapp_slider__label __reactapp_slider__label_right">{formElement.rightLabel}</span>)
          : null
        }
      </Slider>
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </div>
  </FormItem>);
}

export function getHiddenInput(options) {
  let { formElement, i, } = options;
  let initialValue = this.state[ formElement.formdata_name ] || this.state[ formElement.name ] || formElement.value;

  return <input key={i}  {...formElement.passProps}
    type="hidden"
    value={initialValue} />;
}

export function getImage(options) {
  let { formElement, i, } = options;
  let initialValue = getInitialValue(formElement, this.state);
  let imageProps = Object.assign({
    style: {
      textAlign: 'center',
    },
  }, formElement.passProps);
  //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    {(formElement.link)
      ? (<a href={initialValue} target="_blank"><Image key={i}  {...imageProps} src={this.state[ formElement.preview ] || initialValue} /></a>)
      : <Image key={i}  {...imageProps} src={this.state[ formElement.preview ] || initialValue} />
    }
  </FormItem>);
}

export function getFormLink(options) {
  let { formElement, i, button, } = options;

  let wrapperProps = Object.assign({
    style: styles.inputStyle,
  }, formElement.wrapperProps);
  let linkWrapperProps = Object.assign({
    style: {
      padding: '0 5px',
    },
  }, formElement.linkWrapperProps);
  // console.debug({ linkWrapperProps, formElement });

  return (<FormItem key={i} {...formElement.layoutProps} >
    {getFormLabel(formElement)}
    <span {...wrapperProps}>
      <span {...linkWrapperProps}>
        {button}
      </span>
    </span>
  </FormItem>);
}

export function getFormGroup(options) {
  let customLabel = getCustomFormLabel.bind(this);
  let { formElement, i, groupElements, } = options;
  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <Group {...formElement.passProps}
    >
      {groupElements}
    </Group>
  </FormItem>);
}

export function getFormCode(options) {
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let initialVal = getInitialValue(formElement, this.state);
  let customLabel = getCustomFormLabel.bind(this);
  let CodeMirrorProps = Object.assign({
    codeMirrorProps: Object.assign({
      lineNumbers: true,
      value: (formElement.stringify) ? JSON.stringify(initialVal, null, 2) : initialVal, //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
      //value: this.state[ formElement.name ] || formElement.value,
      style: {
        minHeight: 200,
      },
      lineWrapping: true,
      onChange: (!onValueChange) ? function (newvalue) {
        // console.log({ newvalue });
        newvalue = (formElement.stringify) ? JSON.parse(newvalue) : newvalue;
        let updatedStateProp = {};
        updatedStateProp[ formElement.name ] = newvalue;
        if (formElement.onChangeFilter) {
          const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
          updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
        }
        this.setState(updatedStateProp);
      }.bind(this) : onValueChange,
    }, formElement.codeMirrorProps),
    wrapperProps: Object.assign({
      style: {
        overflow: 'auto',
        backgroundColor: 'white',
        border: (hasError) ? '1px solid #ed6c63' : '1px solid #d3d6db',
        borderRadius: 3,
        height: 'auto',
        boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
      },
    }, formElement.codeMirrorWrapperProps),
  }, formElement.passProps);

  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <RACodeMirror key={i} {...CodeMirrorProps} />
    {getCustomErrorLabel(hasError, this.state, formElement)}
  </FormItem>
  );
}

export function getFormDatePicker(options) {
  let customLabel = getCustomFormLabel.bind(this);
  let { formElement, i, onValueChange, } = options;
  let hasError = getErrorStatus(this.state, formElement.name);
  let initialVal = getInitialValue(formElement, this.state);
  let singleCustomOnChange = function ({ date }) {
    this.setState({ [ formElement.name ]: (date) ? date.toISOString() : null }, () => {
      if (formElement.validateOnChange) {
        this.validateFormElement({ formElement, })
      } else if (formElement.valueCheckOnChange) {
        this.valueCheckFormElement({ formElement })
      }
    });
  };
  let rangeCustomOnChange = function ({ startDate, endDate }) {
    let combined_date = `${startDate.toISOString()};${endDate.toISOString()}`
    this.setState({ [ formElement.name ]: combined_date }, () => {
      if (formElement.validateOnChange) {
        this.validateFormElement({ formElement, })
      } else if (formElement.valueCheckOnChange) {
        this.valueCheckFormElement({ formElement })
      }
    })
  };
  let SingleDatePickerProps = Object.assign({}, {
    customOnChange: singleCustomOnChange.bind(this),
    initialDate: (initialVal) ? new moment(initialVal) : null
  }, formElement.passProps);
  let RangeDatePickerProps = Object.assign({}, {
    customOnChange: rangeCustomOnChange.bind(this),
    initialDate: (initialVal) ? new moment(initialVal) : null
  }, formElement.passProps);
  if (formElement.type === 'singleDatePicker') {
    return (<FormItem key={i} {...formElement.layoutProps} >
      {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
      <SingleDatePickerWrapper key={i} {...SingleDatePickerProps} />
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </FormItem>
    );
  } else if (formElement.type === 'rangeDatePicker') {
    return (<FormItem key={i} {...formElement.layoutProps} >
      {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
      <DateRangePickerWrapper key={i} {...RangeDatePickerProps} />
      {getCustomErrorLabel(hasError, this.state, formElement)}
    </FormItem>
    );
  }
}

export function getFormEditor(options) {
  let { formElement, i, onValueChange, } = options;
  let initialVal = getInitialValue(formElement, this.state);
  let customLabel = getCustomFormLabel.bind(this);
  if (!onValueChange) {
    onValueChange = (newvalue) => {
      // console.debug({ newvalue, });
      let updatedStateProp = {};
      updatedStateProp[ formElement.name ] = newvalue.target.value;
      if (formElement.onChangeFilter) {
        const onChangeFunc = getFunctionFromProps.call(this, { propFunc: formElement.onChangeFilter });
        updatedStateProp = onChangeFunc.call(this, Object.assign({}, this.state, updatedStateProp), updatedStateProp);
      }
      this.setState(updatedStateProp);
    };
  }
  // console.debug({ initialVal });
  let EditorProps = Object.assign({}, this.props, {
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
    onChange: onValueChange,
  }, formElement.passProps);

  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <PreviewEditor key={i} {...EditorProps} value={initialVal} />
  </FormItem>
  );
}

function getConfirmModal(options) {
  let { formElement, } = options;
  let confirmModal;
  let modalContent = formElement.confirmModal.textContent || [];
  let onSubmit;
  if (formElement.confirmModal.type === 'comment') {
    let name = formElement.confirmModal.name || 'comment';
    onSubmit = (e) => {
      if (this.props.formgroups[ this.props.formgroups.length - 1 ] && this.props.formgroups[ this.props.formgroups.length - 1 ].formElements) {
        this.props.formgroups[ this.props.formgroups.length - 1 ].formElements.push({ name, });
        this.props.hideModal('last');
        this.submitForm.call(this);
        this.props.formgroups[ this.props.formgroups.length - 1 ].formElements = this.props.formgroups[ this.props.formgroups.length - 1 ].formElements.filter(formElement => formElement.name !== name);
      } else {
        this.submitForm.call(this);
      }
    };
    let comment_box = Object.assign({}, {
      component: 'Input',
      type: 'commentbox',
      props: {
        onChange: (e) => this.setState({ [ name ]: e.target.value }),
      },
    }, formElement.confirmModal.comment);
    if (modalContent && modalContent[ modalContent.length - 1 ] && modalContent[ modalContent.length - 1 ].type === 'commentbox') {
      modalContent.pop();
      modalContent.push(comment_box);
    } else {
      modalContent.push(comment_box);
    }
  } else {
    onSubmit = () => {
      this.props.hideModal('last');
      this.submitForm.call(this);
    };
  }
  confirmModal = Object.assign({
    title: 'Please Confirm',
    text: {
      component: 'div',
      props: Object.assign({
        style: {
          textAlign: 'center',
        },
        className: '__ra_rf_fe_s_cm',
      }, formElement.confirmModal.contentWrapperProps),
      children: [
        {
          component: 'div',
          props: {
            className: '__ra_rf_fe_s_cm_t',
          },
          children: modalContent || '',
        },
        {
          component: 'div',
          props: Object.assign({
            className: '__ra_rf_fe_s_cm_bc',
          }, formElement.confirmModal.buttonWrapperProps),
          children: [
            {
              component: 'ResponsiveButton',
              props: Object.assign({
                style: {
                  margin: 10,
                },
                buttonProps: {
                  size: 'isMedium',

                  color: 'isPrimary',
                },
                onClick: onSubmit,
                onclickProps: 'last',
              }, formElement.confirmModal.yesButtonProps),
              children: formElement.confirmModal.yesButtonText || 'Yes',
            },
            {
              component: 'ResponsiveButton',
              props: Object.assign({
                style: {
                  margin: 10,
                },
                buttonProps: {
                  size: 'isMedium',
                },
                onClick: 'func:this.props.hideModal',
                onclickProps: 'last',
              }, formElement.confirmModal.noButtonProps),
              children: formElement.confirmModal.noButtonText || 'No',
            },
          ],
        },
      ],
    },
  }, formElement.confirmModal);
  this.props.createModal(confirmModal);
}

export function getFormSubmit(options) {
  let { formElement, i, } = options;
  let customLabel = getCustomFormLabel.bind(this);
  let passableProps = Object.assign({
    state: (formElement.confirmModal && Object.keys(this.state.formDataErrors).length > 0)
      ? 'isDisabled'
      : undefined,
  }, (this.props.useLoadingButtons && this.state.__formIsSubmitting)
      ? {
        state: 'isLoading'
      }
      : {},
    formElement.passProps);
  return (<FormItem key={i} {...formElement.layoutProps} >
    {formElement.customLabel ? customLabel(formElement) : getFormLabel(formElement)}
    <Button {...passableProps}
      onClick={() => {
        let validated_formdata = validateForm.call(this, { formdata: this.state, validationErrors: {} });
        let updateStateData = {
          formDataErrors: validated_formdata.validationErrors,
        };
        if (this.props.sendSubmitButtonVal) {
          updateStateData[ 'submitButtonVal' ] = formElement.value;
        }
        this.setState(updateStateData, () => {
          (formElement.confirmModal && Object.keys(this.state.formDataErrors).length < 1) ? getConfirmModal.call(this, { formElement }) : this.submitForm.call(this);
        });
      }}>
      {formElement.value}
    </Button>
  </FormItem>);
}


export function getCardFooterItem(options) {
  let { formElement, i, } = options;
  formElement.layoutProps = Object.assign({
    style: { cursor: 'pointer', textAlign: 'center', },
  }, formElement.layoutProps);
  return (<CardFooterItem key={i} {...formElement.layoutProps} onClick={this.submitForm.bind(this)}>
    <Label {...formElement.passProps}>
      {formElement.value}
    </Label>
  </CardFooterItem>);
}
