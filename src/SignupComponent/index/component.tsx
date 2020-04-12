import React, { FormEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Button } from '@material-ui/core';
import TextField, { HelperText, Input } from '@material/react-text-field';
import AsyncButton from 'react-async-button';

import { MIN_PASSWORD_LENGTH } from 'utils/constants';

import styles from '../styles.module.scss';

type TOwnProps = {
  password: string;
  passwordConfirmation: string;
  clickNext: (e: React.FormEvent<HTMLButtonElement>) => void;
  clickPrev: () => void;
  onChange: (e: FormEvent<HTMLTextAreaElement>) => void;
  errors: {
    password: string[];
  };
};

type TComponentProps = TOwnProps & WithNamespaces;

class PasswordFormComponent extends PureComponent<TComponentProps> {
  public render() {
    const { errors, password, passwordConfirmation, clickNext, clickPrev, onChange, t } = this.props;

    return (
      <div className={styles.formFunnel}>
        <h1 className={styles.h1}>
          {t('create_a_password')}
        </h1>

        <p className={styles.p}>
          {t('access_your_resume_any_time')}
        </p>

        <div className={styles.fields}>
          <TextField
            label={t('create_a_password')}
            helperText={
              <HelperText validation>
                {errors.password[0] || t('validation.minimum_characters_with_count', { count: MIN_PASSWORD_LENGTH })}
              </HelperText>}
          >
            <Input
              id="password"
              minLength={MIN_PASSWORD_LENGTH}
              name="password"
              required
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={e => onChange(e)}/>
          </TextField>

          <TextField
            label={t('confirm_password')}
            helperText={
              <HelperText validation>
                {t('validation.passwords_do_not_match')}
              </HelperText>}
          >
            <Input
              pattern={`^${password}$`}
              id="password-confirmation"
              name="passwordConfirmation"
              required
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={e => onChange(e)}/>
          </TextField>
        </div>

        <div className={styles.buttonContainer}>
          <Button
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
}

export const PasswordForm = withNamespaces()(PasswordFormComponent);
