import TextField, { Input } from '@material/react-text-field';
import React, { Component } from 'react';
import AsyncButton from 'react-async-button';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { ApiQuery, post } from '../util/api';

import './styles.scss';

type SignupState = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

class Signup extends Component<WithNamespaces, SignupState> {
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
        <TextField
          label={t('email')}
        >
          <Input
            id="email"
            name="email"
            value={email}
            onChange={e => this.onChange(e)}/>
        </TextField>

        <TextField
          label={t('create_a_password')}
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => this.onChange(e)}/>
        </TextField>

        <TextField
          label={t('confirm_password')}
        >
          <Input
            id="password-confirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={e => this.onChange(e)}/>
        </TextField>

        <AsyncButton
          className="mdc-button mdc-ripple-upgraded mdc-button--raised"
          text={t('create_account')}
          pendingText={t('saving_ellipsis')}
          onClick={(e: React.FormEvent<HTMLButtonElement>) => this.submit(e)}
        />
      </form>
    );
  }

  public onChange(e: React.FormEvent<HTMLTextAreaElement>) {
    const { name, value } = e.currentTarget;

    this.setState({ [name]: value } as SignupState);
  }

  public submit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    const { email, password } = this.state;

    const apiQuery: Partial<ApiQuery> = {
      baseResourceId: ''
    };

    post(apiQuery, { user: { email, password } });
  }
}

export const SignupComponent = withNamespaces()(Signup);
