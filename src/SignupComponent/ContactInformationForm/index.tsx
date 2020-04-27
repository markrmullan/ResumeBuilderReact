import React, { FormEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Button } from '@material-ui/core';
import classnames from 'classnames';
import { TextField } from 'common/TextField';

import { EMAIL_REQUIRED } from 'utils/regex';

import signupStyles from '../styles.module.scss';

type TOwnProps = {
  email: string;
  phoneNumber: string;
  errors: {
    email: string[];
  };
  onChange: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  clickNext: () => void;
  clickPrev: () => void;
};

type TComponentProps = TOwnProps & WithNamespaces;

type TComponentState = {
  emailError: boolean;
};

class ContactInformationFormComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    emailError: false
  };

  public render() {
    const { clickNext, clickPrev, email, errors, phoneNumber, t } = this.props;
    const { emailError } = this.state;

    return (
      <div className={signupStyles.formFunnel}>
        <h1 className={signupStyles.h1}>
          {t('enter_contact_information')}
        </h1>

        <p className={signupStyles.p}>
          {t('allow_employers_to_contact_you')}
        </p>

        <div className={signupStyles.fields}>
          <TextField
            label={t('phone_number')}
            name="phoneNumber"
            value={phoneNumber}
            onChange={this.onChange}
            className={signupStyles.textField}
          />

          <TextField
            label={t('email')}
            error={!!errors.email[0] || emailError}
            helperText={errors.email[0] || emailError && t('validation.invalid_email')}
            name="email"
            value={email}
            onChange={this.onChange}
            onBlur={this.onBlur}
            className={classnames(signupStyles.textField, { [signupStyles.helperTextActive]: !!errors.email[0] || emailError })}
          />
        </div>

        <div className={signupStyles.buttonContainer}>
          <Button
            onClick={clickPrev}
            variant="outlined"
            color="primary"
          >
            {t('back')}
          </Button>
          <Button
            onClick={clickNext}
            disabled={!this.allFieldsValid}
            color="primary"
            variant="contained"
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

  private onChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { onChange } = this.props;

    onChange(e);
    if (this.state.emailError) {
      this.onBlur(e);
    }
  }

  private onBlur = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({
      [`${name}Error`]: !EMAIL_REQUIRED.test(value)
    } as TComponentState);
  }
}

export const ContactInformationForm = withNamespaces()(ContactInformationFormComponent);
