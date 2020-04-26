import React, { Fragment, PureComponent } from 'react';

import { Col, Row } from 'react-bootstrap';

import styles from '../../styles.module.scss';

type TComponentProps = {
  title: string;
  supportingInfo: string;
};

export class SectionHeaderAndSupportingInfo extends PureComponent<TComponentProps> {
  public render() {
    const { supportingInfo, title } = this.props;

    return (
      <Fragment>
        <Row>
          <Col xs={12}>
            <h3 className={styles.sectionHeader}>{title}</h3>
          </Col>
        </Row>
        <Row className={styles.mb16}>
          <Col xs={12}>
            <p className={styles.supportingInfo}>{supportingInfo}</p>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
