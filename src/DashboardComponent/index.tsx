import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Col, Container, Row } from 'react-bootstrap';

import { FullWidthDivider } from 'common/FullWidthDivider';
import { Spinner } from 'common/Spinner';
import { CurrentUserContextImpl } from 'utils/contexts';
import { Resume } from 'utils/models';
import { createResume, deleteResume, fetchCurrentUser, fetchResumes } from 'utils/requests';
import { ResumeCard } from './ResumeCard';

import styles from './styles.module.scss';

type DashboardComponentState = {
  resumes: Resume[];
  pending: boolean;
};

type TComponentProps = RouteComponentProps & WithNamespaces;

class DashboardComponent extends PureComponent<TComponentProps, DashboardComponentState> {
  public static contextType = CurrentUserContextImpl;

  public state = {
    resumes: [],
    pending: true
  };

  public render() {
    const { t } = this.props;
    const { pending, resumes = [] as Resume[] } = this.state;

    if (pending) {
      return (
        <div className="app-wrapper-max-width">
          <Container>
            <Spinner />
          </Container>
        </div>
      );
    }

    return (
      <div className="app-wrapper-max-width">
        <Container fluid className={styles.container}>
          <Row noGutters>
            <Col xs={12} sm={8} className={styles.headerEl}>
              <h1>{t('resumes')}</h1>
            </Col>

            <Col xs={12} sm={4} className={`${styles.addButtonContainer}`}>
              <Button
                color="primary"
                variant="contained"
                className={`${styles.headerEl} ${styles.createNewButton}`}
                startIcon={<Add />}
                onClick={this.createResume}
              >
                {t('create_new')}
              </Button>
            </Col>
          </Row>

          <FullWidthDivider />

          <Row className={styles.resumesContainer}>
            {resumes.map(resume => (
              <Col xs={12} md={6} key={resume.uuid} className={styles.resumeCard}>
                <ResumeCard resume={resume} deleteResume={this.deleteResume} />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  }

  public componentDidMount() {
    const { updateUser } = this.context;
    this.fetchResumes();

    fetchCurrentUser().then(currentUser => {
      updateUser(currentUser);
    });
  }

  private createResume = async (): Promise<void> => {
    const { history, t } = this.props;

    const createdResume: Resume = await createResume(t('untitled'));
    history.push(`/resumes/${createdResume.uuid}/edit`);
  }

  private fetchResumes = async (): Promise<void> => {
    try {
      const resumes: Resume[] = await fetchResumes();

      this.setState({
        resumes,
        pending: false
      });
    } catch {
      this.setState({
        resumes: [],
        pending: false
      });
    }
  }

  private deleteResume = async (resumeId: Uuid): Promise<void> => {
    deleteResume(resumeId).then(_ => {
      this.setState(prevState => ({
        resumes: prevState.resumes.filter(({ uuid }) => uuid !== resumeId)
      }));
    });
  }
}

export const Dashboard = withNamespaces()(DashboardComponent);
