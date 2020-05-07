import React, { PureComponent } from 'react';

import { TableCell, TableCellProps } from '@material-ui/core';

class TableCellComponent extends PureComponent<TableCellProps> {
  public render() {
    return (
      <TableCell
        {...this.props}
      />
    );
  }
}

export { TableCellComponent as TableCell };
