import React, { PureComponent } from 'react';

import { Typography } from '@material-ui/core';
import { Col, Container, Row } from 'react-bootstrap';
import { Trans, WithNamespaces, withNamespaces } from 'react-i18next';

import { FadeIn } from 'common/FadeIn';
import { DonateWithPayPal } from './DonateWithPayPal';

import styles from './styles.module.scss';

type DivRef = string & React.Ref<HTMLDivElement>;

type TComponentProps = WithNamespaces;

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
                  <Trans i18nKey='coffee.paypal_or_venmo'>
                    If you would like to buy me a coffee, you can use the PayPal donation link below, or Venmo me <a href="https://venmo.com/Mark-Mullan" target="_blank" rel="noopener noreferrer">{{ venmoLink: '@mark-mullan' }}</a>.
                    Not only will you earn my eternal gratitude, I'll also write you a Thank You note! If you change your mind, send me an email, and you can get a refund.
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
                  {t('coffee.other_ways_to_support')}
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
                  <Trans i18nKey='coffee.connect_with_me'>
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
      </Container>
    );
  }
}

export const BuyMeACoffee = withNamespaces()(BuyMeACoffeeComponent);
