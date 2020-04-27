import React, { FormEvent, PureComponent } from 'react';
import AsyncButton from 'react-async-button';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { Link, RouteComponentProps } from 'react-router-dom';

import classnames from 'classnames';
import { TextField } from 'common/TextField';
import { post } from 'utils/api';
import { MIN_PASSWORD_LENGTH, ROUTES } from 'utils/constants';
import { User } from 'utils/models';
import { EMAIL_REQUIRED } from 'utils/regex';

import signupStyles from 'SignupComponent/styles.module.scss';
import styles from './styles.module.scss';

type LoginState = {
  email: string;
  error?: string;
  password: string;
};

type TComponentProps = RouteComponentProps & WithNamespaces;

class Login extends PureComponent<TComponentProps, LoginState> {
  state = {
    email: '',
    error: undefined,
    password: ''
  };

  public render() {
    const { t } = this.props;
    const { email, error, password } = this.state;

    return (
      <form onSubmit={e => this.allFieldsValid && this.submit(e)}>
        <div className={`${signupStyles.authContainer} ${styles.loginContainer}`}>
          <h1 className={signupStyles.h1}>
            {t('log_in')}
          </h1>

          <TextField
            className={classnames(styles.field, { [styles.helperTextActive]: !!error })}
            label={t('email')}
            error={!!error}
            name="email"
            value={email}
            onChange={this.onChange}
            helperText={error}
          />

          <TextField
            className={styles.field}
            label={t('password')}
            name="password"
            type="password"
            autoComplete="password"
            value={password}
            onChange={this.onChange}
          />

          <AsyncButton
            type="submit"
            className="mdc-button mdc-ripple-upgraded mdc-button--raised"
            disabled={!this.allFieldsValid}
            text={t('submit')}
            pendingText={t('loading_ellipsis')}
            onClick={(e: React.FormEvent<HTMLButtonElement>) => this.submit(e)}
          />

          <div className={signupStyles.switchAuthMethod}>
            <span>{t('first_time_here')}</span>
            <Link to="get-started">
              {t('sign_up')}
            </Link>
          </div>
        </div>
      </form>
    );
  }

  private onChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({ [name]: value, error: undefined } as LoginState);
  }

  private get allFieldsValid(): boolean {
    const { email, password } = this.state;

    return EMAIL_REQUIRED.test(email) && password.length >= MIN_PASSWORD_LENGTH;
  }

  private submit = (e: FormEvent<HTMLButtonElement | HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    this.clearError();

    return this.tryLogin();
  }

  private tryLogin = async (): Promise<void> => {
    const { history } = this.props;
    const { email, password } = this.state;
    const user: Pick<User, 'email' | 'password'> = { email, password };

    try {
      await post({ baseResourceId: 'sign_in' }, { user });
      history.push(ROUTES.dashboard);
    } catch ({ data: { error } }) {
      this.setState({
        error
      });
    }
  }

  private clearError(): void {
    this.setState({
      error: undefined
    });
  }
}

export const LoginComponent = withNamespaces()(Login);
