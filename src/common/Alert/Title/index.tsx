import React, { PureComponent } from 'react';

import { AlertTitle, AlertTitleProps } from '@material-ui/lab';

class AlertTitleComponent extends PureComponent<AlertTitleProps> {
  public render() {
    return (
      <AlertTitle
        {...this.props}
      />
    );
  }
}

export { AlertTitleComponent as AlertTitle };
