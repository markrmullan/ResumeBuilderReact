import React, { FormEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Button, InputAdornment } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import classnames from 'classnames';
import { TextField } from 'common/TextField';

import { MIN_PASSWORD_LENGTH } from 'utils/constants';

import signupStyles from '../styles.module.scss';
import styles from './styles.module.scss';

type TOwnProps = {
  password: string;
  passwordConfirmation: string;
  clickNext: (e: FormEvent<HTMLButtonElement>) => void;
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
  showPassword: boolean;
  showPasswordConfirmation: boolean;
};

class PasswordFormComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    passwordError: false,
    passwordConfirmationError: false,
    showPassword: false,
    showPasswordConfirmation: false
  };

  public render() {
    const { errors, password, passwordConfirmation, clickNext, clickPrev, t } = this.props;
    const { passwordConfirmationError, passwordError, showPassword, showPasswordConfirmation } = this.state;

    return (
      <form className={signupStyles.formFunnel} onSubmit={this.onSubmit}>
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
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={this.onChange}
            onBlur={this.onBlur}
            className={classnames(signupStyles.textField, { [signupStyles.helperTextActive]: passwordError })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" style={{ color: grey[400] }}>
                  {showPassword ? <VisibilityOff className={styles.vis} onClick={this.togglePasswordVisibility} /> : <Visibility className={styles.vis} onClick={this.togglePasswordVisibility} />}
                </InputAdornment>
              )
            }}
          />

          <TextField
            label={t('confirm_password')}
            error={passwordConfirmationError}
            helperText={passwordConfirmationError && t('validation.passwords_do_not_match')}
            id="password-confirmation"
            name="passwordConfirmation"
            required
            type={showPasswordConfirmation ? 'text' : 'password'}
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={this.onChange}
            className={classnames(signupStyles.textField, { [signupStyles.helperTextActive]: passwordConfirmationError })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" style={{ color: grey[400] }}>
                  {showPasswordConfirmation ? <VisibilityOff className={styles.vis} onClick={this.togglePasswordConfirmationVisibility} /> : <Visibility className={styles.vis} onClick={this.togglePasswordConfirmationVisibility} />}
                </InputAdornment>
              )
            }}
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

          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!this.allFieldsValid}
            onClick={(e: FormEvent<HTMLButtonElement>) => clickNext(e)}
          >
            {t('save')}
          </Button>
        </div>
      </form>
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
    const { password, passwordConfirmation = '', onChange } = this.props;

    onChange(e);

    if (passwordError) {
      this.onBlur(e);
    }

    const { name, value } = e.currentTarget;

    if (passwordConfirmation.length) {
      if (name === 'passwordConfirmation') {
        this.setState({
          passwordConfirmationError: password !== value
        });

        return;
      }

      if (name === 'password') {
        this.setState({
          passwordConfirmationError: passwordConfirmation !== value
        });

        return;
      }
    }
  }

  private onBlur = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value = '' } = e.currentTarget;

    this.setState({
      passwordError: value.length < MIN_PASSWORD_LENGTH
    });
  }

  private onSubmit = (e: FormEvent<HTMLButtonElement | HTMLFormElement>): void => {
    e.preventDefault();

    if (this.allFieldsValid) {
      const { clickNext } = this.props;

      clickNext(e as FormEvent<HTMLButtonElement>);
    }
  }

  private togglePasswordVisibility = (): void => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  }

  private togglePasswordConfirmationVisibility = (): void => {
    this.setState(prevState => ({
      showPasswordConfirmation: !prevState.showPasswordConfirmation
    }));
  }
}

export const PasswordForm = withNamespaces()(PasswordFormComponent);
