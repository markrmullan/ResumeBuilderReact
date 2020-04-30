import React, { PureComponent, ReactElement } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

import { CurrentUserContextImpl } from 'utils/contexts';
import { User } from 'utils/models';
import { logOut } from 'utils/requests';
import styles from './styles.module.scss';

const PATHS_TO_HIDE_HEADER: RegExp[] = [
  new RegExp('/resumes/\.+/edit')
];

type TComponentProps = RouteComponentProps & WithNamespaces;

class TopAppHeaderComponent extends PureComponent<TComponentProps> {
  public static contextType = CurrentUserContextImpl;

  public render() {
    const { history, t } = this.props;
    const { pathname } = history.location;

    if (PATHS_TO_HIDE_HEADER.some(path => path.test(pathname))) return null;

    return (
      <AppBar
        position="static"
      >
        <Toolbar className={styles.toolbar}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h5" className={styles.title}>
            {t('app_name')}
          </Typography>
          {this.getActionItems()}
        </Toolbar>
      </AppBar>
    );
  }

  private getActionItems(): ReactElement[] {
    const { history, t } = this.props;
    const { user } = this.context;
    const { pathname } = history.location;

    if (user && user.uuid) {
      return [
        <Button
          color="inherit"
          key="log-out"
          onClick={this.logOut}
          className={styles.headerButton}
          >
          {t('log_out')}
        </Button>,
        ...(pathname === '/' ? [
          <Button
            variant="contained"
            key="dashboard"
            className={`${styles.ctaLink} ${styles.headerButton}`}
            onClick={this.redirectToDashboard}
          >
            {t('my_dashboard')}
          </Button>
        ] : [])
      ];
    }

    return [
      <Button
        color="inherit"
        key="log-in"
        onClick={this.redirectToLogin}
        className={styles.headerButton}
      >
        {t('log_in')}
      </Button>,
      <Button
        variant="contained"
        key="get-started"
        className={`${styles.ctaLink} ${styles.headerButton}`}
        onClick={this.redirectToSignup}
      >
        {t('sign_up')}
      </Button>
    ];
  }

  private redirectToLogin = (): void => {
    const { history } = this.props;

    history.push('/login');
  }

  private redirectToSignup = (): void => {
    const { history } = this.props;

    history.push('/get-started');
  }

  private redirectToDashboard = (): void => {
    const { history } = this.props;

    history.push('/dashboard');
  }

  private logOut = () => {
    const { updateUser } = this.context;
    const { history } = this.props;

    logOut()
      .then(_ => {
        updateUser({} as User);
        history.push('/');
      });
  }
}

export const TopAppHeader = withNamespaces()(withRouter(TopAppHeaderComponent));
