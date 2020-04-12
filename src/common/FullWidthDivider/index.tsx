import React, { SFC } from 'react';

import { Divider } from '@material-ui/core';

import styles from './styles.module.scss';

export const FullWidthDivider: SFC = () => (
  <Divider className={styles.fullWidthDivider} />
);
