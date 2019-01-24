import TextField, { Input } from '@material/react-text-field';
import React, { Component } from 'react';
import AsyncButton from 'react-async-button';
import { WithNamespaces, withNamespaces } from 'react-i18next';

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
            name="email"
            value={email}
            onChange={e => this.onChange(e)}/>
        </TextField>

        <TextField
          label={t('create_a_password')}
        >
          <Input
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
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={e => this.onChange(e)}/>
        </TextField>

        <AsyncButton
          className="mdc-button mdc-ripple-upgraded mdc-button--raised"
          raised={true}
          text={t('create_account')}
          pendingText={t('saving_ellipsis')}
          onClick={this.submit}
        />
      </form>
    );
  }

  public onChange(e: React.FormEvent<HTMLTextAreaElement>) {
    const { name, value } = e.currentTarget;

    this.setState({ [name]: value } as SignupState);
  }

  public submit(_: React.FormEvent<HTMLButtonElement>) {
    return new Promise((resolve, _) => {
      const wait = setTimeout(() => {
        clearTimeout(wait);
        resolve('Promise A win!');
      }, 2000);
    });
  }
}

export const SignupComponent = withNamespaces()(Signup);
