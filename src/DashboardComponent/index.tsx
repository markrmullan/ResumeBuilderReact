import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { Button, Grid } from '@material-ui/core';
import MaterialIcon from '@material/react-material-icon';
import classnames from 'classnames';

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
        <Grid>
          <Spinner />
        </Grid>
      );
    }

    return (
      <div className="app-wrapper-max-width">
        <Grid container className={styles.container}>
          <Grid container>
            <Grid item xs={12} sm={9} lg={9} className={styles.headerEl}>
              <h1>{t('resumes')}</h1>
            </Grid>
            <Grid alignItems="center" justify="flex-end" container item xs={12} sm={3} lg={3}>
              <Button
                color="primary"
                variant="contained"
                className={classnames(styles.createNewButton, styles.headerEl)}
                startIcon={<MaterialIcon icon="add" />}
                onClick={this.createResume}
                >
                  {t('create_new')}
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <FullWidthDivider />

          <Grid container className={styles.resumesContainer}>
            <Grid container spacing={3}>
              {resumes.map(resume => (
                <Grid item xs={12} md={6} key={resume.uuid}>
                  <ResumeCard resume={resume} deleteResume={this.deleteResume} />
                </Grid>
              ))}
            </Grid>
          </Grid>
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
