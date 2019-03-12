import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Experience } from 'utils/models';
import { get } from 'utils/api';

type ResumeBuilderState = {
  experiences: Experience[];
};

class ResumeBuilderComponent extends PureComponent<WithNamespaces, ResumeBuilderState> {
  public state = {
    experiences: []
  };

  public render() {
    return (
      <div>
        {/* {this.state.experiences.map((exp, i) => {
          return (
            <div key={i}>
              <div>{exp.position}</div>
              <div>{exp.company}</div>
            </div>
          )
        })} */}
      </div>
    )
  }

  public componentDidMount() {
    this.hydrateUser();
  }

  private hydrateUser = async () => {
    try {
      const [experiences]: [Experience[]] = await Promise.all([
        get({ baseResource: 'experiences' })]) as [Experience[]
      ];

      this.setState({ experiences });
    } catch {
      this.setState({ experiences: [] });
    }
  }
}

export const ResumeBuilder = withNamespaces()(ResumeBuilderComponent);
