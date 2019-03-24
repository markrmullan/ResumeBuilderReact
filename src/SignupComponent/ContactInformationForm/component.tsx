import React, { FormEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import Button from '@material/react-button';
import TextField, { HelperText, Input } from '@material/react-text-field';

import { ANYTHING, EMAIL_REQUIRED } from 'utils/regex';

import styles from '../styles.module.scss';

const MAX_PHONE_LENGTH: number = 127;

type TOwnProps = {
  email: string;
  phoneNumber: string;
  errors: {
    email: string[];
  };
  onChange: (e: FormEvent<HTMLTextAreaElement>) => void;
  clickNext: () => void;
  clickPrev: () => void;
};

type TComponentProps = TOwnProps & WithNamespaces;

class ContactInformationFormComponent extends PureComponent<TComponentProps> {
  public render() {
    const { clickNext, clickPrev, email, errors, phoneNumber, onChange, t } = this.props;

    return (
      <div className={styles.formFunnel}>
        <h1 className={styles.h1}>
          {t('enter_contact_information')}
        </h1>

        <p className={styles.p}>
          {t('allow_employers_to_contact_you')}
        </p>

        <div className={styles.fields}>
          <TextField
            label={t('phone_number')}
            helperText={
              <HelperText isValidationMessage={true} validation={true}>
                {t('character_limit_reached_plural', { count: MAX_PHONE_LENGTH })}
              </HelperText>}
          >
            <Input
              id="phoneNumber"
              name="phoneNumber"
              pattern={ANYTHING.source}
              maxLength={MAX_PHONE_LENGTH}
              value={phoneNumber}
              onChange={e => onChange(e)}/>
          </TextField>

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
              onChange={e => onChange(e)}/>
          </TextField>
        </div>

        <div className={styles.buttonContainer}>
          <Button
            outlined={true}
            onClick={clickPrev}
          >
            {t('back')}
          </Button>
          <Button
            raised={true}
            onClick={clickNext}
            disabled={!this.allFieldsValid}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    );
  }

  private get allFieldsValid(): boolean {
    const { email } = this.props;

    return EMAIL_REQUIRED.test(email);
  }
}

export const ContactInformationForm = withNamespaces()(ContactInformationFormComponent);
