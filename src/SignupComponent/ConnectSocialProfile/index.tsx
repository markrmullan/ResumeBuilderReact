import React, { PureComponent } from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

import { Button } from '@material-ui/core';

import { ConnectWithFacebook } from 'SignupComponent/ConnectWith/Facebook';

import styles from '../styles.module.scss';

type TOwnProps = {
  onConnectWithFacebook: (response: ReactFacebookLoginInfo) => void;
  clickNext: () => void;
};

type TComponentProps = TOwnProps & WithNamespaces & RouteComponentProps;

class ConnectSocialProfileComponent extends PureComponent<TComponentProps> {
  public render() {
    const { clickNext, onConnectWithFacebook, t } = this.props;

    return (
      <div className={styles.formFunnel}>
        <h1 className={styles.h1}>
          {t('connect_your_social_profile')}
        </h1>

        <p className={styles.p}>
          {t('prefill_your_resume_with_social_profile')}
        </p>

        <div className={styles.connectWithContainer}>
          <ConnectWithFacebook
            onConnectWithFacebook={onConnectWithFacebook}
          />
        </div>

        <div className={styles.buttonContainer}>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.onClickBack}
          >
            {t('back')}
          </Button>

          <Button
            color="primary"
            onClick={clickNext}
            variant="contained"
          >
            {t('skip')}
          </Button>
        </div>
      </div>
    );
  }

  private onClickBack = (): void => {
    const { history } = this.props;

    history.push('/');
  }
}

export const ConnectSocialProfile = withNamespaces()(withRouter(ConnectSocialProfileComponent));
