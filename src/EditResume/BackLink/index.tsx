import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import { deepPurple } from '@material-ui/core/colors';
import { ArrowBackRounded } from '@material-ui/icons';
import classnames from 'classnames';

import styles from '../styles.module.scss';

type BackLinkProps = {
  isMobilePreviewEnabled: boolean;
};

export class BackLink extends PureComponent<BackLinkProps> {
  public render() {
    const { isMobilePreviewEnabled } = this.props;

    return (
      <Link to="/dashboard" className={classnames(styles.back, { [styles.previewMode]: isMobilePreviewEnabled })}>
        <ArrowBackRounded fontSize="large" style={{ color: deepPurple[500] }} />
      </Link>
    );
  }
}
