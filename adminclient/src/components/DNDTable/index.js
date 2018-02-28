import React, { Component, PropTypes, } from 'react';
import { getRenderedComponent, } from '../AppLayoutMap';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import { Table, List, Column, defaultTableRowRenderer } from 'react-virtualized';
import classNames from 'classnames';
import 'react-virtualized/styles.css';
import range from 'lodash/range';
import random from 'lodash/random';
import ReactDOM from 'react-dom';
import * as rb from 're-bulma';
import moment from 'moment';
import numeral from 'numeral';

/*
 * Important note:
 * To access the ref of a component that has been wrapped with the SortableContainer HOC,
 * you *must* pass in {withRef: true} as the second param. Refs are opt-in.
 */

class ListWrapper extends Component {
  constructor({rows}) {
    super();
    this.state = {
      rows,
      isSorting: false,
    };
  }
  static propTypes = {
    rows: PropTypes.array,
    className: PropTypes.string,
    itemClass: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    onSortStart: PropTypes.func,
    onSortEnd: PropTypes.func,
    component: PropTypes.func,
    shouldUseDragHandle: PropTypes.bool,
    headers: PropTypes.array,
    getRows: PropTypes.func,
  };
  static defaultProps = {
    className: 'list',
    itemClass: 'item',
    width: 400,
    height: 600,
    headers: [],
  };
  onSortStart = () => {
    const {onSortStart} = this.props;
    this.setState({isSorting: true});

    if (onSortStart) {
      onSortStart(this.refs.component);
    }
  };
  onSortEnd = ({oldIndex, newIndex}) => {
    const {onSortEnd} = this.props;
    const {rows} = this.state;
    let newRows = arrayMove(rows, oldIndex, newIndex);
    this.setState(Object.assign({}, { rows: newRows }, { isSorting: false }), () => {
      this.props.getRows(newRows);
    });
    if (onSortEnd) {
      onSortEnd(this.refs.component);
    }
  };
  render() {
    const Component = this.props.component;
    let { rows, isSorting } = this.state;
    const props = {
      isSorting,
      rows,
      onSortEnd: this.onSortEnd,
      onSortStart: this.onSortStart,
      ref: 'component',
      useDragHandle: this.props.shouldUseDragHandle,
    };

    return <Component {...this.props} {...props} />;
  }
}

class TableWrapper extends Component {
  static propTypes = {
    rows: PropTypes.array,
    className: PropTypes.string,
    helperClass: PropTypes.string,
    itemClass: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    itemHeight: PropTypes.number,
    onSortEnd: PropTypes.func,
    headers: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.getRenderedComponent = getRenderedComponent.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
  }

  cellRenderer({ cellData }) {
    if (typeof cellData === 'string') return String(cellData);
    if (Array.isArray(cellData)) {
      return cellData.map(celldata => this.cellRenderer({ cellData: celldata }))
    }
    if (typeof cellData === 'object') return this.getRenderedComponent(cellData);
  }
  
  render() {
    let {
      className,
      height,
      helperClass,
      itemClass,
      itemHeight,
      rows,
      headers,
      onSortEnd,
      width,
    } = this.props;
    
    const SortableTable = SortableContainer(Table, { withRef: true });
    const SortableRowRenderer = SortableElement(defaultTableRowRenderer);
    let tableheaders = headers.map((header, idx) => (<Column cellRenderer={this.cellRenderer} label={header.label} key={idx} dataKey={header.sortid} width={100} />))
    // let tableheaders = [<Column label={headers[0].label} key={1} dataKey={headers[0].sortid} width={100} />]
    return (
      <SortableTable
        getContainer={wrappedInstance => ReactDOM.findDOMNode(wrappedInstance.Grid)}
        gridClassName={className}
        headerHeight={itemHeight}
        height={height}
        helperClass={helperClass}
        onSortEnd={onSortEnd}
        transitionDuration={0}
        // shouldCancelStart={(e) => {
        //   // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
        //   const disabledElements = [ 'input', 'textarea', 'select', 'option', 'button' ];
        //   if (disabledElements.indexOf(e.target.tagName.toLowerCase()) !== -1) {
        //     return true; // Return true to cancel sorting
        //   }
        // }}
        rowClassName={itemClass}
        rowCount={rows.length}
        rowGetter={({index}) => rows[index]}
        rowHeight={itemHeight}
        rowRenderer={props => {
          return <SortableRowRenderer {...props}/>
        }}
        width={width}
      >
      {tableheaders}
      </SortableTable>
    );
  }
}


// <Column label="Index" dataKey="value" width={100} />
        // <Column label="Height" dataKey="height" width={width - 100} />
class DNDTable extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   rows: this.props.rows || []
    // }
  }

  // updateRows() {
  //   this.setState({ rows })
  // }
  
  render() {
    return (
      <div className={'root'}>
        <ListWrapper
          component={TableWrapper}
          rows={this.props.rows}
          getRows={this.props.getRows}
          // updateDNDRows={updateRows}
          itemHeight={50}
          helperClass={'helper'}
          headers={this.props.headers}
          {...this.props}
        />
      </div>
    );
  }
}


export default DNDTable;