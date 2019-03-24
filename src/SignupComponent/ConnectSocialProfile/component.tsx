import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from '@material/react-button';

import styles from '../styles.module.scss';

type TOwnProps = {
  clickNext: () => void;
};

type TComponentProps = TOwnProps & WithNamespaces;

class ConnectSocialProfileComponent extends PureComponent<TComponentProps> {
  public render() {
    const { clickNext, t } = this.props;

    return (
      <div className={styles.formFunnel}>
        <h1 className={styles.h1}>
          {t('connect_your_social_profile')}
        </h1>

        <p className={styles.p}>
          {t('prefill_your_resume_with_social_profile')}
        </p>

        <div className={styles.buttonContainer}>
          <Link
            className="mdc-button mdc-ripple-upgraded mdc-button--outlined"
            to="/"
          >
            {t('back')}
          </Link>

          <Button
            raised={true}
            onClick={clickNext}
          >
            {t('skip')}
          </Button>
        </div>
      </div>
    );
  }
}

export const ConnectSocialProfile = withNamespaces()(ConnectSocialProfileComponent);
