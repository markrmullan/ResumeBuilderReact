import React, { PureComponent } from 'react';

import { Tabs, TabsProps } from '@material-ui/core';

class TabsComponent extends PureComponent<TabsProps> {
  public render() {
    return (
      <Tabs
        {...this.props}
      />
    );
  }
}

export { TabsComponent as Tabs };
