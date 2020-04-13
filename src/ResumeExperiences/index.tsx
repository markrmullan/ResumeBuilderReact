import React, { ChangeEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Button, Grid } from '@material-ui/core';
import MaterialIcon from '@material/react-material-icon';

import { EditExperience } from 'ResumeExperiences/EditExperience';
import { Experience } from 'utils/models';

type TOwnProps = {
  createWorkExperience: () => void;
  onWorkExperienceChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, experienceId: Uuid) => void;
  onWorkExperienceDateChange: (experienceId: Uuid, key: string, val: Date) => void;
  experiences: Experience[];
  resumeId: Uuid;
};

type TComponentProps = TOwnProps & WithNamespaces;

class ResumeExperiencesComponent extends PureComponent<TComponentProps> {
  public render() {
    const { createWorkExperience, experiences = [], onWorkExperienceChange, onWorkExperienceDateChange, resumeId, t } = this.props;

    return (
      <Grid container item spacing={3}>
        {experiences.map(exp => (
          <EditExperience
            key={exp.uuid}
            experience={exp}
            resumeId={resumeId}
            onWorkExperienceChange={onWorkExperienceChange}
            onWorkExperienceDateChange={onWorkExperienceDateChange}
          />
        ))}
        <Button
          color="primary"
          startIcon={<MaterialIcon icon="add" />}
          onClick={createWorkExperience}
          >
            {t('add_work_experience')}
          </Button>
      </Grid>
    );
  }
}

export const ResumeExperiences = withNamespaces()(ResumeExperiencesComponent);
