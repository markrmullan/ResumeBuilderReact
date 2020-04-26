import TextField, { HelperText, Input } from '@material/react-text-field';
import React, { FormEvent, PureComponent } from 'react';
import AsyncButton from 'react-async-button';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { Link, RouteComponentProps } from 'react-router-dom';

import { post } from 'utils/api';
import { MIN_PASSWORD_LENGTH, ROUTES } from 'utils/constants';
import { User } from 'utils/models';
import { EMAIL_REQUIRED } from 'utils/regex';

import styles from 'SignupComponent/styles.module.scss';

type LoginState = {
  email: string;
  error?: string;
  password: string;
};

type TComponentProps = RouteComponentProps & WithNamespaces;

class Login extends PureComponent<TComponentProps, LoginState> {
  public state = {
    email: '',
    error: undefined,
    password: ''
  };

  public render() {
    const { t } = this.props;
    const { email, error, password } = this.state;

    return (
      <form onSubmit={e => this.allFieldsValid && this.submit(e)}>
        <div className={styles.authContainer}>
            <h1 className={styles.h1}>
              {t('log_in')}
            </h1>

            <TextField
              label={t('email')}
              helperText={
                <HelperText isValidationMessage validation>
                  {error || t('validation.invalid_email')}
                </HelperText>}
            >
              <Input
                id="email"
                name="email"
                pattern={EMAIL_REQUIRED.source}
                value={email}
                isValid={!error}
                onChange={e => this.onChange(e)}/>
            </TextField>

            <TextField
              label={t('password')}
              helperText={
                <HelperText
                  isValidationMessage
                  validation
                >
                  {t('validation.minimum_characters_with_count', { count: MIN_PASSWORD_LENGTH })}
                </HelperText>}
            >
              <Input
                id="password"
                minLength={MIN_PASSWORD_LENGTH}
                name="password"
                type="password"
                autoComplete="password"
                value={password}
                onChange={e => this.onChange(e)}/>
            </TextField>

            <AsyncButton
              type="submit"
              className="mdc-button mdc-ripple-upgraded mdc-button--raised"
              disabled={!this.allFieldsValid}
              text={t('submit')}
              pendingText={t('loading_ellipsis')}
              onClick={(e: React.FormEvent<HTMLButtonElement>) => this.submit(e)}
            />

          <div className={styles.switchAuthMethod}>
            <span>{t('first_time_here')}</span>
            <Link to="get-started">
              {t('sign_up')}
            </Link>
          </div>
        </div>
      </form>
    );
  }

  private onChange(e: FormEvent<HTMLTextAreaElement>) {
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
