import React, { Fragment, PureComponent, ReactElement } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Button } from '@material-ui/core';

import TopAppBar, { TopAppBarFixedAdjust } from '@material/react-top-app-bar';

import { CurrentUserContextImpl } from 'utils/contexts';
import { User } from 'utils/models';
import { logOut } from 'utils/requests';

const PATHS_TO_HIDE_HEADER: RegExp[] = [
  new RegExp('/resumes/\.+/edit')
];

class TopAppHeaderComponent extends PureComponent<RouteComponentProps & WithNamespaces> {
  public static contextType = CurrentUserContextImpl;

  public render() {
    const { history, t } = this.props;
    const { pathname } = history.location;

    if (PATHS_TO_HIDE_HEADER.some(path => path.test(pathname))) return null;

    return (
      <Fragment>
        <TopAppBar
          title={t('app_name')}
          actionItems={this.getActionItems()}
        />
        <TopAppBarFixedAdjust />
      </Fragment>
    );
  }

  private getActionItems(): ReactElement[] {
    const { history, t } = this.props;
    const { user } = this.context;
    const { pathname } = history.location;

    if (user && user.uuid) {
      return [
        <Button
          key={1}
          onClick={this.logOut}
          className="mdc-button mdc-ripple-upgraded mdc-top-app-bar__action-item mdc-button--outlined mr12"
          >
          {t('log_out')}
        </Button>,
        ...(pathname === '/' ? [
          <Link
            key={2}
            className="mdc-button mdc-ripple-upgraded mdc-top-app-bar__action-item mdc-button--raised"
            to="/dashboard"
          >
            {t('my_dashboard')}
          </Link>
        ] : [])
      ];
    }

    return [
      <Link
        key={1}
        className="mdc-button mdc-ripple-upgraded mdc-top-app-bar__action-item mdc-button--outlined"
        to="/login"
      >
        {t('log_in')}
      </Link>,
      <Link
        key={2}
        className="mdc-button mdc-ripple-upgraded mdc-top-app-bar__action-item mdc-button--raised"
        to="/get-started"
      >
        {t('sign_up')}
      </Link>
    ];
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
