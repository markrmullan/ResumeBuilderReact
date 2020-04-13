import React, { ChangeEvent, Fragment, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { TextField } from '@material-ui/core';
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
  experience: Experience;
};

type TComponentProps = TOwnProps & WithNamespaces;

class EditExperienceComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    experience: this.props.experience
  };

  public render() {
    const { t } = this.props;
    const { experience } = this.state;
    const { endDate, company = '', position = '', startDate } = experience;

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

        <Row>
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
            {Math.random() > 0.5 ?
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
          </Col>
        </Row>
      </Fragment>
    );
  }

  private onWorkExperienceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.updateWorkExperienceState(name, value);
  }

  private onWorkExperienceStartDateChange = (val: unknown): void => {
    this.updateWorkExperienceState('startDate', val as Date);
  }

  private onWorkExperienceEndDateChange = (val: unknown): void => {
    this.updateWorkExperienceState('endDate', val as Date);
  }

  private updateWorkExperienceState = (name: string, value: string | Date): void => {
    this.setState(({ experience }) => ({
      experience: {
        ...experience,
        [name]: value
      }
    } as TComponentState));
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
