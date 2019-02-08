import TextField, { HelperText, Input } from '@material/react-text-field';
import React, { Component, FormEvent } from 'react';
import AsyncButton from 'react-async-button';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { post } from '../util/api';
import { User } from '../util/models';
import { EMAIL_REQUIRED } from '../util/regex';

import './styles.scss';

type SignupField = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

type Errors = {
  errors: {
    email?: string[];
    password?: string[];
  };
};

type SignupStateWithErrors = SignupField & Errors;

const MIN_PASSWORD_LENGTH: number = 8;

class Signup extends Component<WithNamespaces, SignupStateWithErrors> {
  public state = {
    email: '',
    errors: this.defaultErrors.errors,
    password: '',
    passwordConfirmation: ''
  };

  public render() {
    const { t } = this.props;
    const { email, errors, password, passwordConfirmation } = this.state;

    return (
      <div className="form-container">
        {errors.email && errors.email.map((error, i) => {
          return <div key={i}>{error}</div>;
        })}

        {errors.password && errors.password.map((error, i) => {
          return <div key={i}>{error}</div>;
        })}
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
          label={t('create_a_password')}
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
            autoComplete="new-password"
            value={password}
            onChange={e => this.onChange(e)}/>
        </TextField>

        <TextField
          label={t('confirm_password')}
          helperText={
            <HelperText validation={true}>
              {t('validation.passwords_do_not_match')}
            </HelperText>}
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

        <AsyncButton
          className="mdc-button mdc-ripple-upgraded mdc-button--raised"
          disabled={!this.allFieldsValid}
          text={t('create_account')}
          pendingText={t('saving_ellipsis')}
          onClick={(e: React.FormEvent<HTMLButtonElement>) => this.submit(e)}
        />
      </div>
    );
  }

  private onChange(e: FormEvent<HTMLTextAreaElement>) {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({ [name]: value } as SignupField);
  }

  private submit = (e: FormEvent<HTMLButtonElement>): void => {
    this.clearErrors();
    e.preventDefault();
    this.tryCreateUser();
  }

  private tryCreateUser = async (): Promise<any> => {
    const { email, password } = this.state;
    const user: User = { email, password };

    try {
      await post({}, { user });
    } catch ({ response }) {
      this.setState({ errors: response.data.errors });
    }
  }

  private clearErrors = (): void => {
    this.setState(this.defaultErrors);
  }

  private get allFieldsValid(): boolean {
    const { email, password, passwordConfirmation } = this.state;

    return EMAIL_REQUIRED.test(email) &&
      password.length >= MIN_PASSWORD_LENGTH &&
      password === passwordConfirmation;
  }

  private get defaultErrors(): Errors {
    return {
      errors: {
        email: [],
        password: []
      }
    };
  }
}

export const SignupComponent = withNamespaces()(Signup);
