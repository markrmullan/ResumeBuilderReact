import React, { PureComponent } from 'react';

import { Typography } from '@material-ui/core';
import { Col, Container, Row } from 'react-bootstrap';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { FadeIn } from 'common/FadeIn';

import styles from './styles.module.scss';

type DivRef = string & React.Ref<HTMLDivElement>;

type TComponentProps = WithNamespaces;

class BuyMeACoffeeComponent extends PureComponent<TComponentProps> {
  public render() {
    return (
      <Container fluid className={styles.container}>
        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                <Typography variant="h3" paragraph>
                  Support
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
                  Hi, I'm Mark. Thanks for visiting EasyResume; I hope you found it useful.
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
                  Payment is optional — yes, you can use EasyResume 100% for free. There's no premium version, there's no catch. This tool should be available to everyone whether or not they can afford it. Sometimes, those who need this service the most are the least able to pay for it.
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
                  If you would like to buy me a coffee, you can use the PayPal donation link below, or Venmo me <a href="https://venmo.com/Mark-Mullan" target="_blank" rel="noopener noreferrer">@mark-mullan</a>. Not only will you earn my eternal gratitude, I'll also write you a Thank You note! If you change your mind, send me an email, and you can get a refund.
                </Typography>
              </Col>
            </Row>
          )}
        </FadeIn>

        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }} className={styles.paypalCol}>
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                  <input type="hidden" name="cmd" value="_s-xclick" />
                  <input type="hidden" name="hosted_button_id" value="XCKWJYXZK7DLN" />
                  <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                  <img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                </form>
              </Col>
            </Row>
          )}
        </FadeIn>

        <FadeIn>
          {({ className, ref }: { className: string; ref: DivRef }) => (
            <Row className={className} ref={ref}>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                <Typography paragraph>
                  There are many other ways to support EasyResume. You can tell your friends and family about this website, or share us on social media. If you would like to become a corporate sponsor, support product development, translate the website into another language, or leverage your other awesome abilities, send me an email.
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
                  When I'm not improving (or breaking) this website, you can find me playing video games, playing board games, or writing code at <a href="https://www.clover.com/careers" target="_blank" rel="noopener noreferrer">Clover</a>. Connect with me <a href="https://www.linkedin.com/in/markrmullan/" target="_blank" rel="noopener noreferrer">on LinkedIn</a>, and let's keep in touch.
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
