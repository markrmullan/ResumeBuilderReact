import React, { PureComponent } from 'react';
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { FACEBOOK_APP_ID } from 'utils/constants';

import styles from './styles.module.scss';

type TOwnProps = {
  onConnectWithFacebook: (response: ReactFacebookLoginInfo) => void;
};

class ConnectWithFacebookComponent extends PureComponent<TOwnProps & WithNamespaces> {
  public render() {
    const { onConnectWithFacebook, t } = this.props;

    return (
      <div className={styles.container}>
        <FacebookLogin
          disableMobileRedirect
          appId={FACEBOOK_APP_ID}
          callback={onConnectWithFacebook}
          fields="first_name,last_name,email,picture"
          scope="public_profile,email"
          size="metro"
          textButton={t('connect_with_facebook')}
          icon="fa-facebook"
        />
      </div>
    );
  }
}

export const ConnectWithFacebook = withNamespaces()(ConnectWithFacebookComponent);
