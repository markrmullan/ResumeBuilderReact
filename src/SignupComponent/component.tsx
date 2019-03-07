import TextField, { HelperText, Input } from '@material/react-text-field';
import React, { Component, FormEvent } from 'react';
import AsyncButton from 'react-async-button';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';

import { post } from 'utils/api';
import { MIN_PASSWORD_LENGTH } from 'utils/constants';
import { User } from 'utils/models';
import { EMAIL_REQUIRED } from 'utils/regex';

import styles from './styles.module.scss';

type SignupField = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

type Errors = {
  errors: {
    email: string[];
    password: string[];
  };
};

type SignupStateWithErrors = SignupField & Errors;

class Signup extends Component<WithNamespaces, SignupStateWithErrors> {

  private get allFieldsValid(): boolean {
    const { email, password, passwordConfirmation } = this.state;

    return EMAIL_REQUIRED.test(email) &&
      password.length >= MIN_PASSWORD_LENGTH &&
      password === passwordConfirmation;
  }

  private static getDefaultErrors(): Errors {
    return {
      errors: {
        email: [],
        password: []
      }
    };
  }
  public state = {
    email: '',
    errors: Signup.getDefaultErrors().errors,
    password: '',
    passwordConfirmation: ''
  };

  public render() {
    const { t } = this.props;
    const { email, errors, password, passwordConfirmation } = this.state;

    return (
      <div className={styles.authContainer}>
        <h1 className={styles.h1}>
          {t('get_started')}
        </h1>

        <TextField
          label={t('email')}
          helperText={
            <HelperText isValidationMessage={true} validation={true}>
              {errors.email[0] || t('validation.invalid_email')}
            </HelperText>}
        >
          <Input
            id="email"
            name="email"
            pattern={EMAIL_REQUIRED.source}
            value={email}
            isValid={errors.email[0] ? false : undefined}
            onChange={e => this.onChange(e)}/>
        </TextField>

        <TextField
          label={t('create_a_password')}
          helperText={
            <HelperText validation={true}>
              {errors.password[0] || t('validation.minimum_characters_with_count', { count: MIN_PASSWORD_LENGTH })}
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

        <div className={styles.switchAuthMethod}>
          <span>{t('already_have_account')}</span>
          <Link to="login">
            {t('log_in')}
          </Link>
        </div>
      </div>
    );
  }

  private onChange(e: FormEvent<HTMLTextAreaElement>) {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({
      [name]: value,
      errors: Signup.getDefaultErrors().errors
    } as SignupStateWithErrors);
  }

  private submit = (e: FormEvent<HTMLButtonElement>): void => {
    if (this.allFieldsValid) {
      this.clearErrors();
      e.preventDefault();
      this.tryCreateUser();
    }
  }

  private tryCreateUser = async (): Promise<void> => {
    const { email, password } = this.state;
    const user: User = { email, password };

    try {
      await post({}, { user });
    } catch ({ response }) {
      this.setState({
        errors: {
          ...Signup.getDefaultErrors().errors,
          ...response.data.errors
        }
      });
    }
  }

  private clearErrors = (): void => {
    this.setState({
      errors: Signup.getDefaultErrors().errors
    });
  }
}

export const SignupComponent = withNamespaces()(Signup);
