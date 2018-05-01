import React from 'react';

// Import React Table
import ReactTable from 'react-table';
import { observer } from 'mobx-react';

import databaseStore from './store';


@observer
class Table2 extends React.Component {
    onPageChange = (e1, e2, e3) => {
      console.log(e1, e2, e3, 'onPageChange');
    }
  onPageSizeChange = (e1, e2, e3) => {
    console.log(e1, e2, e3, 'onPageSizeChange');
  }
  onSortedChange = (e1, e2, e3) => {
    console.log(e1, e2, e3, 'onSortedChange');
  }
  onFilteredChange= (e1, e2, e3) => {
    console.log(e1, e2, e3, 'onFilteredChange');
  }
  onResizedChange = (e1, e2, e3) => {
    console.log(e1, e2, e3, 'onResizedChange');
  }
  onExpandedChange = (e1, e2, e3) => {
    console.log(e1, e2, e3, 'onExpandedChange');
  }
  render() {
    const data = [...databaseStore.activeResult].map(obj => JSON.parse(JSON.stringify(obj)));
    if (data.length === 0 || !Array.isArray(data)) {
      return <span />;
    }
    const columns = Object.keys(data[0]).map(key => ({ Header: key, accessor: key }));
    const processedData = data.map(row => {
      const output = {};
      Object.keys(data[0]).forEach(columnName => {
        const cell = row[columnName];
        output[columnName] = typeof cell === 'string' ? cell : JSON.stringify(cell);
      });
      return output;
    });
    return (
      <div style={{ width: '100%', backgroundColor: '#e0e0e0', color: 'black' }}>
        <ReactTable
          data={processedData}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
          onPageChange={this.onPageChange}
          onPageSizeChange={this.onPageSizeChange}
          onSortedChange={this.onSortedChange}
          onFilteredChange={this.onFilteredChange}
          onResizedChange={this.onResizedChange}
          onExpandedChange={this.onExpandedChange}
        />
      </div>
    );
  }
}


export default Table2;
