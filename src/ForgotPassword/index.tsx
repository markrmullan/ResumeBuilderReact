import React, { FormEvent, PureComponent } from 'react';

import { Button, Typography } from '@material-ui/core';
import classnames from 'classnames';
import { Col, Container, Row } from 'react-bootstrap';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Alert } from 'common/Alert';
import { TextField } from 'common/TextField';
import { EMAIL_REQUIRED } from 'utils/regex';
import { createPasswordResetEmail } from 'utils/requests';

import styles from './styles.module.scss';

type TComponentProps = WithNamespaces;

type TComponentState = {
  email: string;
  emailSentTo: string;
  isPending: boolean;
  showSuccessAlert: boolean;
};

class ForgotPasswordComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    email: '',
    emailSentTo: '',
    isPending: false,
    showSuccessAlert: false
  };

  public render() {
    const { t } = this.props;
    const { email = '', emailSentTo = '', isPending, showSuccessAlert } = this.state;

    return (
      <Container>
        {showSuccessAlert &&
          <Alert severity="success" onClose={this.dismissSuccessAlert} className={styles.alert}>
            {t('we_sent_a_password_reset_email_to', { email: emailSentTo })}
          </Alert>
        }

        <Container className={classnames(styles.container, { [styles.compact]: showSuccessAlert })}>
          <Row className={styles.title}>
            <Col>
              <Typography color="primary" variant="h4" align="center">
                {t('forgot_your_password')}
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col>
              <Typography paragraph variant="subtitle2" align="center">
                {t('we_will_send_reset_link')}
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col>
              <TextField
                variant="filled"
                label={t('email')}
                name="email"
                value={email}
                onChange={this.onChange}
                disabled={isPending}
              />
            </Col>
          </Row>

          <Row className={styles.buttonRow}>
            <Col>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                disabled={isPending || !this.isEmailValid()}
                onClick={this.onSubmit}
              >
                {t('send')}
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }

  private onChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({
      [name]: value
    } as unknown as TComponentState);
  }

  private isEmailValid = () => {
    const { email } = this.state;

    return EMAIL_REQUIRED.test(email);
  }

  private onSubmit = async () => {
    if (this.isEmailValid()) {
      const { email } = this.state;

      this.setState({
        isPending: true
      });

      try {
        await createPasswordResetEmail({ email });
      } finally {
        this.setState({
          emailSentTo: email,
          isPending: false,
          showSuccessAlert: true
        });
      }
    }
  }

  private dismissSuccessAlert = () => {
    this.setState({ showSuccessAlert: false });
  }
}

export const ForgotPassword = withNamespaces()(ForgotPasswordComponent);
