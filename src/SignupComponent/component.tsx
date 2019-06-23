import { AxiosResponse } from 'axios';
import React, { FormEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { Link, RouteComponentProps } from 'react-router-dom';

import { ConnectSocialProfile } from 'SignupComponent/ConnectSocialProfile/component';
import { ContactInformationForm } from 'SignupComponent/ContactInformationForm/component';
import { NameForm } from 'SignupComponent/NameForm/component';
import { PasswordForm } from 'SignupComponent/PasswordForm/component';
import classnames from 'classnames';
import { Modal } from 'common/Modal/component';

import { post } from 'utils/api';
import { MIN_PASSWORD_LENGTH } from 'utils/constants';
import { Resume, User } from 'utils/models';
import { EMAIL_REQUIRED } from 'utils/regex';

import styles from './styles.module.scss';

type SignupField = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phoneNumber: string;
};

type Errors = {
  errors: {
    email: string[];
    password: string[];
  };
};

type TComponentState = {
  currentPage: number;
  funnelIsOpen: boolean;
};

type TComponentProps = RouteComponentProps & WithNamespaces;
type SignupStateWithErrors = SignupField & Errors & TComponentState;

class Signup extends PureComponent<TComponentProps, SignupStateWithErrors> {
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
    firstName: '',
    lastName: '',
    errors: Signup.getDefaultErrors().errors,
    funnelIsOpen: true,
    currentPage: 1,
    password: '',
    passwordConfirmation: '',
    phoneNumber: ''
  };

  public render() {
    const { t } = this.props;
    const { currentPage, email, errors, firstName, lastName, password, passwordConfirmation, phoneNumber, funnelIsOpen } = this.state;

    const className = classnames(styles.funnelContainer, styles[`funnelStage${currentPage}`]);

    return (
      <Modal
        isOpen={funnelIsOpen}
      >
        <div className={className}>
          <ConnectSocialProfile
            onConnectWithFacebook={this.onConnectWithFacebook}
            clickNext={() => this.clickNext()}
          />
          <NameForm
            clickPrev={() => this.clickPrev()}
            clickNext={() => this.clickNext()}
            firstName={firstName}
            lastName={lastName}
            onChange={e => this.onChange(e)}
          />
          <ContactInformationForm
            email={email}
            phoneNumber={phoneNumber}
            errors={errors}
            onChange={e => this.onChange(e)}
            clickPrev={() => this.clickPrev()}
            clickNext={() => this.clickNext()}
          />
          <PasswordForm
            password={password}
            passwordConfirmation={passwordConfirmation}
            errors={errors}
            onChange={e => this.onChange(e)}
            clickPrev={() => this.clickPrev()}
            clickNext={e => this.submit(e)}
          />
        </div>

        <p className={styles.p}>
          <span>{t('already_have_account')}</span>
          <Link to="login">
            {t('log_in')}
          </Link>
        </p>
      </Modal>
    );
  }

  public onChange(e: FormEvent<HTMLTextAreaElement>): void {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({
      [name]: value,
      errors: Signup.getDefaultErrors().errors
    } as SignupStateWithErrors);
  }

  public clickNext(): void {
    this.setState(prevState => ({
      currentPage: prevState.currentPage + 1
    }));
  }

  public clickPrev(): void {
    this.setState(prevState => ({
      currentPage: prevState.currentPage - 1
    }));
  }

  public submit = (e: FormEvent<HTMLButtonElement>): void => {
    if (this.allFieldsValid) {
      this.clearErrors();
      e.preventDefault();
      this.tryCreateUser();
    }
  }

  private tryCreateUser = async (): Promise<void> => {
    const { history } = this.props;
    const { email, firstName, lastName, phoneNumber, password } = this.state;
    const user: User = { email, firstName, lastName, phoneNumber, password };

    try {
      await post({}, { user });
      const resume: Resume = await this.createFirstResume();
      history.push(`/resumes/${resume.uuid}/edit`);
    } catch ({ response }) {
      this.setState({
        errors: {
          ...Signup.getDefaultErrors().errors,
          ...response.data.errors
        },
        currentPage: 3
      });
    }
  }

  private createFirstResume = async(): Promise<Resume> => {
    const { t } = this.props;

    const response: AxiosResponse<Resume> = await post({ baseResource: 'resumes' }, { cv: { name: t('untitled') } });

    return response.data;
  }

  private clearErrors = (): void => {
    this.setState({
      errors: Signup.getDefaultErrors().errors
    });
  }

  private onConnectWithFacebook = (response: any) => {
    if (response.id) {
      this.setState(prevState => ({
        currentPage: prevState.currentPage + 1,
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email
      }));
    }
  }
}

export const SignupComponent = withNamespaces()(Signup);
