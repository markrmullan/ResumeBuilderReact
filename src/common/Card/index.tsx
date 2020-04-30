import React, { PureComponent } from 'react';

import { Card, CardProps } from '@material-ui/core';

class CardComponent extends PureComponent<CardProps> {
  public render() {
    return (
      <Card
        {...this.props}
      />
    );
  }
}

export { CardComponent as Card };
