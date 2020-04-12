import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { Grid, TextField } from '@material-ui/core';

import { CurrentUserContextImpl } from 'utils/contexts';

import styles from './styles.module.scss';

type RouteProps = {
  rId: Uuid;
};

type TComponentProps = RouteComponentProps<RouteProps> & WithNamespaces;

class EditResumeComponent extends PureComponent<TComponentProps> {
  public static contextType = CurrentUserContextImpl;

  public render() {
    const { match, t } = this.props;
    const { updateUser, user } = this.context;
    const { firstName = '', lastName = '' } = user;

    return (
      <div className={styles.container}>
        {match.params.rId}

        <Grid container>
          <h3>{t('personal_information')}</h3>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField label={t('first_name')} fullWidth InputLabelProps={{ shrink: !!firstName.length }} value={firstName} onChange={e => updateUser({ ...user, firstName: e.target.value })} />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField label={t('last_name')} fullWidth InputLabelProps={{ shrink: !!lastName.length }} value={lastName} onChange={e => updateUser({ ...user, lastName: e.target.value })} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export const EditResume = withNamespaces()(EditResumeComponent);
