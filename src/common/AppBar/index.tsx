import React, { PureComponent } from 'react';

import { AppBar, AppBarProps } from '@material-ui/core';

class AppBarComponent extends PureComponent<AppBarProps> {
  public render() {
    return (
      <AppBar
        position="static"
        {...this.props}
      />
    );
  }
}

export { AppBarComponent as AppBar };
