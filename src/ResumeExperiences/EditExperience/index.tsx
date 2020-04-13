import React, { ChangeEvent, Fragment, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Grid, TextField } from '@material-ui/core';
import { DatePickerView, KeyboardDatePicker } from '@material-ui/pickers';

import { Experience } from 'utils/models';
import { patchWorkExperience } from 'utils/requests';

const DATE_PICKER_VIEWS: DatePickerView[] = ['year', 'month'];
const DATE_PICKER_FORMAT = 'MM/yyyy';

type TOwnProps = {
  experience: Experience;
  onWorkExperienceChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, experienceId: Uuid) => void;
  onWorkExperienceDateChange: (requestId: Uuid, key: string, val: Date) => void;
  resumeId: Uuid;
};

type TComponentProps = TOwnProps & WithNamespaces;

class EditExperienceComponent extends PureComponent<TComponentProps> {
  public render() {
    const now = new Date();
    const { experience = {} as Experience, t } = this.props;
    const { endDate = now, company = '', position = '', startDate = now } = experience;

    return (
      <Fragment>
        <Grid container item spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              label={t('job_title')}
              fullWidth
              InputLabelProps={{ shrink: !!position }}
              name="position"
              value={position}
              onChange={this.onWorkExperienceChange}
              onBlur={this.patchWorkExperience}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              label={t('employer')}
              fullWidth
              InputLabelProps={{ shrink: !!company }}
              name="company"
              value={company}
              onChange={this.onWorkExperienceChange}
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
              format={DATE_PICKER_FORMAT}
              openTo="year"
              views={DATE_PICKER_VIEWS}
              value={startDate}
              onChange={this.onWorkExperienceStartDateChange}
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
                format={DATE_PICKER_FORMAT}
                openTo="year"
                views={DATE_PICKER_VIEWS}
                minDate={startDate}
                value={endDate}
                onChange={this.onWorkExperienceEndDateChange}
              />
            }
          </Grid>
        </Grid>
      </Fragment>
    );
  }

  private onWorkExperienceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { experience: { uuid: experienceUuid }, onWorkExperienceChange } = this.props;

    onWorkExperienceChange(e, experienceUuid);
  }

  private onWorkExperienceStartDateChange = (val: unknown): void => {
    this.onWorkExperienceDateChange('startDate', val);
  }

  private onWorkExperienceEndDateChange = (val: unknown): void => {
    this.onWorkExperienceDateChange('endDate', val);
  }

  private onWorkExperienceDateChange = (key: string, val: unknown): void => {
    const { experience: { uuid: experienceUuid }, onWorkExperienceDateChange } = this.props;

    onWorkExperienceDateChange(experienceUuid, key, val as Date);
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
