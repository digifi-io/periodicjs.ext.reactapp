import React, { Component, /*PropTypes,*/ } from 'react';
import { Link, } from 'react-router';
import * as rb from 're-bulma';
import moment from 'moment';
import numeral from 'numeral';
import utilities from '../../util';
import qs from 'querystring';
import debounce from 'debounce';
import { flatten, } from 'flat';
import { getRenderedComponent, } from '../AppLayoutMap';
import FileReaderInput from 'react-file-reader-input';
import path from 'path';
import { csv2json, json2csv, } from 'json-2-csv';
import RACodeMirror from '../RACodeMirror';
import ResponsiveDatalist from '../ResponsiveDatalist';
import { filterQuerySelectOptions, propTypes, defaultProps, getOptionsHeaders, getHeadersFromRows, excludeEmptyHeaders, getFilterOptions, defaultNewRowData, filterQuerySelectOptionsMap, getFilterSortableOption, } from './TableHelpers';
import { Accordion, Menu } from 'semantic-ui-react';
const filterLabelStyleProps = {
  alignItems: 'center',
  display: 'flex',
  flex: 1,
  height: '100%',
};

class ResponsiveNavBAr extends Component {
  constructor(props) {
    super(props);
    // console.debug('this.props.getState()',this.props.getState());
    let rows = props.rows || [];
    rows = (rows.documents) ? rows.documents : rows;
    let headers = ((!props.headers || !props.headers.length) && rows[0]) ?
      getHeadersFromRows({
        rows: props.rows,
        sortable: props.sortable,
        excludeEmptyHeaders: props.excludeEmptyHeaders,
      }) :
      props.headers;
    headers = getOptionsHeaders(props, headers);
    headers = excludeEmptyHeaders({
      headers,
      excludeEmptyHeaders: props.excludeEmptyHeaders,
    });
    if (props.flattenRowData) {
      rows = rows.map(row => Object.assign({}, row, flatten(row, props.flattenRowDataOptions)));
    }
    this.filterSelectOptions = getFilterOptions({ rows, headers, filters: this.props.filterSelectOptions, simpleSearchFilter: this.props.simpleSearchFilter, });
    this.sortableSelctOptions = getFilterSortableOption({ headers, });

    this.state = {
      headers: headers,
      rows: rows,
      activeIndex: 0,
      hasPagination: props.hasPagination,
      simplePagination: props.simplePagination,
      hasHeader: props.hasHeader,
      hasFooter: props.hasFooter,
      limit: props.limit,
      currentPage: props.currentPage,
      numItems: props.numItems || rows.length,
      numPages: Math.ceil(props.numItems / props.limit),
      numButtons: props.numButtons,
      isLoading: false,
      sortProp: this.props.searchField || '_id',
      sortOrder: 'desc',
      filterRowData: [],
      filterRowNewData: defaultNewRowData,
      newRowData: {},
      selectedRowData: {},
      selectedRowIndex: {},
      showFilterSearch: props.showFilterSearch,
      disableSort: props.disableSort,
      
      // usingFiltersInSearch: props.usingFiltersInSearch,
    };
    this.searchFunction = debounce(this.updateTableData, 200);
    this.getRenderedComponent = getRenderedComponent.bind(this);
    this.addRow = this.updateByAddRow.bind(this);
    this.replaceRows = this.updateByReplacingRows.bind(this);
    this.addingRows = this.updateByAddingRows.bind(this);
    this.selectRow = this.updateSelectedRow.bind(this);
    this.deleteRow = this.updateByDeleteRow.bind(this);
    this.moveRowDown = this.updateByMoveRowDown.bind(this);
    this.moveRowUp = this.updateByMoveRowUp.bind(this);
    this.updateNewRowText = this.updateNewRowDataText.bind(this);
    this.updateInlineRowText = this.updateInlineRowDataText.bind(this);
    this.removeFilterRow = this.removeFilterByDeleteRow.bind(this);
    this.addFilterRow = this.addFilterByAddRow.bind(this);
    this.updateNewFilterRowText = this.updateNewFilterRowDataText.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    let rows = nextProps.rows || [];
    let headers = ((!nextProps.headers || !nextProps.headers.length) && rows[0]) ?
      getHeadersFromRows({
        rows,
        sortable: nextProps.sortable,
        excludeEmptyHeaders: nextProps.excludeEmptyHeaders,
      }) :
      nextProps.headers;
    headers = getOptionsHeaders(nextProps);
    headers = excludeEmptyHeaders({
      headers,
      excludeEmptyHeaders: nextProps.excludeEmptyHeaders,
    });
    if (nextProps.flattenRowData) {
      rows = (rows||[]).map(row => Object.assign({}, row, flatten(row, nextProps.flattenRowDataOptions)));
    }
    // console.debug('nextProps.limit', nextProps.limit);
    // console.debug('this.state.limit', this.state.limit);

    this.setState({
      headers: headers,
      rows: rows,
      hasPagination: nextProps.hasPagination,
      hasHeader: nextProps.hasHeader,
      hasFooter: nextProps.hasFooter,
      limit: nextProps.limit,
      currentPage: nextProps.currentPage,
      numItems: nextProps.numItems,
      numPages: Math.ceil(nextProps.numItems / nextProps.limit),
      numButtons: nextProps.numButtons,
    });
  }
  updateSelectedRow(options) {
    // console.debug({ options });
    this.updateTableData(options);
  }
  updateByReplacingRows(newrows) {
    this.updateTableData({ rows: newrows.concat([]), clearNewRowData: true, });
  }
  updateByAddingRows(newrows) {
    let rows = this.state.rows.concat(newrows || []);
    this.updateTableData({ rows, clearNewRowData: true, });
  }
  updateByAddRow() {
    let rows = this.state.rows.concat([]);
    let newRow = Object.assign({}, this.state.newRowData);
    rows.splice(rows.length, 0, newRow);
    // console.debug({ rowIndex, rows, deletedRow }, this.state.rows);
    // this.props.onChange({ rows, });
    this.updateTableData({ rows, clearNewRowData: true, });
  }
  updateByDeleteRow(rowIndex) {
    let rows = this.state.rows.concat([]);
    rows.splice(rowIndex, 1);
    // console.debug({ rowIndex, rows }, this.state.rows);
    // this.props.onChange({ rows, });
    this.updateTableData({ rows, });
  }
  updateByMoveRowUp(rowIndex) {
    let rows = this.state.rows.concat([]);
    let deletedRow = rows.splice(rowIndex, 1)[0];
    rows.splice(rowIndex - 1, 0, deletedRow);
    // console.debug({ rowIndex, rows, deletedRow }, this.state.rows);
    // this.props.onChange({ rows, });
    this.updateTableData({ rows, });
  }
  updateByMoveRowDown(rowIndex) {
    let rows = this.state.rows.concat([]);
    let deletedRow = rows.splice(rowIndex, 1)[0];
    rows.splice(rowIndex + 1, 0, deletedRow);
    // console.debug({ rowIndex, rows, deletedRow }, this.state.rows);
    // this.props.onChange({ rows, });
    this.updateTableData({ rows, });
  }
  updateNewRowDataText(options) {
    let { name, text, } = options;
    let updatedStateProp = {
      newRowData: Object.assign({},
        this.state.newRowData, {
          [name]: text,
        }),
    };
    this.props.headers.forEach(header => {
      if (header.sortid !== name && header.formtype && header.defaultValue && !updatedStateProp.newRowData[header.sortid]) {
        updatedStateProp.newRowData[header.sortid] = header.defaultValue;
      }
    });
    // console.debug({ updatedStateProp, options });
    this.setState(updatedStateProp);
  }
  updateInlineRowDataText(options) {
    let { name, text, rowIndex, } = options;
    let rows = this.state.rows.concat([]);
    rows[rowIndex][name] = text;
    // console.debug({ rowIndex, rows, deletedRow }, this.state.rows);
    // this.props.onChange({ rows, });
    this.updateTableData({ rows, });
  }
  handleFileUpload(type) {
    return (e, results) => {
      let updatefunction = (type === 'replace') ?
        this.replaceRows :
        this.addingRows;
      try {
        console.debug({ e, results, });
        results.forEach(result => {
          const [e, file, ] = result;
          if (path.extname(file.name) === '.csv') {
            csv2json(e.target.result, (err, newRows) => {
              if (err) throw err;
              // console.debug({ newRows, }, 'e.target.result', e.target.result);
              updatefunction(newRows);
            }, {
              options: this.props.csvOptions,
              // keys: this.state.headers.map(header => header.sortid),  
            });
          } else {
            let newRows = JSON.parse(e.target.result);
            updatefunction(newRows);
          }
        });
      } catch (e) {
        this.props.errorNotification(e);
      }
    };
  }
  removeFilterByDeleteRow(rowIndex) {
    let rows = this.state.filterRowData.concat([]);
    rows.splice(rowIndex, 1);
    this.setState({ filterRowData: rows, }, () => {
      this.updateTableData({});
    });
  }
  addFilterByAddRow() {
    let rows = this.state.filterRowData.concat([]);
    let newRow = Object.assign({}, this.state.filterRowNewData);
    rows.splice(rows.length, 0, newRow);
    if (newRow.property === '__property__') {
      this.props.createNotification({ text: 'Please select a property', type: 'error', timed: 5000, });
    } else if (newRow.filter_value === '__filter__') {
      this.props.createNotification({ text: 'Please select a filter', type: 'error', timed: 5000, });
    } else {
      // console.debug('addFilterByAddRow', { rows });
      this.setState({ filterRowData: rows, filterRowNewData: defaultNewRowData, }, () => {
        this.updateTableData({});
      });
    }
  }
  updateNewFilterRowDataText(options) {
    let { name, text, } = options;
    let updatedStateProp = {
      filterRowNewData: Object.assign({},
        this.state.filterRowNewData, {
          [name]: text,
        }),
    };
    // console.debug({ updatedStateProp, options });
    this.setState(updatedStateProp);
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  updateTableData(options) {
      let updatedState = {};
      let newSortOptions = {};
      if (options.clearNewRowData) {
        updatedState.newRowData = {};
      }
      if (typeof options.selectedRowIndex !== undefined) {
        updatedState.selectedRowIndex = options.selectedRowIndex;
      }
      if (typeof options.selectedRowData !== undefined) {
        updatedState.selectedRowData = options.selectedRowData;
      }
      if (!this.props.baseUrl) {
        // console.debug({options})
        updatedState.rows = (typeof options.rows !== 'undefined') ? options.rows : this.props.rows;
        // console.debug({ updatedState, });
        if (options.sort) {
          newSortOptions.sortProp = options.sort;
          if (this.state.sortProp === options.sort) {
            newSortOptions.sortOrder = (this.state.sortOrder !== 'desc') ? 'desc' : 'asc';
          } else {
            newSortOptions.sortOrder = 'desc';
          }
          updatedState.rows = updatedState.rows.sort(utilities.sortObject(newSortOptions.sortOrder, options.sort));
          updatedState.sortOrder = newSortOptions.sortOrder;
          updatedState.sortProp = options.sort;
        } else if (this.props.turnOffTableSort){
        updatedState.rows = updatedState.rows;
      } else if ((this.state.sortOrder || this.state.sortProp) && !this.state.disableSort) {
          newSortOptions.sortProp = this.state.sortProp;
          newSortOptions.sortOrder = (this.state.sortOrder === 'desc' || this.state.sortOrder === '-') ? 'desc' : 'asc';
          updatedState.rows = updatedState.rows.sort(utilities.sortObject(newSortOptions.sortOrder, newSortOptions.sortProp));
        }

        if (this.props.tableSearch && this.state.filterRowData && this.state.filterRowData.length) {
          let filteredRows = [];
          updatedState.rows.forEach(row => {
            this.state.filterRowData.forEach(filter => {
              if (row[filter.property]) {
                switch (filter.filter_value) {
                  case 'like':
                  case 'in':
                    if (row[filter.property].indexOf(filter.value) !== -1) filteredRows.push(row);
                    break;
                  case 'not':
                    if (row[filter.property] !== filter.value) filteredRows.push(row);
                    break;
                  case 'not-like':
                  case 'not-in':
                    if (row[filter.property].indexOf(filter.value) === -1) filteredRows.push(row);
                    break;
                  case 'lt':
                    if (row[filter.property] < filter.value) filteredRows.push(row);
                    break;
                  case 'lte':
                    if (row[filter.property] <= filter.value) filteredRows.push(row);
                    break;
                  case 'gt':
                    if (row[filter.property] > filter.value) filteredRows.push(row);
                    break;
                  case 'gte':
                    if (row[filter.property] >= filter.value) filteredRows.push(row);
                    break;
                  case 'exists':
                    if (typeof row[filter.property] !== 'undefined') filteredRows.push(row);
                    break;
                  case 'size':
                    if (row[filter.property].length > filter.value) filteredRows.push(row);
                    break;
                  case 'is-date':
                    if (moment(row[filter.property]).isSame(filter.value)) filteredRows.push(row);
                    break;
                  case 'lte-date':
                    if (moment(row[filter.property]).isSameOrBefore(filter.value)) filteredRows.push(row);
                    break;
                  case 'lt-date':
                    if (moment(row[filter.property]).isBefore(filter.value)) filteredRows.push(row);
                    break;
                  case 'gte-date':
                    if (moment(row[filter.property]).isSameOrAfter(filter.value)) filteredRows.push(row);
                    break;
                  case 'gt-date':
                    if (moment(row[filter.property]).isAfter(filter.value)) filteredRows.push(row);
                    break;
                  case 'is':
                  default:
                    if (row[filter.property] === filter.value) filteredRows.push(row);
                    break;
                }
              }
            });
            // row[ this.props.searchField ].indexOf(options.search) !== -1
          });
          updatedState.rows = filteredRows;
          // console.debug('updatedState.rows', updatedState.rows, { filteredRows, });
        }
        if (this.props.tableSearch && this.props.searchField && options.search) {
          updatedState.rows = (updatedState.rows||this.props.rows).filter(row => {
            return row[ this.props.searchField ] && row[ this.props.searchField ].indexOf(options.search) !== -1
          });
        }
        updatedState.numPages = Math.ceil(updatedState.rows.length / this.state.limit);
        updatedState.limit = this.state.limit;
        updatedState.currentPage = (typeof options.pagenum !== 'undefined') ?
          options.pagenum :
          (this.state.currentPage && this.state.currentPage <= updatedState.numPages) ?
          this.state.currentPage :
          1;
        updatedState.isLoading = false;

        if (this.props.tableForm) {
          // console.debug('befroe', {updatedState})
          this.props.onChange(updatedState);
        }
        // else {
        this.setState(updatedState);
        // }

      } else {
        if (options.sort) {
          newSortOptions.sortProp = options.sort;
          if (this.state.sortProp === options.sort) {
            newSortOptions.sortOrder = (this.state.sortOrder === '') ? '-' : '';
          } else {
            newSortOptions.sortOrder = '';
          }
        } else if (this.props.turnOffTableSort){
        updatedState.rows = updatedState.rows;
      } else if (this.state.sortOrder || this.state.sortProp) {
          newSortOptions.sortProp = this.state.sortProp;
          newSortOptions.sortOrder = (this.state.sortOrder === 'desc' || this.state.sortOrder === '-') ? '-' : '';
        }
        if (options.pagenum < 1) {
          options.pagenum = 1;
        }
        this.setState({ isLoading: true, });
        let stateProps = this.props.getState();
        let fetchURL = `${stateProps.settings.basename}${this.props.baseUrl}&${qs.stringify({
        limit: this.state.limit || this.props.limit,
        sort: (newSortOptions.sortProp)
          ? `${newSortOptions.sortOrder}${newSortOptions.sortProp}`
          : undefined,
        fq: (this.state.filterRowData && this.state.filterRowData.length)
          ? this.state.filterRowData.map(frd => {
            return `${frd.property}|||${frd.filter_value}|||${frd.value}`;
          })
          : undefined,
        query: options.search,
        allowSpecialCharacters: true,
        pagenum: options.pagenum || 1,
      })}`;
      // console.debug('this.state.filterRowData', this.state.filterRowData, { options, fetchURL, });
      let headers = Object.assign({
        'x-access-token': stateProps.user.jwt_token,
      }, stateProps.settings.userprofile.options.headers);
      utilities.fetchComponent(fetchURL, { headers, })()  
        .then(response => { 
          // let usingResponsePages = false;
          // console.debug('this.props.dataMap',this.props.dataMap)
          // console.log({ response })
          if (response.data && response.result && response.status) {
            // console.log('USE DATA FROM RESPONSE', response.data)
            // console.log('this.props.dataMap',this.props.dataMap)
            response = response.data;
          }
          this.props.dataMap.forEach(data => { 
            if (data.key === 'rows') {
              let rows = response[ data.value ] || [];
              rows = (rows.documents) ? rows.documents : rows;
              // console.log({ rows });
              if (this.props.flattenRowData) {
                updatedState[ data.key ] = rows.map(row => Object.assign({},row,flatten(row, this.props.flattenRowDataOptions)));
              }
            } else {
              // if (data.key === 'numPages') {
              //   usingResponsePages = true;
              // }
              updatedState[ data.key ] = response[ data.value ];
            }
          });
          updatedState.numPages = Math.ceil(updatedState.numItems / this.state.limit);
          updatedState.limit = this.state.limit;
          updatedState.currentPage = (typeof options.pagenum !=='undefined') ? options.pagenum : this.props.currentPage;
          updatedState.isLoading = false;

          if (options.sort) {
            updatedState.sortOrder = newSortOptions.sortOrder;
            updatedState.sortProp = options.sort;
          }
          // console.log({ updatedState });
          if (this.props.tableForm) {
            this.props.onChange(updatedState);
          }
          this.setState(updatedState);
        }, e => {
          this.props.errorNotification(e);
        });
    }
  }
  formatValue(value, row, options, header) {
   
    try {
       // console.debug({ value, row, options, header, });
      // console.debug(options.rowIndex,this.state.selectedRowIndex)
      let returnValue = value;
      if (header && header.stringify) {
        value = JSON.stringify(value, null, 2);
        returnValue = JSON.stringify(value, null, 2);
      }
      if (header && header.tostring) {
        value = value.toString();
        returnValue = value.toString();
      }
      if (header && header.customCellLayout) {
        header.customCellLayout.props = Object.assign({}, header.customCellLayout.props, {cell:value,row});
        return this.getRenderedComponent(header.customCellLayout);
      }
      if (header && header.tagifyArray) {
        return value.map((val, kv) => (
          <rb.Tag {...header.tagProps} key={kv}>{
            (header.tagifyValue) ? val[ header.tagifyValue ].toString() : val.toString()}
          </rb.Tag>))
      }
      else if (header && header.selectedOptionRowHeader) {
        return <input type="radio" checked={(options.rowIndex===this.state.selectedRowIndex)?true:false} />;
      } else if (this.props.useInputRows && header && header.formtype && header.formtype==='code') {
        let CodeMirrorProps = Object.assign({}, {
          codeMirrorProps: {
            lineNumbers: true,
            value: value, //formElement.value || this.state[ formElement.name ] || getPropertyAttribute({ element:formElement, property:this.state, });
            //value: this.state[ formElement.name ] || formElement.value,
            style: {
              minHeight:200,
            },
            lineWrapping:true,
            onChange: function (text){
              // console.log({ newvalue });
              let name = header.sortid;
              let rowIndex = options.rowIndex;
              this.updateInlineRowText({ name, text, rowIndex, });
            }.bind(this),
          },
        }, header.CodeMirrorProps);
        let codeProps = Object.assign({
          wrapperProps: {
            style: {
              overflow: 'auto',
              backgroundColor: 'white',
              border: '1px solid #d3d6db',
              borderRadius: 3,
              height: 'auto',
              boxShadow: 'inset 0 1px 2px rgba(17,17,17,.1)',
            },
          },
        }, header.codeProps);
        return <RACodeMirror
          {...CodeMirrorProps}
          {...codeProps}
        />;
      } else if (this.props.useInputRows && header && header.formtype && header.formtype==='textarea') {
        return <rb.Textarea
          {...header.textareaProps}
          value={value}
          onChange={(event) => {
            let text = event.target.value;
            let name = header.sortid;
            let rowIndex = options.rowIndex;
            this.updateInlineRowText({ name, text, rowIndex, });
          }}
        >{value}</rb.Textarea>;
      } else if (this.props.useInputRows && header && header.formtype && header.formtype==='text') {
        return <rb.Input
          value={value}
          readOnly={header.readOnly? true: false}
          {...header.inputProps}
          onChange={(event) => {
            let text = event.target.value;
            let name = header.sortid;
            let rowIndex = options.rowIndex;
            this.updateInlineRowText({ name, text, rowIndex, });
          }}
        >{value}</rb.Input>;
      } else if (this.props.useInputRows && header && header.formtype && header.formtype === 'select') {
        let selectOptions = header.formoptions || [];
        return <rb.Select
          value={value}
          {...header.selectProps}
          onChange={(event) => {
            let text = event.target.value;
            let name = header.sortid;
            let rowIndex = options.rowIndex;
            this.updateInlineRowText({ name, text, rowIndex, });
          }}>
          {selectOptions.map((opt, k) => {
            return <option key={k} disabled={opt.disabled} value={opt.value}>{opt.label || opt.value}</option>;
          })}
        </rb.Select>
      } else if (this.props.useInputRows && header && header.formtype && header.formtype === 'datalist') {
        let rowdata = Array.isArray(this.props.__tableOptions[ header.sortid ][ options.rowIndex ]) ? this.props.__tableOptions[ header.sortid ][ options.rowIndex ]
          : Array.isArray(this.props.__tableOptions[ header.sortid ]) ? this.props.__tableOptions[ header.sortid ]
            : [];
        return <ResponsiveDatalist
          value={value}
          {...header.datalistProps}
          datalistdata={ rowdata }
          onChange={(event) => {
            let text = event;
            let name = header.sortid;
            let rowIndex = options.rowIndex;
            this.updateInlineRowText({ name, text, rowIndex, });
          }}
        >
        </ResponsiveDatalist>
      } else if (typeof options.idx !=='undefined' && typeof returnValue==='string' && returnValue.indexOf('--idx--')!==-1) {
        returnValue = returnValue.replace('--idx--', options.idx);
      }
      if (typeof options.idx !=='undefined' && typeof returnValue==='string' && returnValue.indexOf('--idx-ctr--')!==-1) {
        returnValue = returnValue.replace('--idx-ctr--', (options.idx+1));
      }
      if (options.momentFromNow) {
        returnValue = moment(value).fromNow();
      } else if (options.momentFormat) {
        returnValue = moment(value).format(options.momentFormat);
      } else if (options.numeralFormat) {
        returnValue = numeral(value).format(options.numeralFormat);
      } else if (header && header.wrapPreOutput) {
        returnValue = <pre {...header.wrapPreOutputProps}>{value}</pre>;
      } else if (options.icon && value) {
          // console.debug({value})
        if (typeof value !== 'string' && Array.isArray(value)) {
          let icons = value.map((val, i) => <rb.Icon key={i+Math.random()} {...options.iconProps} icon={val} />);
          return icons;
        } else {
          return <rb.Icon {...options.iconProps} icon={value} />;
        }
      } else if (options.image && value) {
        if (typeof value !== 'string' && Array.isArray(value)) {
          let images = value.map((val, i) => <rb.Image key={i} {...options.imageProps} src={val} />);
          return { images, };
        } else {
          return <rb.Image {...options.imageProps} src={value} />;
        }
      }
      if (typeof returnValue === 'undefined' || (returnValue === null && this.props.suppressNullValues)) {
        return '';
      // } else if (typeof returnValue !== 'object') {
      //   return JSON.stringify(returnValue);
      } else if (returnValue === null) {
        return 'null';
      } else {
        return returnValue.toString();
      }
    } catch (e) {
      console.log({ value, row, options, header, }, e);
      return 'invalid';
    }
  }
  getHeaderLinkURL(link, row) {
    let returnLink = link.baseUrl;
    if (link.params && link.params.length > 0) {
      link.params.forEach((param) => {
        returnLink = returnLink.replace(param.key, row[ param.val ]);
      });
    }
    return returnLink;
  }
  toggleAdvancedSearchFilters() {
    this.setState({ showFilterSearch: !this.state.showFilterSearch, });
  }
  render() {
    let maxFormRowLength = 0;
    let calcStartIndex = ((this.state.currentPage - 1) * this.state.limit);
    let startIndex = (!this.props.baseUrl)
      ? calcStartIndex
      :0 ;
    let endIndex = (!this.props.baseUrl)
      ? ((this.state.limit * this.state.currentPage))
      : this.state.limit;
    let displayRows = this.state.rows.slice(startIndex, endIndex);
    
    let links = displayRows.map((row, rowIdx) => {
        return (
            <div key={rowIdx}>
              <Link to={`/decision/strategies/` + row._id + '/detail'}>{row.title}</Link>
            </div>
        )
      })
    const {activeIndex} = this.state;
    return (
      <rb.Container {...this.props.containerProps}>
          <Accordion as={"Menu"} vertical styled>
            <Menu.Item>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick} content="Menu" ></Accordion.Title>
              <Accordion.Content active={activeIndex === 0} content={links}></Accordion.Content>
              <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick} content="Menu"></Accordion.Title>
              <Accordion.Content active={activeIndex === 1} index={1} content={links}></Accordion.Content>
            </Menu.Item>
          </Accordion>
      </rb.Container>
    );
  }
}
//tble

ResponsiveNavBAr.propType = propTypes;
ResponsiveNavBAr.defaultProps = defaultProps;

export default ResponsiveNavBAr;