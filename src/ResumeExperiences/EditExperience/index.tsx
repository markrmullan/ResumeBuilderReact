import React, { ChangeEvent, Fragment, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { FormControlLabel, Switch, TextField } from '@material-ui/core';
import { DatePickerView, KeyboardDatePicker } from '@material-ui/pickers';
import { Col, Row } from 'react-bootstrap';

import { Experience } from 'utils/models';
import { patchWorkExperience } from 'utils/requests';

const DATE_PICKER_VIEWS: DatePickerView[] = ['year', 'month'];
const DATE_PICKER_FORMAT = 'MM/yyyy';

import styles from './styles.module.scss';

type TOwnProps = {
  experience: Experience;
  resumeId: Uuid;
};

type TComponentState = {
  doesCurrentlyWorkHere: boolean;
  experience: Experience;
};

type TComponentProps = TOwnProps & WithNamespaces;

class EditExperienceComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    doesCurrentlyWorkHere: !!this.props.experience.startDate && !this.props.experience.endDate,
    experience: this.props.experience
  };

  public render() {
    const now = new Date();
    const { t } = this.props;
    const { doesCurrentlyWorkHere, experience } = this.state;
    const { endDate = now, company = '', position = '', startDate = now } = experience;

    return (
      <Fragment>
        <Row>
          <Col xs={12} md={3} className={styles.mb16}>
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
          </Col>

          <Col xs={12} md={3} className={styles.mb16}>
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
          </Col>
        </Row>

        <Row className={styles.spec}>
          <Col xs={12} md={3} className={styles.mb16}>
            <KeyboardDatePicker
              className={styles.datePicker}
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
          </Col>

          <Col xs={12} md={3} className={styles.mb16}>
            {doesCurrentlyWorkHere ?
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
                className={styles.datePicker}
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

            <FormControlLabel
              classes={{ label: styles.currentlyWorkHere }}
              control={
                <Switch
                  checked={doesCurrentlyWorkHere}
                  onChange={this.toggleDoesCurrentlyWorkHere}
                  color="primary"
                />
              }
              label={t('currently_work_here')}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }

  private toggleDoesCurrentlyWorkHere = (): void => {
    const { experience: { uuid: experienceUuid }, resumeId } = this.props;

    this.setState(prevState => ({
      doesCurrentlyWorkHere: !prevState.doesCurrentlyWorkHere,
      experience: {
        ...prevState.experience,
        endDate: prevState.doesCurrentlyWorkHere ? new Date() : undefined
      }
    } as TComponentState), () => {
      patchWorkExperience(resumeId, {
        uuid: experienceUuid,
        endDate: (this.state.experience.endDate || null) as string
      });
    });
  }

  private onWorkExperienceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.updateWorkExperienceState(name, value);
  }

  private onWorkExperienceStartDateChange = (val: unknown): void => {
    this.onWorkExperienceDateChange('startDate', val);
  }

  private onWorkExperienceEndDateChange = (val: unknown): void => {
    this.onWorkExperienceDateChange('endDate', val);
  }

  private updateWorkExperienceState = (name: string, value: string | Date): void => {
    this.setState(({ experience }) => ({
      experience: {
        ...experience,
        [name]: value
      }
    } as TComponentState));
  }

  private onWorkExperienceDateChange = (key: string, val: unknown): void => {
    const { experience: { uuid: experienceUuid }, resumeId } = this.props;

    this.updateWorkExperienceState(key, val as Date);
    patchWorkExperience(resumeId, {
      uuid: experienceUuid,
      [key]: val as Date
    });
  }

  private patchWorkExperience = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.currentTarget;
    const { experience: { uuid: experienceUuid }, resumeId } = this.props;

    patchWorkExperience(resumeId, {
      uuid: experienceUuid,
      [name]: value
    });
  }
}

export const EditExperience = withNamespaces()(EditExperienceComponent);
