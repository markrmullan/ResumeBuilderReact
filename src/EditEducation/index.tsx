import React, { ChangeEvent, Component, Fragment, MouseEvent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { ExpansionPanel, ExpansionPanelSummary, FormControlLabel, Switch, TextField, Tooltip } from '@material-ui/core';
import { DeleteOutlined, ExpandMore } from '@material-ui/icons';
import { DatePicker, DatePickerView } from '@material-ui/pickers';
import { format } from 'date-fns';
import { Col, Row } from 'react-bootstrap';

import { ConfirmationDialog } from 'common/ConfirmationDialog';
import { RichTextEditor } from 'common/RichTextEditor';
import { Education } from 'utils/models';

const DATE_PICKER_VIEWS: DatePickerView[] = ['year'];
const DATE_PICKER_FORMAT = 'yyyy';

import styles from './styles.module.scss';

type TOwnProps = {
  lastUpdatedUuid: Nullable<Uuid>;
  education: Education;
  updateEducation: (education: Partial<Education>) => Promise<void>;
  deleteEducation: (educationId: Uuid) => Promise<void>;
};

type TComponentState = {
  isDeleteConfirmationModalOpen: boolean;
};

type TComponentProps = TOwnProps & WithNamespaces;

class EditEducationComponent extends Component<TComponentProps, TComponentState> {
  public state = {
    isDeleteConfirmationModalOpen: false
  };

  public render() {
    const now = new Date();
    const { education, t } = this.props;
    const { isDeleteConfirmationModalOpen } = this.state;
    const { degree = '', description = '', endDate = now, gpa = '', school = '', startDate = now } = education;

    return (
      <Fragment>
        <ConfirmationDialog
          title={t('delete_entry')}
          description={t('are_you_sure_you_want_to_delete_this_entry')}
          secondaryButtonAction={this.deleteEducation}
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
                    <div>{format(new Date(startDate), DATE_PICKER_FORMAT)} - {this.doesCurrentlyAttend() ? t('present') : format(new Date(endDate!), DATE_PICKER_FORMAT)}</div>
                  </div>
                </div>
              </Col>
            </Row>
          </ExpansionPanelSummary>

          <Row>
            <Col xs={12} md={6} className={styles.mb16}>
              <TextField
                variant="filled"
                label={t('school')}
                fullWidth
                name="school"
                value={school}
                onChange={this.onEducationChange}
              />
            </Col>

            <Col xs={12} md={6} className={styles.mb16}>
              <TextField
                variant="filled"
                label={t('degree')}
                fullWidth
                name="degree"
                value={degree}
                onChange={this.onEducationChange}
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
                onChange={this.onEducationStartDateChange}
              />
            </Col>

            <Col xs={6} md={3}>
              {this.doesCurrentlyAttend() ?
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
                  onChange={this.onEducationEndDateChange}
                />
              }
            </Col>

            <Col xs={{ span: 12, order: 4 }} md={{ span: 6, order: 3 }} className={styles.gpaContainer}>
              <TextField
                variant="filled"
                label={t('gpa')}
                fullWidth
                name="gpa"
                value={gpa}
                onChange={this.onEducationChange}
              />
            </Col>

            <Col xs={{ span: 12, order: 3 }} md={{ order: 4 }} className={styles.currentlyAttendContainer}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.doesCurrentlyAttend()}
                    onChange={this.toggleDoesCurrentlyAttend}
                    color="primary"
                  />
                }
                label={t('currently_attending')}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={12} className={styles.mb16}>
              <RichTextEditor
                label={t('description')}
                onEditorChange={this.updateEducationDescription}
                value={description}
              />
            </Col>
          </Row>
        </ExpansionPanel>
      </Fragment>
    );
  }

  public shouldComponentUpdate (nextProps: TComponentProps, nextState: TComponentState) {
    const { education: { uuid } } = this.props;
    const { lastUpdatedUuid } = nextProps;
    const { isDeleteConfirmationModalOpen } = this.state;

    return lastUpdatedUuid === null ||
      lastUpdatedUuid === uuid ||
      isDeleteConfirmationModalOpen !== nextState.isDeleteConfirmationModalOpen;
  }

  private getFullTitle = (): string => {
    const { education, t } = this.props;
    const { school = '', degree = '' } = education;

    if (school && degree) {
      return t('role_at_place', {
        role: degree,
        place: school
      });
    }

    return degree || school || t('not_specified');
  }

  private doesCurrentlyAttend = (): boolean => {
    const { education: { startDate, endDate } } = this.props;

    return !!startDate && !endDate;
  }

  private toggleDoesCurrentlyAttend = (): void => {
    this.updateEducation('endDate', (this.doesCurrentlyAttend() ? new Date() : null) as Date);
  }

  private onEducationChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.updateEducation(name, value);
  }

  private onEducationStartDateChange = (val: unknown): void => {
    this.updateEducation('startDate', val as Date);
  }

  private onEducationEndDateChange = (val: unknown): void => {
    this.updateEducation('endDate', val as Date);
  }

  private updateEducationDescription = (descriptionVal: string): void => {
    this.updateEducation('description', descriptionVal);
  }

  private updateEducation = (name: string, value: string | Date): void => {
    const { education: { uuid }, updateEducation } = this.props;

    updateEducation({
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

  private deleteEducation = async (): Promise<void> => {
    const { deleteEducation, education } = this.props;
    const { uuid: educationId } = education;

    await deleteEducation(educationId);
  }
}

export const EditEducation = withNamespaces()(EditEducationComponent);
