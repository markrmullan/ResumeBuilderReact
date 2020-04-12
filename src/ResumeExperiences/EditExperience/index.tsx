import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Grid, TextField } from '@material-ui/core';

import { Experience } from 'utils/models';

type TOwnProps = {
  experience: Experience;
};

type TComponentProps = TOwnProps & WithNamespaces;

class EditExperienceComponent extends PureComponent<TComponentProps> {
  public render() {
    const { experience = {} as Experience, t } = this.props;
    const { company = '', position = '' } = experience;

    return (
      <Grid container spacing={3}>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              label={t('job_title')}
              fullWidth
              InputLabelProps={{ shrink: !!position.length }}
              name="position"
              value={position}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              label={t('employer')}
              fullWidth
              InputLabelProps={{ shrink: !!company.length }}
              name="company"
              value={company}
            />
          </Grid>
        </Grid>
        
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12} md={3}>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const EditExperience = withNamespaces()(EditExperienceComponent);
