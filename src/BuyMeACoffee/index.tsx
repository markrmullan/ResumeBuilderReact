import React, { PureComponent } from 'react';

import { Button, Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { Col, Container, Row } from 'react-bootstrap';
import { Trans, WithNamespaces, withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

import { FadeIn } from 'common/FadeIn';
import { DonateWithPayPal } from './DonateWithPayPal';

import styles from './styles.module.scss';

type DivRef = string & React.Ref<HTMLDivElement>;

type TComponentProps = WithNamespaces & RouteComponentProps;

class BuyMeACoffeeComponent extends PureComponent<TComponentProps> {
  public render() {
    const { t } = this.props;

    return (
      <Container fluid className={styles.container}>
        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                <Typography variant="h3" paragraph>
                  {t('coffee.support')}
                </Typography>
              </Col>
            </Row>
          )}
        </FadeIn>

        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                <Typography paragraph>
                  {t('coffee.hi_im_mark')}
                </Typography>
              </Col>
            </Row>
          )}
        </FadeIn>

        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                <Typography paragraph>
                  {t('coffee.payment_is_optional')}
                </Typography>
              </Col>
            </Row>
          )}
        </FadeIn>

        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                <Typography paragraph>
                  <Trans i18nKey="coffee.paypal_or_venmo">
                    If you would like to buy me a coffee, you can use the PayPal donation link below, or Venmo me <a href="https://venmo.com/Mark-Mullan" target="_blank" rel="noopener noreferrer">{{ venmoLink: '@mark-mullan' }}</a>.
                    Not only will you earn my eternal gratitude, I'll also write you a Thank You note! If you change your mind within 30 days, <a href="mailto:mark@easy-resu.me">send me an email</a>, and you can get a refund.
                  </Trans>
                </Typography>
              </Col>
            </Row>
          )}
        </FadeIn>

        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }} className={styles.paypalCol}>
                <DonateWithPayPal />
              </Col>
            </Row>
          )}
        </FadeIn>

        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                <Typography paragraph>
                  <Trans i18nKey="coffee.other_ways_to_support">
                    There are many other ways to support EasyResume. You can tell your friends and family about this website, or share us on social media.
                    If you would like to become a corporate sponsor, support product development, translate the website into another language, or leverage
                    your other awesome abilities, send me an email at <a href="mailto:mark@easy-resu.me">mark@easy-resu.me</a>.
                  </Trans>
                </Typography>
              </Col>
            </Row>
          )}
        </FadeIn>

        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                <Typography paragraph>
                  <Trans i18nKey="coffee.connect_with_me">
                    When I'm not improving (or breaking) this website, you can find me playing video games, playing board games, or writing
                    code at <a href="https://www.clover.com/careers" target="_blank" rel="noopener noreferrer">Clover</a>. Connect with me
                    <a href="https://www.linkedin.com/in/markrmullan/" target="_blank" rel="noopener noreferrer">on LinkedIn</a>, and let's
                    keep in touch.
                  </Trans>
                </Typography>
              </Col>
            </Row>
          )}
        </FadeIn>

        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }} className={styles.backContainer}>
                <Button color="primary" onClick={this.redirectHome}>
                  <ArrowBack className={styles.arrow} />
                  <Typography>
                    {t('coffee.back_to_home_page')}
                  </Typography>
                </Button>
              </Col>
            </Row>
          )}
        </FadeIn>
      </Container>
    );
  }

  private redirectHome = (): void => {
    const { history } = this.props;

    history.push('/');
  }
}

export const BuyMeACoffee = withNamespaces()(withRouter(BuyMeACoffeeComponent));
