// import React, {Component} from 'react';
// import {render} from 'react-dom';
// import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
// import {Table, List, Column, defaultTableRowRenderer} from 'react-virtualized';
// import 'react-virtualized/styles.css';

// const SortableItem = SortableElement(({value, height}) => {
//   return (
//     <tr className='shiba'>
//       <td>
//         {value}
//       </td>
//       <td>
//         {height}
//       </td>
//     </tr>
//   );
// });

// class VirtualTable extends Component {
//   render() {
//     const { items } = this.props;
//     const SortableTableRowRenderer = SortableElement(defaultTableRowRenderer)
//     return (
//       <Table
//         ref={(instance) => {
//           this.List = instance;
//         }}
//         headerHeight={200}
//         rowHeight={200}
//         width={150}
//         height={300}
//         rowCount={items.length}
//         rowGetter={({ index }) => items[ index ]}
//         rowHeight={({ index }) => items[ index ].height}
//         rowRenderer={({ index }) => {
//           let item = items[ index ];
//           // const sortableItemProps = Object.keys(item).map(prop => { })
//           const { value, height } = item;
//           return <SortableItem index={index} value={value} height={height}/>;
//         }}
//       >
//         <Column 
//           dataKey='value'
//           label='Col1'
//           width={75}
//         />
//         <Column 
//           dataKey='height'
//           label='Col2'
//           width={75}
//         />
//       </Table>
//     );
//   }
// }

// /*
//  * Important note:
//  * To access the ref of a component that has been wrapped with the SortableContainer HOC,
//  * you *must* pass in {withRef: true} as the second param. Refs are opt-in.
//  */
// const SortableList = SortableContainer(VirtualTable, {withRef: true});

// class DNDTable extends Component {
//   state = {
//     items: [
//       {value: 'Item 1', height: 89},
//       {value: 'Item 2', height: 59},
//       {value: 'Item 3', height: 130},
//       {value: 'Item 4', height: 59},
//       {value: 'Item 5', height: 200},
//       {value: 'Item 6', height: 150},
//     ],
//   };
//   onSortEnd = ({oldIndex, newIndex}) => {
//     if (oldIndex !== newIndex) {
//       const {items} = this.state;

//       this.setState({
//         items: arrayMove(items, oldIndex, newIndex),
//       });

//       // We need to inform React Virtualized that the items have changed heights
//       const instance = this.SortableList.getWrappedInstance();

//       instance.List.recomputeRowHeights();
//       instance.forceUpdate();
//     }
//   };
//   render() {
//     const {items} = this.state;

//     return (
//       <SortableList 
//         ref={(instance) => {
//           this.SortableList = instance;
//         }}
//         items={items}
//         onSortEnd={this.onSortEnd}
//       />
//     );
//   }
// }


// export default DNDTable;





















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

/*
 * Important note:
 * To access the ref of a component that has been wrapped with the SortableContainer HOC,
 * you *must* pass in {withRef: true} as the second param. Refs are opt-in.
 */

function getItems(count, height) {
  var heights = [65, 110, 140, 65, 90, 65];
  return range(count).map(value => {
    return {
      value,
      height: height || heights[random(0, heights.length - 1)],
    };
  });
}

class ListWrapper extends Component {
  constructor({items}) {
    super();
    this.state = {
      items,
      isSorting: false,
    };
  }
  static propTypes = {
    items: PropTypes.array,
    className: PropTypes.string,
    itemClass: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    onSortStart: PropTypes.func,
    onSortEnd: PropTypes.func,
    component: PropTypes.func,
    shouldUseDragHandle: PropTypes.bool,
    headers: PropTypes.array,
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
    const {items} = this.state;

    this.setState({items: arrayMove(items, oldIndex, newIndex), isSorting: false});

    if (onSortEnd) {
      onSortEnd(this.refs.component);
    }
  };
  render() {
    const Component = this.props.component;
    const {items, isSorting} = this.state;
    const props = {
      isSorting,
      items,
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
    items: PropTypes.array,
    className: PropTypes.string,
    helperClass: PropTypes.string,
    itemClass: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    itemHeight: PropTypes.number,
    onSortEnd: PropTypes.func,
    headers: PropTypes.array,
  };
  render() {
    const {
      className,
      height,
      helperClass,
      itemClass,
      itemHeight,
      items,
      onSortEnd,
      width,
    } = this.props;
    console.log('props: ', this.props);
    let headers  = [{ label: "Index", sortid: "value"}, { label: "Height", sortid: "height"}]
    const SortableTable = SortableContainer(Table, { withRef: true });
    const SortableRowRenderer = SortableElement(defaultTableRowRenderer);
    let tableheaders = headers.map((header, idx) => (<Column label={header.label} key={idx} dataKey={header.sortid} width={100} />))
    // let tableheaders = [<Column label={headers[0].label} key={1} dataKey={headers[0].sortid} width={100} />]
    console.log({ tableheaders });
    return (
      <SortableTable
        getContainer={wrappedInstance => ReactDOM.findDOMNode(wrappedInstance.Grid)}
        gridClassName={className}
        headerHeight={itemHeight}
        height={height}
        helperClass={helperClass}
        onSortEnd={onSortEnd}
        rowClassName={itemClass}
        rowCount={items.length}
        rowGetter={({index}) => items[index]}
        rowHeight={itemHeight}
        rowRenderer={props => <SortableRowRenderer {...props} />}
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
    console.log({ props });
  }
  render() {
    return (
      <div className={'root'}>
        <ListWrapper
          component={TableWrapper}
          items={getItems(500)}
          itemHeight={50}
          helperClass={'helper'}
          headers={[]}
        />
      </div>
    );
  }
}


export default DNDTable;