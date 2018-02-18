import React, { Component, PropTypes } from 'react';
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
import { Accordion } from 'semantic-ui-react';

const propTypes = {
  headerColor: PropTypes.object,
  headerTextColor: PropTypes.object,
  cardTitle: PropTypes.any,
  display: PropTypes.bool,
  leftIcon: PropTypes.bool,
  icon: PropTypes.string,
};

const defaultProps = {
  // headerColor: styles.isSecondaryBackground,
  // headerTextColor: styles.isWhite,
  cardStyle: {
    marginBottom: '20px',
  },
  cardTitle: '',
  display: true,
  icon: 'fa fa-angle-down',
  iconDown: 'fa fa-angle-down',
  iconUp: 'fa fa-angle-right',
};

class ResponsiveNavBAr extends Component {
  constructor(props) {
    super(props);
    // console.debug('this.props.getState()',this.props.getState());
    let rows = props.rows || [];
    rows = (rows.documents) ? rows.documents : rows;
    if (props.flattenRowData) {
      rows = rows.map(row => Object.assign({}, row, flatten(row, props.flattenRowDataOptions)));
    }
    this.state = {
      rows: rows,
      activeIndex: 0,
    };
    this.getRenderedComponent = getRenderedComponent.bind(this);
    // this.addFilterRow = this.addFilterByAddRow.bind(this);
    // this.updateNewFilterRowText = this.updateNewFilterRowDataText.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    let rows = nextProps.rows || [];
    if (nextProps.flattenRowData) {
      rows = (rows||[]).map(row => Object.assign({}, row, flatten(row, nextProps.flattenRowDataOptions)));
    }
    // console.debug('nextProps.limit', nextProps.limit);
    // console.debug('this.state.limit', this.state.limit);

    this.setState({
      rows: rows,
    });
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
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
              <Link to={`/decision/strategies/` + row._id + '/detail'} style={{color:`${(row._id === this.props.formdata._id) ? 'red' : 'blue'}`}}>{row.title}</Link>
            </div>
        )
      })
    const {activeIndex} = this.state;
    return (
      <Accordion  vertical styled>
          <Accordion.Title  active={activeIndex === 0} index={0} onClick={this.handleClick} content="Menu" ></Accordion.Title>
          <Accordion.Content active={activeIndex === 0} content={links}></Accordion.Content>
          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick} content="Menu"></Accordion.Title>
          <Accordion.Content active={activeIndex === 1} index={1} content={links}></Accordion.Content>
      </Accordion>
    );
  }
}
//tble

ResponsiveNavBAr.propType = propTypes;
ResponsiveNavBAr.defaultProps = defaultProps;

export default ResponsiveNavBAr;