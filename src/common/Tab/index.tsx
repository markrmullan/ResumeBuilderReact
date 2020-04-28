import React, { PureComponent } from 'react';

import { Tab, TabProps } from '@material-ui/core';

class TabComponent extends PureComponent<TabProps> {
  public render() {
    return (
      <Tab
        {...this.props}
      />
    );
  }
}

export { TabComponent as Tab };
