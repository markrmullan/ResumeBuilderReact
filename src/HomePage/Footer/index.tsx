import React, { PureComponent } from 'react';

import { Typography } from '@material-ui/core';
import { Col, Container, Row } from 'react-bootstrap';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import styles from './styles.module.scss';

type TComponentProps = WithNamespaces;

class FooterComponent extends PureComponent<TComponentProps> {
  public render() {
    const { t } = this.props;

    return (
      <Container fluid className={styles.container}>
        <Row>
          <Col>
            <Typography align="center" variant="subtitle1" className={styles.madeWith}>
              {t('home_page.made_with_muscle')}
            </Typography>
          </Col>
        </Row>
      </Container>
    );
  }
}

export const Footer = withNamespaces()(FooterComponent);
