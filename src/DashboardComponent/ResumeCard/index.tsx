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

import styles from './styles.module.scss';

const DATE_FORMAT = 'dd MMM, HH:mm'; // 14 Apr, 19:36
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
            <Col xs={{ span: 12, offset: 4 }} sm={{ span: 12, offset: 8 }} md={{ span: 12, offset: 6 }}>
              <div className={styles.infoContainer}>
                <Typography className={styles.name}>
                  {resume.name}
                </Typography>
                <Typography className={styles.updatedTime}>
                  {t('updated_timestamp', { timestamp: format(new Date(resume.updatedAt), DATE_FORMAT) })}
                </Typography>
              </div>
              <Typography color="primary" className={styles.actionContainer}>
                <EditOutlined style={{ color: ICON_COLOR }} className={styles.icon} />
                <Link className="dark-link" to={getEditResumeRoute(resumeId)}>{t('edit')}</Link>
              </Typography>
              <Typography className={styles.actionContainer}>
                <DeleteOutlined style={{ color: ICON_COLOR }} className={styles.icon} />
                <span role="button" onClick={this.openDeleteConfirmation} className={styles.deleteText}>{t('delete')}</span>
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

  private deleteResume = async (): Promise<void> => {
    const { deleteResume, resume: { uuid: resumeId } } = this.props;

    deleteResume(resumeId)
      .then(_ => this.closeDeleteConfirmation());
  }
}

export const ResumeCard = withNamespaces()(withRouter(ResumeCardComponent));
