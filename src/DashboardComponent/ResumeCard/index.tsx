import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Card, Typography } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';
import { DeleteOutlined, EditOutlined } from '@material-ui/icons';
import { format } from 'date-fns';
import { Col, Container, Row } from 'react-bootstrap';

import { ConfirmationDialog } from 'common/ConfirmationDialog';
import { Resume } from 'utils/models';
import { getEditResumeRoute } from 'utils/routes';

import resumeWireframe from 'common/assets/resume_wireframe.svg';
import styles from './styles.module.scss';

const DATE_FORMAT = 'd MMM, HH:mm'; // 3 Apr, 19:36
const ICON_COLOR = deepPurple[300];

type TOwnProps = {
  deleteResume: (resumeId: Uuid) => Promise<void>;
  resume: Resume;
};

type TComponentState = {
  isDeleteConfirmationOpen: boolean;
};

type TComponentProps = TOwnProps & WithNamespaces & RouteComponentProps;

class ResumeCardComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    isDeleteConfirmationOpen: false
  };

  public render() {
    const { isDeleteConfirmationOpen } = this.state;
    const { resume, t } = this.props;
    const { uuid: resumeId } = resume;

    return (
      <Card className={styles.container}>
        <Container fluid>
          <Row>
            <Col xs={4} sm={6} className={styles.wireframeContainer}>
              <img
                className={styles.resumeWireframe}
                src={resumeWireframe}
                alt=""
              />
            </Col>

            <Col xs={8} sm={6}>
              <div className={styles.infoContainer}>
                <Typography className={styles.name}>
                  {resume.name}
                </Typography>
                <Typography className={styles.updatedTime}>
                  {t('updated_timestamp', { timestamp: format(new Date(resume.updatedAt), DATE_FORMAT) })}
                </Typography>
              </div>
              <Typography color="primary" className={styles.actionContainer}>
                <Link className="dark-link" to={getEditResumeRoute(resumeId)}>
                  <EditOutlined style={{ color: ICON_COLOR }} className={styles.icon} />

                  {t('edit')}
                </Link>
              </Typography>
              <Typography className={styles.actionContainer}>
                <span role="button" onClick={this.openDeleteConfirmation} className={styles.deleteText}>
                  <DeleteOutlined style={{ color: ICON_COLOR }} className={styles.icon} />

                  {t('delete')}
                </span>
              </Typography>
            </Col>
          </Row>
        </Container>

        <ConfirmationDialog
          title={t('delete_resume')}
          description={t('are_you_sure_you_want_to_delete_this_resume')}
          open={isDeleteConfirmationOpen}
          secondaryButtonAction={this.deleteResume}
          secondaryButtonText={t('delete')}
          primaryButtonAction={this.closeDeleteConfirmation}
          primaryButtonText={t('cancel')}
        />
      </Card>
    );
  }

  private openDeleteConfirmation = (): void => {
    this.setState({ isDeleteConfirmationOpen: true });
  }

  private closeDeleteConfirmation = (): void => {
    this.setState({ isDeleteConfirmationOpen: false });
  }

  private deleteResume = (): void => {
    const { deleteResume, resume: { uuid: resumeId } } = this.props;

    deleteResume(resumeId);
  }
}

export const ResumeCard = withNamespaces()(withRouter(ResumeCardComponent));
