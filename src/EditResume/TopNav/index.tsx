import React, { ChangeEvent, PureComponent } from 'react';

import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Paper } from 'common/Paper';
import { Tab } from 'common/Tab';
import { Tabs } from 'common/Tabs';

import styles from './styles.module.scss';

type TOwnProps = {
  handleChange: (event: ChangeEvent<{}>, value: any) => void;
  value: number;
};

type TComponentProps = TOwnProps & WithNamespaces;

class TopNavComponent extends PureComponent<TComponentProps> {
  public render() {
    const { handleChange, t, value } = this.props;

    return (
      <Paper className={styles.paper}>
        <Tabs
          onChange={handleChange as unknown as any}
          value={value}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab label={t('build')} />
          <Tab label={t('preview')} />
        </Tabs>
      </Paper>
    );
  }
}

export const TopNav = withNamespaces()(TopNavComponent);
