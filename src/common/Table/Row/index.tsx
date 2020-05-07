import React, { PureComponent } from 'react';

import { TableRow, TableRowProps } from '@material-ui/core';

class TableRowComponent extends PureComponent<TableRowProps> {
  public render() {
    return (
      <TableRow
        {...this.props}
      />
    );
  }
}

export { TableRowComponent as TableRow };
