import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { Button, Grid } from '@material-ui/core';
import MaterialIcon from '@material/react-material-icon';
import classnames from 'classnames';

import { FullWidthDivider } from 'common/FullWidthDivider';
import { Spinner } from 'common/Spinner/component';
import { get, post } from 'utils/api';
import { Resume } from 'utils/models';

import styles from './styles.module.scss';

type ResumesComponentState = {
  resumes: Resume[];
  pending: boolean;
};

type TComponentProps = RouteComponentProps & WithNamespaces;

class ResumesComponent extends PureComponent<TComponentProps, ResumesComponentState> {
  public state = {
    resumes: [],
    pending: true
  };

  public render() {
    const { t } = this.props;
    const { pending } = this.state;

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
      </div>
    );
  }

  public componentDidMount() {
    this.fetchResumes();
  }

  private createResume = async (): Promise<void> => {
    const { history, t } = this.props;

    const body = {
      resume: {
        name: t('untitled')
      }
    };

    const createdResume: Resume = await post({ baseResource: 'resumes' }, body);
    history.push(`/resumes/${createdResume.uuid}/edit`);
  }

  private fetchResumes = async (): Promise<void> => {
    try {
      const resumes: Resume[] = await get<Resume[]>({ baseResource: 'resumes' });

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
}

export const Resumes = withNamespaces()(ResumesComponent);
