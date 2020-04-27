import React, { PureComponent } from 'react';

import { Tooltip, TooltipProps } from '@material-ui/core';

class TooltipComponent extends PureComponent<TooltipProps> {
  public render() {
    return (
      <Tooltip
        arrow
        placement="top"
        {...this.props}
      />
    );
  }
}

export { TooltipComponent as Tooltip };
