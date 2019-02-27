import TextField, { HelperText, Input } from '@material/react-text-field';
import React, { Component, FormEvent } from 'react';
import AsyncButton from 'react-async-button';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { post } from 'utils/api';
import { MIN_PASSWORD_LENGTH } from 'utils/constants';
import { User } from 'utils/models';
import { EMAIL_REQUIRED } from 'utils/regex';

type LoginState = {
  email: string;
  error: string;
  password: string;
};

class Login extends Component<WithNamespaces, LoginState> {
  public state = {
    email: '',
    error: '',
    password: ''
  };

  public render() {
    const { t } = this.props;
    const { email, error, password } = this.state;

    return (
      <div className="auth-container">
        {error &&
          <div>
            {error}
          </div>
        }
        <h1 className="h1">{t('log_in')}</h1>

        <TextField
          label={t('email')}
          helperText={
            <HelperText validation={true}>
              {t('validation.invalid_email')}
            </HelperText>}
        >
          <Input
            id="email"
            name="email"
            pattern={EMAIL_REQUIRED.source}
            value={email}
            onChange={e => this.onChange(e)}/>
        </TextField>

        <TextField
          label={t('password')}
          helperText={
            <HelperText validation={true}>
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
          className="mdc-button mdc-ripple-upgraded mdc-button--raised"
          disabled={!this.allFieldsValid}
          text={t('submit')}
          pendingText={t('loading_ellipsis')}
          onClick={(e: React.FormEvent<HTMLButtonElement>) => this.submit(e)}
        />
      </div>
    );
  }

  private onChange(e: FormEvent<HTMLTextAreaElement>) {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({ [name]: value } as LoginState);
  }

  private get allFieldsValid(): boolean {
    const { email, password } = this.state;

    return EMAIL_REQUIRED.test(email) && password.length >= MIN_PASSWORD_LENGTH;
  }

  private submit = (_: FormEvent<HTMLButtonElement>): void => {
    this.clearError();
    this.tryLogin();
  }

  private tryLogin = async (): Promise<void> => {
    const { email, password } = this.state;
    const user: Pick<User, 'email' | 'password'> = { email, password };

    try {
      await post({ baseResourceId: 'sign_in' }, { user });
    } catch ({ response }) {
      this.setState({ error: response.data.error });
    }
  }

  private clearError(): void {
    this.setState({
      error: ''
    });
  }
}

export const LoginComponent = withNamespaces()(Login);
