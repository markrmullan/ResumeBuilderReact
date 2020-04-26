import React, { PureComponent } from 'react';

import { Col, Row } from 'react-bootstrap';

import styles from '../styles.module.scss';

type SectionHeaderProps = {
  title: string;
};

export class SectionHeader extends PureComponent<SectionHeaderProps> {
  public render() {
    const { title } = this.props;

    return (
      <Row>
        <Col xs={12} className={styles.mb16}>
          <h3 className={styles.sectionHeader}>{title}</h3>
        </Col>
      </Row>
    );
  }
}
