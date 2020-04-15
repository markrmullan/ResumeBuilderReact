import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Card, Typography } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';
import { EditOutlined } from '@material-ui/icons';
import { format } from 'date-fns';
import { Col, Container, Row } from 'react-bootstrap';

import { Resume } from 'utils/models';
import { getEditResumeRoute } from 'utils/routes';

import styles from './styles.module.scss';

const DATE_FORMAT = 'dd MMM, HH:mm'; // 14 Apr, 19:36

type TOwnProps = {
  resume: Resume;
};

type TComponentProps = TOwnProps & WithNamespaces & RouteComponentProps;

class ResumeCardComponent extends PureComponent<TComponentProps> {
  public render() {
    const { resume, t } = this.props;
    const { uuid: resumeId } = resume;

    return (
      <Card className={styles.container}>
        <Container fluid>
          <Row>
            <Col xs={{ span: 12, offset: 7 }} sm={{ span: 12, offset: 8 }} md={{ span: 12, offset: 6 }}>
              <div className={styles.infoContainer}>
                <Typography className={styles.name}>
                  {resume.name}
                </Typography>
                <Typography className={styles.updatedTime}>
                  {t('updated_timestamp', { timestamp: format(new Date(resume.updatedAt), DATE_FORMAT) })}
                </Typography>
              </div>
              <Typography color="primary">
                <EditOutlined style={{ color: deepPurple[300] }} fontSize="small" />
                <Link className="dark-link" to={getEditResumeRoute(resumeId)}>{t('edit')}</Link>
              </Typography>
            </Col>
          </Row>
        </Container>
      </Card>
    );
  }
}

export const ResumeCard = withNamespaces()(withRouter(ResumeCardComponent));
