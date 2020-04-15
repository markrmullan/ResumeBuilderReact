import React, { ChangeEvent, Fragment, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { FormControlLabel, Switch, TextField, Tooltip } from '@material-ui/core';
import { DeleteOutlined } from '@material-ui/icons';
import { DatePickerView, KeyboardDatePicker } from '@material-ui/pickers';
import classnames from 'classnames';
import { format } from 'date-fns';
import throttle from 'lodash.throttle';
import { Col, Row } from 'react-bootstrap';

import { ConfirmationDialog } from 'common/ConfirmationDialog';
import { RichTextEditor } from 'common/RichTextEditor';
import { Experience } from 'utils/models';
import { patchWorkExperience } from 'utils/requests';

const DATE_PICKER_VIEWS: DatePickerView[] = ['year', 'month'];
const DATE_PICKER_FORMAT = 'MMM yyyy';

import styles from './styles.module.scss';

type TOwnProps = {
  experience: Experience;
  deleteWorkExperience: (experienceId: Uuid) => Promise<void>;
  resumeId: Uuid;
};

type TComponentState = {
  doesCurrentlyWorkHere: boolean;
  experience: Experience;
  isDeleteConfirmationModalOpen: boolean;
};

type TComponentProps = TOwnProps & WithNamespaces;

class EditExperienceComponent extends PureComponent<TComponentProps, TComponentState> {
  private throttledPatchWorkExperienceDescription: Function;

  public constructor(props: TComponentProps) {
    super(props);
    const { experience } = this.props;
    const { endDate, startDate } = experience;

    this.state = {
      doesCurrentlyWorkHere: !!startDate && !endDate,
      experience,
      isDeleteConfirmationModalOpen: false
    };
    this.throttledPatchWorkExperienceDescription = throttle(this.patchWorkExperienceDescription, 2000);
  }

  public render() {
    const now = new Date();
    const { t } = this.props;
    const { doesCurrentlyWorkHere, experience, isDeleteConfirmationModalOpen } = this.state;
    const { company = '', description = '', endDate = now, position = '', startDate = now } = experience;

    return (
      <Fragment>
        <ConfirmationDialog
          title={t('delete_entry')}
          description={t('are_you_sure_you_want_to_delete_this_entry')}
          secondaryButtonAction={this.deleteWorkExperience}
          secondaryButtonText={t('delete')}
          primaryButtonAction={this.closeDeleteConfirmationModal}
          primaryButtonText={t('cancel')}
          open={isDeleteConfirmationModalOpen}
        />

        <Row className={styles.mb16}>
          <Col xs={12}>
            <div className={styles.summary}>
              <div>
                <div className={styles.title}>{position || t('not_specified')}</div>
                <div>{format(new Date(startDate), DATE_PICKER_FORMAT)} - {doesCurrentlyWorkHere ? t('present') : format(new Date(endDate), DATE_PICKER_FORMAT)}</div>
              </div>
              <div className={styles.deleteIconContainer}>
                <Tooltip arrow title={t('delete')} placement="top">
                  <DeleteOutlined
                    className={styles.deleteIcon}
                    onClick={this.openDeleteConfirmationModal}
                  />
                </Tooltip>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} className={styles.mb16}>
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

          <Col xs={12} md={6} className={styles.mb16}>
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
          <Col xs={12} md={6} className={classnames(styles.mb16, styles.startDate)}>
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

          <Col xs={12} md={6}>
            {doesCurrentlyWorkHere ?
              <TextField
                variant="outlined"
                label={t('end_date')}
                fullWidth
                InputProps={{
                  readOnly: true
                }}
                value={t('present')}
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
              classes={{
                label: styles.currentlyWorkHere,
                root: styles.currentlyWorkHereRoot
              }}
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

        <Row>
          <Col xs={12} className={styles.mb16}>
            <RichTextEditor
              label={t('description')}
              onEditorChange={(e: string) => {
                this.updateWorkExperienceState('description', e);
                this.throttledPatchWorkExperienceDescription();
              }}
              value={description}
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

  private patchWorkExperienceDescription = (): void => {
    const { experience: { uuid: experienceUuid }, resumeId } = this.props;
    const { experience: { description } } = this.state;

    patchWorkExperience(resumeId, {
      uuid: experienceUuid,
      description
    });
  }

  private openDeleteConfirmationModal = (): void => {
    this.setState({ isDeleteConfirmationModalOpen: true });
  }

  private closeDeleteConfirmationModal = (): void => {
    this.setState({ isDeleteConfirmationModalOpen: false });
  }

  private deleteWorkExperience = async (): Promise<void> => {
    const { deleteWorkExperience } = this.props;
    const { uuid: experienceId } = this.state.experience;

    await deleteWorkExperience(experienceId);
    this.closeDeleteConfirmationModal();
  }
}

export const EditExperience = withNamespaces()(EditExperienceComponent);
