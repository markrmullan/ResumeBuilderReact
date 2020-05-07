import React, { PureComponent } from 'react';

import { TableBody, TableBodyProps } from '@material-ui/core';

class TableBodyComponent extends PureComponent<TableBodyProps> {
  public render() {
    return (
      <TableBody
        {...this.props}
      />
    );
  }
}

export { TableBodyComponent as TableBody };
