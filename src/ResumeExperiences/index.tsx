import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Button, Grid } from '@material-ui/core';
import MaterialIcon from '@material/react-material-icon';

import { Experience } from 'utils/models';

type TOwnProps = {
  createWorkExperience: () => void;
  experiences: Experience[];
  resumeId: Uuid;
};

type TComponentProps = TOwnProps & WithNamespaces;

class ResumeExperiencesComponent extends PureComponent<TComponentProps> {
  public render() {
    const { createWorkExperience, experiences = [], t } = this.props;

    return (
      <Grid container item xs={12}>
        {experiences.map(exp => (
          <Grid item xs={12}>
            <div key={exp.uuid}>{exp.uuid}</div>
          </Grid>
        ))}
        <Button
          color="primary"
          startIcon={<MaterialIcon icon="add" />}
          onClick={() => createWorkExperience()}
          >
            {t('add_work_experience')}
          </Button>
      </Grid>
    );
  }
}

export const ResumeExperiences = withNamespaces()(ResumeExperiencesComponent);
