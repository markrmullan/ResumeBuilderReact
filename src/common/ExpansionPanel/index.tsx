import React, { PureComponent } from 'react';

import { ExpansionPanel, ExpansionPanelProps } from '@material-ui/core';

class ExpansionPanelComponent extends PureComponent<ExpansionPanelProps> {
  public render() {
    return (
      <ExpansionPanel
        elevation={0}
        variant="outlined"
        {...this.props}
      />
    );
  }
}

export { ExpansionPanelComponent as ExpansionPanel };
