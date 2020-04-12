import React, { ChangeEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { Grid, TextField } from '@material-ui/core';

import { CurrentUserContextImpl } from 'utils/contexts';
import { Resume } from 'utils/models';
import { fetchResume } from 'utils/requests';

import styles from './styles.module.scss';

type PathParams = {
  rId: Uuid;
};

type TComponentState = {
  resume: Resume;
};

type TComponentProps = RouteComponentProps<PathParams> & WithNamespaces;

class EditResumeComponent extends PureComponent<TComponentProps, TComponentState> {
  public static contextType = CurrentUserContextImpl;
  public state = {
    resume: {} as Resume
  };

  public render() {
    const { t } = this.props;
    const { updateUser, user } = this.context;
    const { email = '', firstName = '', lastName = '', phoneNumber = '' } = user;
    const { resume } = this.state;
    const { jobTitle = '' } = resume;

    return (
      <div className={styles.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3>{t('personal_information')}</h3>
          </Grid>
          <Grid container item spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                label={t('job_title')}
                fullWidth
                placeholder="e.g. Teacher"
                name="jobTitle"
                value={jobTitle}
                onChange={e => this.onChange(e)}
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                variant="outlined"
                label={t('first_name')}
                fullWidth
                InputLabelProps={{ shrink: !!firstName.length }}
                value={firstName}
                onChange={e => updateUser({ ...user, firstName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                variant="outlined"
                label={t('last_name')}
                fullWidth
                InputLabelProps={{ shrink: !!lastName.length }}
                value={lastName}
                onChange={e => updateUser({ ...user, lastName: e.target.value })}
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                variant="outlined"
                label={t('email')}
                fullWidth
                InputLabelProps={{ shrink: !!email.length }}
                value={email}
                onChange={e => updateUser({ ...user, email: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                variant="outlined"
                label={t('phone')}
                fullWidth
                InputLabelProps={{ shrink: !!phoneNumber.length }}
                value={phoneNumber}
                inputMode="tel"
                onChange={e => updateUser({ ...user, phoneNumber: e.target.value })} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <h3>{t('professional_experience')}</h3>
          </Grid>
        </Grid>
      </div>
    );
  }

  public async componentDidMount() {
    const { rId: resumeId } = this.props.match.params;

    const resume: Resume = await fetchResume(resumeId);
    this.setState({ resume });
  }

  private onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { resume } = this.state;
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({
      resume: {
        ...resume,
        [name]: value
      }
    } as TComponentState);
  }
}

export const EditResume = withNamespaces()(EditResumeComponent);