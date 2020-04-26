import React, { ChangeEvent, Fragment, MouseEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { ExpansionPanel, ExpansionPanelSummary, FormControlLabel, Switch, TextField, Tooltip } from '@material-ui/core';
import { DeleteOutlined, ExpandMore } from '@material-ui/icons';
import { DatePicker, DatePickerView } from '@material-ui/pickers';
import { format } from 'date-fns';
import { Col, Row } from 'react-bootstrap';

import { ConfirmationDialog } from 'common/ConfirmationDialog';
import { RichTextEditor } from 'common/RichTextEditor';
import { Experience } from 'utils/models';

const DATE_PICKER_VIEWS: DatePickerView[] = ['year', 'month'];
const DATE_PICKER_FORMAT = 'MMM yyyy';

import styles from './styles.module.scss';

type TOwnProps = {
  experience: Experience;
  updateWorkExperience: (experience: Partial<Experience>) => Promise<void>;
  deleteWorkExperience: (experienceId: Uuid) => Promise<void>;
};

type TComponentState = {
  isDeleteConfirmationModalOpen: boolean;
};

type TComponentProps = TOwnProps & WithNamespaces;

class EditExperienceComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    isDeleteConfirmationModalOpen: false
  };

  public render() {
    const now = new Date();
    const { experience, t } = this.props;
    const { isDeleteConfirmationModalOpen } = this.state;
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
                    <div>{format(new Date(startDate), DATE_PICKER_FORMAT)} - {this.doesCurrentlyWorkHere() ? t('present') : format(new Date(endDate!), DATE_PICKER_FORMAT)}</div>
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
              {this.doesCurrentlyWorkHere() ?
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
              />
            </Col>

            <Col xs={{ span: 12, order: 3 }} md={{ order: 4 }} className={styles.currentlyWorkHereContainer}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.doesCurrentlyWorkHere()}
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
                onEditorChange={this.updateWorkExperienceDescription}
                value={description}
              />
            </Col>
          </Row>
        </ExpansionPanel>
      </Fragment>
    );
  }

  private doesCurrentlyWorkHere = (): boolean => {
    const { experience: { startDate, endDate } } = this.props;

    return !!startDate && !endDate;
  }

  private getFullTitle = (): string => {
    const { t } = this.props;
    const { company = '', position = '' } = this.props.experience;

    if (company && position) {
      return t('role_at_place', {
        role: position,
        place: company
      });
    }

    return position || company || t('not_specified');
  }

  private toggleDoesCurrentlyWorkHere = (): void => {
    const { experience: { uuid }, updateWorkExperience } = this.props;

    updateWorkExperience({
      uuid,
      endDate: (this.doesCurrentlyWorkHere() ? new Date() : null) as any
    });
  }

  private onWorkExperienceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { experience: { uuid }, updateWorkExperience } = this.props;
    const { name, value }: { name: string; value: string } = e.currentTarget;

    updateWorkExperience({
      uuid,
      [name]: value
    });
  }

  private onWorkExperienceStartDateChange = (val: unknown): void => {
    this.updateWorkExperienceState('startDate', val as Date);
  }

  private onWorkExperienceEndDateChange = (val: unknown): void => {
    this.updateWorkExperienceState('endDate', val as Date);
  }

  private updateWorkExperienceDescription = (value: string): void => {
    return this.updateWorkExperienceState('description', value);
  }

  private updateWorkExperienceState = (name: string, value: string | Date): void => {
    const { experience: { uuid }, updateWorkExperience } = this.props;

    updateWorkExperience({
      uuid,
      [name]: value
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
    const { deleteWorkExperience, experience: { uuid: experienceId } } = this.props;

    await deleteWorkExperience(experienceId);
    this.closeDeleteConfirmationModal();
  }
}

export const EditExperience = withNamespaces()(EditExperienceComponent);
