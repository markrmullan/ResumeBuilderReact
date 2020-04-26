import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import { deepPurple } from '@material-ui/core/colors';
import { ArrowBackRounded } from '@material-ui/icons';

import styles from '../styles.module.scss';

export class BackLink extends PureComponent {
  public render() {
    return (
      <Link to="/dashboard" className={styles.back}>
        <ArrowBackRounded fontSize="large" style={{ color: deepPurple[500] }} />
      </Link>
    );
  }
}
