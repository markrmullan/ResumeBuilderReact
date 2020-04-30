import React, { PureComponent } from 'react';

import { Alert, AlertProps } from '@material-ui/lab';

class AlertComponent extends PureComponent<AlertProps> {
  public render() {
    return (
      <Alert
        variant="filled"
        severity="info"
        {...this.props}
      />
    );
  }
}

export { AlertComponent as Alert };
