import React, { FormEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Button } from '@material-ui/core';
import classnames from 'classnames';
import { TextField } from 'common/TextField';
import AsyncButton from 'react-async-button';

import { MIN_PASSWORD_LENGTH } from 'utils/constants';

import signupStyles from '../styles.module.scss';

type TOwnProps = {
  password: string;
  passwordConfirmation: string;
  clickNext: (e: React.FormEvent<HTMLButtonElement>) => void;
  clickPrev: () => void;
  onChange: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: {
    password: string[];
  };
};

type TComponentProps = TOwnProps & WithNamespaces;

type TComponentState = {
  passwordError: boolean;
  passwordConfirmationError: boolean;
};

class PasswordFormComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    passwordError: false,
    passwordConfirmationError: false
  };

  public render() {
    const { errors, password, passwordConfirmation, clickNext, clickPrev, t } = this.props;
    const { passwordConfirmationError, passwordError } = this.state;

    return (
      <div className={signupStyles.formFunnel}>
        <h1 className={signupStyles.h1}>
          {t('create_a_password')}
        </h1>

        <p className={signupStyles.p}>
          {t('access_your_resume_any_time')}
        </p>

        <div className={signupStyles.fields}>
          <TextField
            label={t('create_a_password')}
            id="password"
            error={!!errors.password[0] || passwordError}
            helperText={errors.password[0] || passwordError && t('validation.minimum_characters_with_count', { count: MIN_PASSWORD_LENGTH })}
            name="password"
            required
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={this.onChange}
            onBlur={this.onBlur}
            className={classnames(signupStyles.textField, { [signupStyles.helperTextActive]: passwordError })}
          />

          <TextField
            label={t('confirm_password')}
            error={passwordConfirmationError}
            helperText={passwordConfirmationError && t('validation.passwords_do_not_match')}
            id="password-confirmation"
            name="passwordConfirmation"
            required
            type="password"
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={this.onChange}
            className={classnames(signupStyles.textField, { [signupStyles.helperTextActive]: passwordConfirmationError })}
          />
        </div>

        <div className={signupStyles.buttonContainer}>
          <Button
            color="primary"
            variant="outlined"
            onClick={clickPrev}
          >
            {t('back')}
          </Button>

          <AsyncButton
            className="mdc-button mdc-ripple-upgraded mdc-button--raised"
            disabled={!this.allFieldsValid}
            text={t('save')}
            pendingText={t('saving_ellipsis')}
            onClick={(e: React.FormEvent<HTMLButtonElement>) => clickNext(e)}
          />
        </div>
      </div>
    );
  }

  private get allFieldsValid(): boolean {
    const { password, passwordConfirmation } = this.props;

    return !!password &&
      password.length >= MIN_PASSWORD_LENGTH &&
      password === passwordConfirmation;
  }

  private onChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { passwordError } = this.state;
    const { password, onChange } = this.props;

    onChange(e);

    if (passwordError) {
      this.onBlur(e);
    }

    const { name, value } = e.currentTarget;

    if (name === 'passwordConfirmation') {
      this.setState({
        passwordConfirmationError: password !== value
      });
    }
  }

  private onBlur = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value = '' } = e.currentTarget;

    this.setState({
      passwordError: value.length < MIN_PASSWORD_LENGTH
    });
  }
}

export const PasswordForm = withNamespaces()(PasswordFormComponent);
