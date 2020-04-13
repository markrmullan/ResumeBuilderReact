import React, { ChangeEvent, Fragment, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Grid, TextField } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { Experience } from 'utils/models';
import { patchWorkExperience } from 'utils/requests';

type TOwnProps = {
  experience: Experience;
  onWorkExperienceChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, experienceId: Uuid) => void;
  resumeId: Uuid;
};

type TComponentProps = TOwnProps & WithNamespaces;

class EditExperienceComponent extends PureComponent<TComponentProps> {
  public render() {
    const now = new Date();
    const { experience = {} as Experience, onWorkExperienceChange, t } = this.props;
    const { endDate = now, company = '', position = '', startDate = now } = experience;

    return (
      <Fragment>
        <Grid container item spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              label={t('job_title')}
              fullWidth
              InputLabelProps={{ shrink: !!position.length }}
              name="position"
              value={position}
              onChange={e => onWorkExperienceChange(e, experience.uuid)}
              onBlur={this.patchWorkExperience}
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
              onChange={e => onWorkExperienceChange(e, experience.uuid)}
              onBlur={this.patchWorkExperience}
            />
          </Grid>
        </Grid>

        <Grid container item spacing={3}>
          <Grid item xs={12} md={3}>
            <KeyboardDatePicker
              autoOk
              disableToolbar
              disableFuture
              inputVariant="outlined"
              variant="inline"
              label={t('start_date')}
              format="MM/yyyy"
              openTo="year"
              views={['year', 'month']}
              value={startDate}
              onChange={e => this.setState({ date: e as unknown as Date })}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            {endDate > now ?
              <TextField
                variant="outlined"
                label={t('end_date')}
                fullWidth
                InputProps={{
                  readOnly: true
                }}
                value="Present"
              /> :
              <KeyboardDatePicker
                autoOk
                disableToolbar
                inputVariant="outlined"
                variant="inline"
                label={t('end_date')}
                format="MM/yyyy"
                openTo="year"
                views={['year', 'month']}
                value={endDate}
                onChange={e => this.setState({ date: e as unknown as Date })}
              />
            }
          </Grid>
        </Grid>
      </Fragment>
    );
  }

  private patchWorkExperience = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.currentTarget;
    const { experience, resumeId } = this.props;

    patchWorkExperience(resumeId, {
      uuid: experience.uuid,
      [name]: value
    });
  }
}

export const EditExperience = withNamespaces()(EditExperienceComponent);
