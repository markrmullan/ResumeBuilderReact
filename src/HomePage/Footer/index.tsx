import React, { PureComponent } from 'react';

import { Typography } from '@material-ui/core';
import { Col, Container, Row } from 'react-bootstrap';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';

import facebookIcon from './facebook-32.png';
import linkedinIcon from './linkedin-32.png';
import styles from './styles.module.scss';

type TComponentProps = WithNamespaces;

class FooterComponent extends PureComponent<TComponentProps> {
  public render() {
    const { t } = this.props;

    return (
      <Container fluid className={styles.container}>
        <Row>
          <Col>
            <Link to="/coffee">
              <Typography align="center" variant="h6" className={styles.footerLink}>
                Buy me a Coffee
              </Typography>
            </Link>
          </Col>
        </Row>

        <Row>
          <Col>
            <Typography align="center" variant="subtitle1" className={styles.madeWith}>
              {t('home_page.made_with_muscle')}
            </Typography>
          </Col>
        </Row>

        <Row>
          <Col className={styles.socialContainer}>
            <a
              href="https://www.linkedin.com/company/easy-resume-co"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className={styles.socialMediaIcon} src={linkedinIcon} alt={t('home_page.linkedin')} />
            </a>

            <a
              href="https://fb.me/easyresumeco"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className={styles.socialMediaIcon} src={facebookIcon} alt={t('home_page.facebook')} />
            </a>
          </Col>
        </Row>
      </Container>
    );
  }
}

export const Footer = withNamespaces()(FooterComponent);
