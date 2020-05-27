import React, { PureComponent } from 'react';

import { Button, Divider, Typography } from '@material-ui/core';
import classnames from 'classnames';
import { Col, Container, Row } from 'react-bootstrap';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

import { Footer } from 'Footer';
import { Alert } from 'common/Alert';
import { Card } from 'common/Card';
import { FadeIn } from 'common/FadeIn';
import { CurrentUserContextImpl } from 'utils/contexts';

import resumeWireframe from 'common/assets/resume_wireframe.svg';
import sampleResume from './sample_resume.svg';
import styles from './styles.module.scss';

type DivRef = string & React.Ref<HTMLDivElement>;

type TComponentProps = WithNamespaces & RouteComponentProps;

type TComponentState = {
  isCovidAlertDismissed: boolean;
};

class HomePageComponent extends PureComponent<TComponentProps, TComponentState> {
  public static contextType = CurrentUserContextImpl;

  public state = {
    isCovidAlertDismissed: !!localStorage.getItem('isCovidAlertDismissed')
  };

  public render() {
    const { isCovidAlertDismissed } = this.state;
    const { t } = this.props;

    return (
      <div className={styles.outerContainer}>
        <Container fluid className={classnames(styles.primaryContainer, { [styles.alertDismissed]: isCovidAlertDismissed })}>
          {!isCovidAlertDismissed &&
            <Row>
              <FadeIn>
                {({ className, ref }: { className: string; ref: DivRef }) => (
                  <Col ref={ref} className={className}>
                    <Alert className={styles.alert} onClose={this.dismissAlert}>
                      {t('covid_response.offering_for_free')}
                    </Alert>
                  </Col>
                )}
              </FadeIn>
            </Row>
          }

          <Row className={classnames({ [styles.extraMargin]: !isCovidAlertDismissed })}>
            <Col>
              <FadeIn>
                {({ className, ref }: { className: string; ref: React.Ref<HTMLElement> }) => (
                  <Typography ref={ref} variant="h4" align="center" className={classnames(styles.text, styles.heroText, className, styles.delayed)}>
                    {t('home_page.build_your_professional_resume_in_10')}
                  </Typography>
                )}
              </FadeIn>
            </Col>
          </Row>

          <FadeIn>
            {({ className, ref }: { className: string; ref: DivRef }) => (
              <Row className={className} ref={ref}>
                <Col>
                  <p className={styles.text}>
                    {t('home_page.make_your_resume_stand_out')}
                  </p>
                </Col>
              </Row>
            )}
          </FadeIn>

          <FadeIn>
            {({ className, ref }: { className: string; ref: DivRef }) => (
              <Row className={className} ref={ref}>
                <Col className={styles.ctaContainer}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.redirectToSignup}
                    fullWidth
                    size="large"
                    >
                    {t('home_page.start_now')}
                  </Button>
                </Col>
              </Row>
            )}
          </FadeIn>

          <FadeIn>
            {({ className, ref }: { className: string; ref: DivRef }) => (
              <Row className={className} ref={ref}>
                <Col className={styles.resumeCol}>
                  <Card className={styles.resumeCard} variant="outlined">
                    <img
                      src={sampleResume}
                      className={styles.resume}
                      alt={t('image_of_sample_resume')}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </FadeIn>

          <Divider className={styles.divider} />
        </Container>

        <Container>
          <FadeIn>
            {({ className, ref }: { className: string; ref: DivRef }) => (
              <Row className={className} ref={ref}>
                <Col className={styles.resumeWireframeContainer}>
                  <img
                    className={styles.resumeWireframe}
                    src={resumeWireframe}
                    alt=""
                  />
                </Col>
              </Row>
            )}
          </FadeIn>

          <Row>
            <Col>
              <FadeIn>
                {({ className, ref }: { className: string; ref: React.Ref<HTMLElement> }) => (
                  <Typography ref={ref} variant="h4" align="center" className={classnames(styles.text, styles.heroText, className)}>
                    {t('home_page.download_your_resume_as_pdf')}
                  </Typography>
                )}
              </FadeIn>
            </Col>
          </Row>

          <FadeIn>
            {({ className, ref }: { className: string; ref: DivRef }) => (
              <Row className={className} ref={ref}>
                <Col>
                  <p className={styles.text}>
                    {t('home_page.instantly_download_completed_resume')}
                  </p>
                </Col>
              </Row>
            )}
          </FadeIn>

          <FadeIn>
            {({ className, ref }: { className: string; ref: DivRef }) => (
              <Row className={className} ref={ref}>
                <Col className={styles.ctaContainer}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.redirectToSignup}
                    fullWidth
                    size="large"
                    >
                    {t('home_page.start_now')}
                  </Button>
                </Col>
              </Row>
            )}
          </FadeIn>
        </Container>

        <Footer />
      </div>
    );
  }

  private dismissAlert = (): void => {
    this.setState({ isCovidAlertDismissed: true });
    localStorage.setItem('isCovidAlertDismissed', 'true');
  }

  private redirectToSignup = (): void => {
    const { user = {} } = this.context;
    const { uuid: userId } = user;
    const { history } = this.props;

    if (userId) {
      return history.push('/dashboard');
    }

    history.push('/get-started');
  }
}

export const HomePage = withNamespaces()(withRouter(HomePageComponent));
