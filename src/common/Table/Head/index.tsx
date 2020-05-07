import React, { PureComponent } from 'react';

import { TableHead, TableHeadProps } from '@material-ui/core';

class TableHeadComponent extends PureComponent<TableHeadProps> {
  public render() {
    return (
      <TableHead
        {...this.props}
      />
    );
  }
}

export { TableHeadComponent as TableHead };
