import React, { ChangeEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { Grid, TextField } from '@material-ui/core';
import { ResumeExperiences } from 'ResumeExperiences';

import { CurrentUserContextImpl } from 'utils/contexts';
import { Resume } from 'utils/models';
import { createWorkExperience, fetchResume } from 'utils/requests';

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
    const { match, t } = this.props;
    const { rId: resumeId } = match.params;
    const { user } = this.context;
    const { email = '', firstName = '', lastName = '', phoneNumber = '' } = user;
    const { resume } = this.state;
    const { experiences = [], jobTitle = '' } = resume;

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
                onChange={this.onChange}
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
                name="firstName"
                value={firstName}
                onChange={this.onUserChange}
                onBlur={this.patchCurrentUser}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                variant="outlined"
                label={t('last_name')}
                fullWidth
                InputLabelProps={{ shrink: !!lastName.length }}
                name="lastName"
                value={lastName}
                onChange={this.onUserChange}
                onBlur={this.patchCurrentUser}
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item xs={12} md={3}>
              {/* FIXME figure out how to persist email on change? or make this field RO?
                the email is used for sign-in so you'd need to check for uniqueness. Or,
                need to make the email field that appears on resumes different than the email
                used for your user account */}
              <TextField
                variant="outlined"
                label={t('email')}
                fullWidth
                InputLabelProps={{ shrink: !!email.length }}
                name="email"
                value={email}
                onChange={this.onUserChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                variant="outlined"
                label={t('phone')}
                fullWidth
                InputLabelProps={{ shrink: !!phoneNumber.length }}
                name="phoneNumber"
                value={phoneNumber}
                inputMode="tel"
                onChange={this.onUserChange}
                onBlur={this.patchCurrentUser}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <h3>{t('professional_experience')}</h3>
            <p className={styles.supportingInfo}>{t('professional_experience_supporting_info')}</p>
          </Grid>

          <ResumeExperiences
            createWorkExperience={this.createWorkExperience}
            onWorkExperienceChange={this.onWorkExperienceChange}
            onWorkExperienceDateChange={this.onWorkExperienceDateChange}
            experiences={experiences}
            resumeId={resumeId}
          />
        </Grid>
      </div>
    );
  }

  public async componentDidMount() {
    const { rId: resumeId } = this.props.match.params;

    const resume: Resume = await fetchResume(resumeId);
    this.setState({ resume });
  }

  private onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { resume } = this.state;
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({
      resume: {
        ...resume,
        [name]: value
      }
    } as TComponentState);
  }

  private createWorkExperience = async () => {
    const { rId: resumeId } = this.props.match.params;

    const experience = await createWorkExperience(resumeId);
    this.setState(({ resume }) => ({
      resume: {
        ...resume,
        experiences: [...resume.experiences, experience]
      }
    }));
  }

  private onWorkExperienceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, experienceId: Uuid): void => {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState(({ resume }) => ({
      resume: {
        ...resume,
        experiences: resume.experiences.map(exp => {
          if (exp.uuid === experienceId) {
            return {
              ...exp,
              [name]: value
            };
          }

          return exp;
        })
      }
    }));
  }

  private onWorkExperienceDateChange = (experienceId: Uuid, key: string, val: Date): void => {
    this.setState(({ resume }) => ({
      resume: {
        ...resume,
        experiences: resume.experiences.map(exp => {
          if (exp.uuid === experienceId) {
            return {
              ...exp,
              [key]: val
            };
          }

          return exp;
        })
      }
    }));
  }

  private onUserChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { updateUser, user } = this.context;
    const { name, value }: { name: string; value: string } = e.currentTarget;

    updateUser({
      ...user,
      [name]: value
    });
  }

  private patchCurrentUser = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { patchCurrentUser, user } = this.context;
    const { name, value }: { name: string; value: string } = e.currentTarget;

    patchCurrentUser({
      ...user,
      [name]: value
    });
  }
}

export const EditResume = withNamespaces()(EditResumeComponent);
