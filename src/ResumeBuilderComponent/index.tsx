import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { get } from 'utils/api';
import { Experience } from 'utils/models';

type ResumeBuilderState = {
  experiences: Experience[];
};

class ResumeBuilderComponent extends PureComponent<WithNamespaces, ResumeBuilderState> {
  public state = {
    experiences: [] as Experience[]
  };

  public render() {
    const { experiences } = this.state;

    return (
      <div>
        {experiences.map((exp, i) => {
          return (
            <div key={i}>
              <div>{exp.position}</div>
              <div>{exp.company}</div>
            </div>
          );
        })}
      </div>
    );
  }

  public componentDidMount() {
    this.hydrateUser();
  }

  private hydrateUser = async () => {
    try {
      const [experiences] = await Promise.all([
        get<Experience[]>({ baseResource: 'experiences' })
      ]);

      this.setState({ experiences });
    } catch {
      this.setState({ experiences: [] });
    }
  }
}

export const ResumeBuilder = withNamespaces()(ResumeBuilderComponent);
