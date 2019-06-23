import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { WithNamespaces, withNamespaces } from 'react-i18next';

type RouteProps = {
  rId: Uuid;
};

type TComponentProps = RouteComponentProps<RouteProps> & WithNamespaces;

class EditResumeComponent extends PureComponent<TComponentProps> {
  public render() {
    const { match } = this.props;

    return (
      <div>
        {match.params.rId}
      </div>
    );
  }
}

export const EditResume = withNamespaces()(EditResumeComponent);
