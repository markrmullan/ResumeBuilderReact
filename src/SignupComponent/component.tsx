import TextField, { HelperText, Input } from '@material/react-text-field';
import React, { Component } from 'react';
import AsyncButton from 'react-async-button';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { ApiQuery, post } from '../util/api';
import { EMAIL_REQUIRED } from '../util/regex';

import './styles.scss';

type SignupState = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

type SignupStateWithErrors = SignupState & {
  errors?: Record<'email' | 'password', string[]>;
}

const MIN_PASSWORD_LENGTH = 8;

class Signup extends Component<WithNamespaces, SignupStateWithErrors> {
  public state = {
    email: '',
    password: '',
    passwordConfirmation: ''
  };

  public render() {
    const { t } = this.props;
    const { email, password, passwordConfirmation } = this.state;

    return (
      <form>
        <>
          <TextField
            label={t('email')}
          >
            <Input
              id="email"
              name="email"
              pattern={EMAIL_REQUIRED.toString()}
              value={email}
              onChange={e => this.onChange(e)}/>
          </TextField>
        </>

        <TextField
          label={t('create_a_password')}
          helperText={
            <HelperText validation={true}>
              {t('validation.minimum_characters_with_count', { count: MIN_PASSWORD_LENGTH })}
            </HelperText>
          }
        >
          <Input
            id="password"
            minLength={MIN_PASSWORD_LENGTH}
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => this.onChange(e)}/>
        </TextField>

        <>
          <TextField
            label={t('confirm_password')}
            helperText={
              <HelperText validation={true}>
                {t('validation.passwords_do_not_match')}
              </HelperText>
            }
          >
            <Input
              pattern={`^${password}$`}
              id="password-confirmation"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={e => this.onChange(e)}/>
          </TextField>
        </>

        <AsyncButton
          className="mdc-button mdc-ripple-upgraded mdc-button--raised"
          disabled={this.submitButtonDisabled}
          text={t('create_account')}
          pendingText={t('saving_ellipsis')}
          onClick={(e: React.FormEvent<HTMLButtonElement>) => this.submit(e)}
        />
      </form>
    );
  }

  public onChange(e: React.FormEvent<HTMLTextAreaElement>) {
    const { name, value }: { name: string, value: string } = e.currentTarget;

    this.setState({ [name]: value } as SignupState);
  }

  public submit(e: React.FormEvent<HTMLButtonElement>): void {
    this.setState({ errors: undefined });
    e.preventDefault();
    const { email, password } = this.state;

    const apiQuery: Partial<ApiQuery> = {
      baseResourceId: ''
    };

    try {
      post(apiQuery, { user: { email, password } });
    } catch (e) {
      this.setState({ errors: e });
    }
  }

  private get submitButtonDisabled(): boolean {
    const { email, password, passwordConfirmation } = this.state;

    return !email ||
      password.length < MIN_PASSWORD_LENGTH ||
      password !== passwordConfirmation;
  }
}

export const SignupComponent = withNamespaces()(Signup);
