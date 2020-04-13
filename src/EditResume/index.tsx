import React, { ChangeEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { TextField } from '@material-ui/core';
import { Col, Container, Row } from 'react-bootstrap';

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
      <Container fluid>
        <Row>
          <Col md={6} className={styles.mb16}>
            <h3>{t('personal_information')}</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} className={styles.mb16}>
            <TextField
              variant="outlined"
              label={t('job_title')}
              fullWidth
              placeholder="e.g. Teacher"
              name="jobTitle"
              value={jobTitle}
              onChange={this.onChange}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={3} className={styles.mb16}>
            <TextField
              variant="outlined"
              label={t('first_name')}
              fullWidth
              InputLabelProps={{ shrink: !!firstName }}
              name="firstName"
              value={firstName}
              onChange={this.onUserChange}
              onBlur={this.patchCurrentUser}
            />
          </Col>

          <Col xs={12} md={3} className={styles.mb16} >
            <TextField
              variant="outlined"
              label={t('last_name')}
              fullWidth
              InputLabelProps={{ shrink: !!lastName }}
              name="lastName"
              value={lastName}
              onChange={this.onUserChange}
              onBlur={this.patchCurrentUser}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={3} className={styles.mb16}>
            {/* FIXME figure out how to persist email on change? or make this field RO?
              the email is used for sign-in so you'd need to check for uniqueness. Or,
              need to make the email field that appears on resumes different than the email
              used for your user account */}
            <TextField
              variant="outlined"
              label={t('email')}
              fullWidth
              InputLabelProps={{ shrink: !!email }}
              name="email"
              value={email}
              onChange={this.onUserChange}
            />
          </Col>

          <Col xs={12} md={3} className={styles.mb16}>
            <TextField
              variant="outlined"
              label={t('phone')}
              fullWidth
              InputLabelProps={{ shrink: !!phoneNumber }}
              name="phoneNumber"
              value={phoneNumber}
              inputMode="tel"
              onChange={this.onUserChange}
              onBlur={this.patchCurrentUser}
            />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <h3>{t('professional_experience')}</h3>
          </Col>
        </Row>
        <Row className={styles.mb16}>
          <Col md={6}>
            <p className={styles.supportingInfo}>{t('professional_experience_supporting_info')}</p>
          </Col>
        </Row>

        <ResumeExperiences
          createWorkExperience={this.createWorkExperience}
          experiences={experiences}
          resumeId={resumeId}
        />
      </Container>
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
