import React, { Component, PropTypes, } from 'react';
import { getRenderedComponent, } from '../AppLayoutMap';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from '@digifi/react-sortable-hoc';
import { Table, List, Column, defaultTableRowRenderer } from 'react-virtualized';
import type {RowRendererParams} from 'react-virtualized';

export default function defaultRowRenderer({
    headers,
    columns,
  className,
  indexCopy,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  rowData,
  style,
}: RowRendererParams) {
  const a11yProps = {};

  if (
    onRowClick ||
    onRowDoubleClick ||
    onRowMouseOut ||
    onRowMouseOver ||
    onRowRightClick
  ) {
    a11yProps['aria-label'] = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = event => onRowClick({event, indexCopy, rowData});
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = event =>
        onRowDoubleClick({event, indexCopy, rowData});
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = event => onRowMouseOut({event, indexCopy, rowData});
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = event => onRowMouseOver({event, indexCopy, rowData});
    }
    if (onRowRightClick) {
      a11yProps.onContextMenu = event =>
        onRowRightClick({event, indexCopy, rowData});
    }
  }
let columnData = columns.map((column, colIdx) => {
      return (
          <div {...column.props} key={`Row${indexCopy}-Col${colIdx}`}
            {...headers[colIdx].columnProps}></div>
      )
  })
  
  return (
    <div
      {...a11yProps}
      {...headers[indexCopy].columnProps}
      className={className}
      key={indexCopy}
      role="row"
      style={style}
      >
      {columnData}
    </div>
  );
}