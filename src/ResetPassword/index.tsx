import React, { FormEvent, PureComponent } from 'react';

import { Button, InputAdornment, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import classnames from 'classnames';
import { parse } from 'query-string';
import { Col, Container, Row } from 'react-bootstrap';
import { Trans, WithNamespaces, withNamespaces } from 'react-i18next';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Alert } from 'common/Alert';
import { TextField } from 'common/TextField';
import { MIN_PASSWORD_LENGTH } from 'utils/constants';
import { resetPassword } from 'utils/requests';

import styles from './styles.module.scss';

type TComponentProps = WithNamespaces & RouteComponentProps;

type TComponentState = {
  errors: Record<string, string[]>;
  isPending: boolean;
  password: string;
  passwordConfirmation: string;
  passwordError: boolean;
  passwordConfirmationError: boolean;
  resetPasswordToken: string;
  showPassword: boolean;
  showPasswordConfirmation: boolean;
  showErrorAlert: boolean;
  showSuccessAlert: boolean;
};

class ResetPasswordComponent extends PureComponent<TComponentProps, TComponentState> {
  public constructor(props: TComponentProps) {
    super(props);

    const qps = parse(props.location.search);
    const { reset_password_token: resetPasswordToken } = qps;

    if (typeof resetPasswordToken !== 'string' || !resetPasswordToken) {
      props.history.push('/login');
    }

    this.state = {
      errors: {},
      isPending: false,
      password: '',
      passwordConfirmation: '',
      passwordError: false,
      passwordConfirmationError: false,
      resetPasswordToken: resetPasswordToken as string,
      showPassword: false,
      showPasswordConfirmation: false,
      showErrorAlert: false,
      showSuccessAlert: false
    };
  }

  public render() {
    const { t } = this.props;
    const { errors = {}, isPending, password = '', passwordConfirmation = '', passwordError, passwordConfirmationError, showPassword, showPasswordConfirmation, showSuccessAlert } = this.state;

    const errorKeys = Object.keys(errors);

    return (
      <Container>
        {!!errorKeys.length &&
          <Alert
            className={styles.alert}
            severity="error"
            onClose={this.dismissError}
          >
            {this.getErrorMessage()}
          </Alert>
        }

        {showSuccessAlert &&
          <Alert
            className={styles.alert}
            severity="success"
            onClose={this.dismissSuccessAlert}
          >
            <Trans i18nKey="password_reset_success">
              Password successfully reset. <Link to="/login" className={styles.link}>Log in now</Link>.
            </Trans>
          </Alert>
        }

        <Container>
          <Container className={styles.container}>
            <Row>
              <Col>
                <Typography color="primary" variant="h4" align="center">
                  {t('set_your_new_password')}
                </Typography>
              </Col>
            </Row>

            <Row>
              <Col>
                <Typography paragraph variant="subtitle2" align="center">
                  {t('create_a_new_password_at_least_num_characters', { num: MIN_PASSWORD_LENGTH })}
                </Typography>
              </Col>
            </Row>

            <Row>
              <Col>
                <TextField
                  label={t('create_a_password')}
                  id="password"
                  error={passwordError}
                  helperText={passwordError && t('validation.minimum_characters_with_count', { count: MIN_PASSWORD_LENGTH })}
                  name="password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={this.onChange}
                  onBlur={this.onBlur}
                  className={classnames(styles.textField, { [styles.helperTextActive]: passwordError })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" style={{ color: grey[400] }}>
                        {showPassword ? <VisibilityOff className={styles.vis} onClick={this.togglePasswordVisibility} /> : <Visibility className={styles.vis} onClick={this.togglePasswordVisibility} />}
                      </InputAdornment>
                    )
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col>
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
                  className={classnames(styles.textField, { [styles.helperTextActive]: passwordConfirmationError })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" style={{ color: grey[400] }}>
                        {showPasswordConfirmation ? <VisibilityOff className={styles.vis} onClick={this.togglePasswordConfirmationVisibility} /> : <Visibility className={styles.vis} onClick={this.togglePasswordConfirmationVisibility} />}
                      </InputAdornment>
                    )
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  disabled={isPending || !this.allFieldsValid}
                  onClick={this.onSubmit}
                >
                  {t('submit')}
                </Button>
              </Col>
            </Row>
          </Container>
        </Container>
      </Container>
    );
  }

  private get allFieldsValid(): boolean {
    const { password, passwordConfirmation } = this.state;

    return !!password &&
      password.length >= MIN_PASSWORD_LENGTH &&
      password === passwordConfirmation;
  }

  private onChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({
      [name]: value
    } as unknown as TComponentState, () => {
      const { password, passwordConfirmation = '', passwordError } = this.state;

      if (passwordError) {
        this.onBlur(e);
      }

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
    });
  }

  private onBlur = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value = '' } = e.currentTarget;

    this.setState({
      passwordError: value.length < MIN_PASSWORD_LENGTH
    });
  }

  private togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  }

  private togglePasswordConfirmationVisibility = () => {
    this.setState(prevState => ({
      showPasswordConfirmation: !prevState.showPasswordConfirmation
    }));
  }

  private onSubmit = () => {
    if (this.allFieldsValid) {
      this.setState({
        isPending: true
      }, () => {
        const { password, resetPasswordToken } = this.state;

        resetPassword({ password, resetPasswordToken })
          .then(_ => {
            this.setState({
              isPending: false,
              showSuccessAlert: true
            });
          })
          .catch(({ response }) => {
            this.setState({
              isPending: false,
              errors: response.data.errors
            });
          })
          ;
      });
    }
  }

  private dismissSuccessAlert = () => this.setState({ showSuccessAlert: false });

  private dismissError = () => this.setState({ showErrorAlert: false });

  private getErrorMessage = () => {
    const { errors = {} } = this.state;

    if (errors.resetPasswordToken) {
      return (
        <Trans i18nKey="reset_password_token_invalid">
          Reset password token is either expired or invalid. Request a new password reset link <Link className={styles.link} to="/forgot-password">here</Link>.
        </Trans>
      );
    }

    return (
      <Trans i18nKey="generic_request_new_pw_reset">
        Something went wrong. Request a new password reset link <Link className={styles.link} to="/forgot-password">here</Link>.
      </Trans>
    );
  }
}

export const ResetPassword = withNamespaces()(ResetPasswordComponent);
