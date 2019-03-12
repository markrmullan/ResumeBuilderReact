import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { get } from 'utils/api';
import { CV } from 'utils/models';

import { CVListItem } from 'CVsComponent/CVListItem/component';

type CVsComponentState = {
  cvs: CV[];
  pending: boolean;
}

class CVsComponent extends PureComponent<WithNamespaces, CVsComponentState> {
  public state = {
    cvs: [],
    pending: true
  }

  public render() {
    const { cvs } = this.state;

    return (
      <div>
        <CVListItem
          cvs={cvs}
        />
      </div>
    )
  }

  public componentDidMount() {
    this.fetchCVs();
  }

  private fetchCVs = async (): Promise<void> => {
    try {
      const cvs = await get({ baseResource: 'cvs' });

      this.setState({
        cvs: cvs.data,
        pending: false
      });
    } catch {
      this.setState({
        cvs: [],
        pending: false
      });
    }
  }
}

export const CVs = withNamespaces()(CVsComponent);
