import React, { SFC } from 'react';
import { Link } from 'react-router-dom';

import { deepPurple } from '@material-ui/core/colors';
import { ArrowBackRounded } from '@material-ui/icons';

import styles from '../styles.module.scss';

export const BackLink: SFC = () => (
  <Link to="/dashboard" className={styles.back}>
    <ArrowBackRounded fontSize="large" style={{ color: deepPurple[500] }} />
  </Link>
);
