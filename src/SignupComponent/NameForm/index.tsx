import React, { FormEvent, PureComponent } from 'react';

import { Button } from '@material-ui/core';
import classnames from 'classnames';
import { TextField } from 'common/TextField';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { AT_LEAST_ONE_CHARACTER } from 'utils/regex';

import signupStyles from '../styles.module.scss';

type TOwnProps = {
  firstName: string;
  lastName: string;
  clickNext: () => void;
  clickPrev: () => void;
  onChange: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

type TComponentProps = TOwnProps & WithNamespaces;

type TComponentState = {
  firstNameError: boolean;
  lastNameError: boolean;
};

class NameFormComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    firstNameError: false,
    lastNameError: false
  };

  public render() {
    const { clickPrev, clickNext, firstName, lastName, t } = this.props;
    const { firstNameError, lastNameError } = this.state;

    return (
      <div className={signupStyles.formFunnel}>
        <h1 className={signupStyles.h1}>
          {t('add_your_name')}
        </h1>

        <p className={signupStyles.p}>
          {t('start_by_adding_your_name')}
        </p>

        <div className={signupStyles.fields}>
          <TextField
            label={t('first_name')}
            helperText={firstNameError && t('cannot_be_blank')}
            error={firstNameError}
            onBlur={this.onChange}
            onChange={this.onChange}
            required
            name="firstName"
            value={firstName}
            className={classnames(signupStyles.textField, { [signupStyles.helperTextActive]: firstNameError })}
          />

          <TextField
            label={t('last_name')}
            helperText={lastNameError && t('cannot_be_blank')}
            error={lastNameError}
            onBlur={this.onChange}
            onChange={this.onChange}
            required
            name="lastName"
            value={lastName}
            className={classnames(signupStyles.textField, { [signupStyles.helperTextActive]: lastNameError })}
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
            variant="contained"
            color="primary"
          >
            {t('next')}
          </Button>
        </div>
      </div>
    );
  }

  private onChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { onChange } = this.props;
    const { name, value }: { name: string; value: string } = e.currentTarget;

    onChange(e);
    this.setState({
      [`${name}Error`]: !value
    } as TComponentState);
  }

  private get allFieldsValid(): boolean {
    const { firstName, lastName } = this.props;

    return AT_LEAST_ONE_CHARACTER.test(firstName) &&
      AT_LEAST_ONE_CHARACTER.test(lastName);
  }
}

export const NameForm = withNamespaces()(NameFormComponent);
