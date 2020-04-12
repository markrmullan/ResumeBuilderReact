import React, { Fragment, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { get } from 'utils/api';
import { Resume } from 'utils/models';

import { Button, Grid } from '@material-ui/core';
import MaterialIcon from '@material/react-material-icon';
import classnames from 'classnames';

import { FullWidthDivider } from 'common/FullWidthDivider';
import { Spinner } from 'common/Spinner/component';

import styles from './styles.module.scss';

type ResumesComponentState = {
  resumes: Resume[];
  pending: boolean;
};

class ResumesComponent extends PureComponent<WithNamespaces, ResumesComponentState> {
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
      <Fragment>
        <Grid container={true} className={styles.container}>
          <Grid container={true}>
            <Grid xs={12} sm={9} lg={9} className={styles.headerEl}>
              <h1>{t('resumes')}</h1>
            </Grid>
            <Grid alignItems="center" justify="flex-end" container={true} xs={12} sm={3} lg={3}>
              <Button
                color="primary"
                variant="contained"
                className={classnames(styles.createNewButton, styles.headerEl)}
                startIcon={<MaterialIcon icon="add" />}
              >
                {t('create_new')}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <FullWidthDivider />
      </Fragment>
    );
  }

  public componentDidMount() {
    this.fetchResumes();
  }

  private fetchResumes = async (): Promise<void> => {
    try {
      const resumes = await get({ baseResource: 'resumes' });

      this.setState({
        resumes: resumes.data,
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
