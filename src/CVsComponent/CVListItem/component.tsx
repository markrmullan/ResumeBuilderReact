import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { CV } from 'utils/models';

type CVListItemComponentProps = {
  cvs: CV[];
};

class CVListItemComponent extends PureComponent<CVListItemComponentProps & WithNamespaces> {
  public render() {
    const { cvs } = this.props;

    return (
      cvs.map((cv, i) => {
        return (
          <div key={i}>
            {cv.name}
          </div>
        )
      })
    )
  }
}

export const CVListItem = withNamespaces()(CVListItemComponent);
