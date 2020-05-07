import React, { PureComponent } from 'react';

import { TableContainer, TableContainerProps } from '@material-ui/core';

class TableContainerComponent extends PureComponent<TableContainerProps> {
  public render() {
    return (
      <TableContainer
        {...this.props}
      />
    );
  }
}

export { TableContainerComponent as TableContainer };
