import React, { PureComponent } from 'react';

import { Paper, PaperProps } from '@material-ui/core';

class PaperComponent extends PureComponent<PaperProps> {
  public render() {
    return (
      <Paper
        elevation={0}
        square
        {...this.props}
      />
    );
  }
}

export { PaperComponent as Paper };
