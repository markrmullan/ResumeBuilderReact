import React, { ChangeEvent, Fragment, MouseEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { ExpansionPanel, ExpansionPanelSummary, FormControlLabel, Switch, TextField, Tooltip } from '@material-ui/core';
import { DeleteOutlined, ExpandMore } from '@material-ui/icons';
import { DatePicker, DatePickerView } from '@material-ui/pickers';
import classnames from 'classnames';
import { format } from 'date-fns';
import throttle from 'lodash.throttle';
import { Col, Row } from 'react-bootstrap';

import { ConfirmationDialog } from 'common/ConfirmationDialog';
import { RichTextEditor } from 'common/RichTextEditor';
import { Education } from 'utils/models';
import { patchEducation } from 'utils/requests';

const DATE_PICKER_VIEWS: DatePickerView[] = ['year', 'month'];
const DATE_PICKER_FORMAT = 'MMM yyyy';

import styles from './styles.module.scss';

type TOwnProps = {
  education: Education;
  deleteEducation: (educationId: Uuid) => Promise<void>;
  resumeId: Uuid;
};

type TComponentState = {
  doesCurrentlyAttend: boolean;
  education: Education;
  isDeleteConfirmationModalOpen: boolean;
};

type TComponentProps = TOwnProps & WithNamespaces;

class EditEducationComponent extends PureComponent<TComponentProps, TComponentState> {
  private throttledPatchEducationDescription: Function;

  public constructor(props: TComponentProps) {
    super(props);
    const { education } = this.props;
    const { endDate, startDate } = education;

    this.state = {
      doesCurrentlyAttend: !!startDate && !endDate,
      education,
      isDeleteConfirmationModalOpen: false
    };
    this.throttledPatchEducationDescription = throttle(this.patchEducationDescription, 2000);
  }

  public render() {
    const now = new Date();
    const { t } = this.props;
    const { doesCurrentlyAttend, education, isDeleteConfirmationModalOpen } = this.state;
    const { degree = '', description = '', endDate = now, school = '', startDate = now } = education;

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
                    <div>{format(new Date(startDate), DATE_PICKER_FORMAT)} - {doesCurrentlyAttend ? t('present') : format(new Date(endDate), DATE_PICKER_FORMAT)}</div>
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
                onBlur={this.patchEducation}
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
                onBlur={this.patchEducation}
              />
            </Col>
          </Row>

          <Row className={styles.spec}>
            <Col xs={12} md={6} className={classnames(styles.mb16, styles.startDate)}>
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

            <Col xs={12} md={6}>
              {doesCurrentlyAttend ?
                <TextField
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

              <FormControlLabel
                classes={{
                  label: styles.currentlyWorkHere,
                  root: styles.currentlyWorkHereRoot
                }}
                control={
                  <Switch
                    checked={doesCurrentlyAttend}
                    onChange={this.toggleDoesCurrentlyWorkHere}
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
                onEditorChange={(e: string) => {
                  this.updateEducationState('description', e);
                  this.throttledPatchEducationDescription();
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
    const { school = '', degree = '' } = this.state.education;

    if (school && degree) {
      return t('role_at_place', {
        role: degree,
        place: school
      });
    }

    return degree || school || t('not_specified');
  }

  private toggleDoesCurrentlyWorkHere = (): void => {
    const { education: { uuid: educationUuid }, resumeId } = this.props;

    this.setState(prevState => ({
      doesCurrentlyAttend: !prevState.doesCurrentlyAttend,
      education: {
        ...prevState.education,
        endDate: prevState.doesCurrentlyAttend ? new Date() : undefined
      }
    } as TComponentState), () => {
      patchEducation(resumeId, {
        uuid: educationUuid,
        endDate: (this.state.education.endDate || null) as string
      });
    });
  }

  private onEducationChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.updateEducationState(name, value);
  }

  private onEducationStartDateChange = (val: unknown): void => {
    this.onEducationDateChange('startDate', val);
  }

  private onEducationEndDateChange = (val: unknown): void => {
    this.onEducationDateChange('endDate', val);
  }

  private updateEducationState = (name: string, value: string | Date): void => {
    this.setState(({ education }) => ({
      education: {
        ...education,
        [name]: value
      }
    } as TComponentState));
  }

  private onEducationDateChange = (key: string, val: unknown): void => {
    const { education: { uuid: educationUuid }, resumeId } = this.props;

    this.updateEducationState(key, val as Date);
    patchEducation(resumeId, {
      uuid: educationUuid,
      [key]: val as Date
    });
  }

  private patchEducation = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.currentTarget;
    const { education: { uuid: educationUuid }, resumeId } = this.props;

    patchEducation(resumeId, {
      uuid: educationUuid,
      [name]: value
    });
  }

  private patchEducationDescription = (): void => {
    const { education: { uuid: educationUuid }, resumeId } = this.props;
    const { education: { description } } = this.state;

    patchEducation(resumeId, {
      uuid: educationUuid,
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

  private deleteEducation = async (): Promise<void> => {
    const { deleteEducation } = this.props;
    const { uuid: educationId } = this.state.education;

    await deleteEducation(educationId);
    this.closeDeleteConfirmationModal();
  }
}

export const EditEducation = withNamespaces()(EditEducationComponent);
