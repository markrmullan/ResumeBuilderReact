import React, { FormEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import Button from '@material/react-button';
import TextField, { HelperText, Input } from '@material/react-text-field';

import { AT_LEAST_ONE_CHARACTER } from 'utils/regex';

import styles from '../styles.module.scss';

type TOwnProps = {
  firstName: string;
  lastName: string;
  clickNext: () => void;
  clickPrev: () => void;
  onChange: (e: FormEvent<HTMLTextAreaElement>) => void;
};

type TComponentProps = TOwnProps & WithNamespaces;

class NameFormComponent extends PureComponent<TComponentProps> {
  public render() {
    const { clickPrev, clickNext, firstName, lastName, onChange, t } = this.props;

    return (
      <div className={styles.formFunnel}>
        <h1 className={styles.h1}>
          {t('add_your_name')}
        </h1>

        <p className={styles.p}>
          {t('great_choice_now_add_name')}
        </p>

        <div className={styles.fields}>
          <TextField
            label={t('first_name')}
            helperText={
              <HelperText
                isValidationMessage={true}
                validation={true}
              >
                {t('cannot_be_blank')}
              </HelperText>}
          >
            <Input
              id="firstName"
              name="firstName"
              required={true}
              pattern={AT_LEAST_ONE_CHARACTER.source}
              value={firstName}
              onChange={e => onChange(e)}
            />
          </TextField>

          <TextField
            label={t('last_name')}
            helperText={
              <HelperText
                isValidationMessage={true}
                validation={true}
              >
                {t('cannot_be_blank')}
              </HelperText>}
          >
            <Input
              id="lastName"
              name="lastName"
              required={true}
              pattern={AT_LEAST_ONE_CHARACTER.source}
              value={lastName}
              onChange={e => onChange(e)}
            />
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
    const { firstName, lastName } = this.props;

    return AT_LEAST_ONE_CHARACTER.test(firstName) &&
      AT_LEAST_ONE_CHARACTER.test(lastName);
  }
}

export const NameForm = withNamespaces()(NameFormComponent);
