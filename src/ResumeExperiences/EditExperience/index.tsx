import React, { ChangeEvent, Fragment, MouseEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { ExpansionPanel, ExpansionPanelSummary, FormControlLabel, Switch, TextField, Tooltip } from '@material-ui/core';
import { DeleteOutlined, ExpandMore } from '@material-ui/icons';
import { DatePicker, DatePickerView } from '@material-ui/pickers';
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
    const { company = '', description = '', endDate = now, location = '', position = '', startDate = now } = experience;

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

        <ExpansionPanel className={styles.mb16} elevation={0} variant="outlined">
          <ExpansionPanelSummary
            expandIcon={<ExpandMore />}
          >
            <Row>
              <Col xs={12}>
                <div className={styles.summary}>
                  <div className={styles.deleteIconContainer}>
                    <Tooltip arrow title={t('delete')} placement="top">
                      <DeleteOutlined
                        className={styles.deleteIcon}
                        onClick={this.openDeleteConfirmationModal}
                      />
                    </Tooltip>
                  </div>
                  <div>
                    <div className={styles.title}>{this.getFullTitle()}</div>
                    <div>{format(new Date(startDate), DATE_PICKER_FORMAT)} - {doesCurrentlyWorkHere ? t('present') : format(new Date(endDate), DATE_PICKER_FORMAT)}</div>
                  </div>
                </div>
              </Col>
            </Row>
          </ExpansionPanelSummary>

          <Row>
            <Col xs={12} md={6} className={styles.mb16}>
              <TextField
                variant="filled"
                label={t('job_title')}
                fullWidth
                name="position"
                value={position}
                onChange={this.onWorkExperienceChange}
                onBlur={this.patchWorkExperience}
              />
            </Col>

            <Col xs={12} md={6} className={styles.mb16}>
              <TextField
                variant="filled"
                label={t('employer')}
                fullWidth
                name="company"
                value={company}
                onChange={this.onWorkExperienceChange}
                onBlur={this.patchWorkExperience}
              />
            </Col>
          </Row>

          <Row className={styles.spec}>
            <Col xs={6} md={3} className={styles.startDate}>
              <DatePicker
                className={styles.datePicker}
                autoOk
                disableToolbar
                disableFuture
                inputVariant="filled"
                variant="inline"
                label={t('start_date')}
                format={DATE_PICKER_FORMAT}
                openTo="year"
                views={DATE_PICKER_VIEWS}
                value={startDate}
                onChange={this.onWorkExperienceStartDateChange}
              />
            </Col>

            <Col xs={6} md={3}>
              {doesCurrentlyWorkHere ?
                <TextField
                  disabled
                  variant="filled"
                  label={t('end_date')}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                  value={t('present')}
                /> :
                <DatePicker
                  className={styles.datePicker}
                  autoOk
                  disableToolbar
                  inputVariant="filled"
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

            <Col xs={{ span: 12, order: 4 }} md={{ span: 6, order: 3 }} className={styles.locationContainer}>
              <TextField
                variant="filled"
                label={t('location')}
                placeholder={t('location_placeholder')}
                fullWidth
                name="location"
                value={location}
                onChange={this.onWorkExperienceChange}
                onBlur={this.patchWorkExperience}
              />
            </Col>

            <Col xs={{ span: 12, offset: 6, order: 3 }} md={{ offset: 0, order: 4 }}>
              <FormControlLabel
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
        </ExpansionPanel>
      </Fragment>
    );
  }

  private getFullTitle = (): string => {
    const { t } = this.props;
    const { company = '', position = '' } = this.state.experience;

    if (company && position) {
      return t('role_at_place', {
        role: position,
        place: company
      });
    }

    return position || company || t('not_specified');
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

  private openDeleteConfirmationModal = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
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
