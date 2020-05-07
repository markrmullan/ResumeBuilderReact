import React, { PureComponent } from 'react';

import { Table, TableProps } from '@material-ui/core';

class TableComponent extends PureComponent<TableProps> {
  public render() {
    return (
      <Table
        {...this.props}
      />
    );
  }
}

export { TableComponent as Table };
