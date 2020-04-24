import React, { ChangeEvent, Component } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { InputAdornment, TextField } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import throttle from 'lodash.throttle';
import { Col, Container, Row } from 'react-bootstrap';

import { ResumeEducations } from 'ResumeEducations';
import { ResumeExperiences } from 'ResumeExperiences';
import { ResumePreview } from 'ResumePreview';
import { CurrentUserContextImpl } from 'utils/contexts';
import { Experience, Resume } from 'utils/models';
import { createEducation, createWorkExperience, deleteEducation, deleteWorkExperience, fetchResume, patchResume, patchWorkExperience } from 'utils/requests';

import styles from './styles.module.scss';

type PathParams = {
  rId: Uuid;
};

type TComponentState = {
  showResumePreview: boolean;
  resume: Resume;
};

type TComponentProps = RouteComponentProps<PathParams> & WithNamespaces;

class EditResumeComponent extends Component<TComponentProps, TComponentState> {
  public static contextType = CurrentUserContextImpl;
  private throttledPatchExperience: (resumeId: Uuid, experience: Partial<Experience>) => Promise<Experience>;

  public constructor(props: TComponentProps) {
    super(props);

    this.throttledPatchExperience = throttle(patchWorkExperience, 4000, { leading: false });

    this.state = {
      resume: {} as Resume,
      showResumePreview: false
    };
  }

  public render() {
    const { match, t } = this.props;
    const { rId: resumeId } = match.params;
    const { user } = this.context;
    const { email = '', firstName = '', lastName = '', phoneNumber = '' } = user;
    const { resume, showResumePreview } = this.state;
    const { educations = [], experiences = [], jobTitle = '', name = '' } = resume;

    return (
      <Container fluid>
        <Row>
          <Col xs={12} md={{ span: 10, offset: 1 }} lg={{ span: 7, offset: 0 }} xl={6}>
            <Container fluid className={styles.outerContainer}>
              <Row className={`${styles.resumeNameContainer} ${styles.mb16}`}>
                <Col xs={8} sm={5} md={4} xl={3}>
                  <TextField
                    fullWidth
                    label={t('resume_name')}
                    name="name"
                    onChange={this.onChange}
                    value={name}
                    onBlur={this.patchResume}
                    InputProps={{
                      endAdornment: (
                        name === t('untitled') &&
                          <InputAdornment position="end">
                            <Edit />
                          </InputAdornment>
                      )
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className={styles.mb16}>
                  <h3 className={styles.sectionHeader}>{t('personal_information')}</h3>
                </Col>
              </Row>
              <Row>
                <Col xs={12} className={styles.mb16}>
                  <TextField
                    variant="filled"
                    label={t('job_title')}
                    fullWidth
                    placeholder={t('eg_teacher')}
                    name="jobTitle"
                    value={jobTitle}
                    onChange={this.onChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    variant="filled"
                    label={t('first_name')}
                    fullWidth
                    name="firstName"
                    value={firstName}
                    onChange={this.onUserChange}
                    onBlur={this.patchCurrentUser}
                  />
                </Col>

                <Col xs={12} md={6} className={styles.mb16} >
                  <TextField
                    variant="filled"
                    label={t('last_name')}
                    fullWidth
                    name="lastName"
                    value={lastName}
                    onChange={this.onUserChange}
                    onBlur={this.patchCurrentUser}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} className={styles.mb16}>
                  {/* FIXME figure out how to persist email on change? or make this field RO?
                    the email is used for sign-in so you'd need to check for uniqueness. Or,
                    need to make the email field that appears on resumes different than the email
                    used for your user account */}
                  <TextField
                    variant="filled"
                    label={t('email')}
                    fullWidth
                    name="email"
                    value={email}
                    onChange={this.onUserChange}
                  />
                </Col>

                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    variant="filled"
                    label={t('phone')}
                    fullWidth
                    name="phoneNumber"
                    value={phoneNumber}
                    inputMode="tel"
                    onChange={this.onUserChange}
                    onBlur={this.patchCurrentUser}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <h3 className={styles.sectionHeader}>{t('professional_experience')}</h3>
                </Col>
              </Row>
              <Row className={styles.mb16}>
                <Col xs={12}>
                  <p className={styles.supportingInfo}>{t('professional_experience_supporting_info')}</p>
                </Col>
              </Row>

              <ResumeExperiences
                createWorkExperience={this.createWorkExperience}
                updateWorkExperience={this.updateWorkExperience}
                deleteWorkExperience={this.deleteWorkExperience}
                experiences={experiences}
                resumeId={resumeId}
              />

              <Row>
                <Col xs={12}>
                  <h3 className={styles.sectionHeader}>{t('education')}</h3>
                </Col>
              </Row>
              <Row className={styles.mb16}>
                <Col xs={12}>
                  <p className={styles.supportingInfo}>{t('education_supporting_info')}</p>
                </Col>
              </Row>

              <ResumeEducations
                createEducation={this.createEducation}
                deleteEducation={this.deleteEducation}
                educations={educations}
                resumeId={resumeId}
              />
            </Container>
          </Col>
          {showResumePreview &&
            <ResumePreview resume={resume} />
          }
        </Row>
      </Container>
    );
  }

  public shouldComponentUpdate() {
    return true;
  }

  public async componentDidMount() {
    const { rId: resumeId } = this.props.match.params;

    const resume: Resume = await fetchResume(resumeId);
    this.setState({ resume });
    setTimeout(() => this.setState({ showResumePreview: true }), 500);
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
        experiences: [...(resume.experiences || []), experience]
      }
    }));
  }

  private updateWorkExperience = async (experience: Partial<Experience>): Promise<void> => {
    const { rId: resumeId } = this.props.match.params;

    this.setState(({ resume }) => ({
      resume: {
        ...resume,
        experiences: (resume.experiences || []).map(prevExp => prevExp.uuid === experience.uuid ? { ...prevExp, ...experience } : prevExp)
      }
    }), () => {
      const toUpdate: Maybe<Experience> = (this.state.resume.experiences || []).find(exp => exp.uuid === experience.uuid);

      if (toUpdate) {
        this.throttledPatchExperience(resumeId, toUpdate);
      }
    });
  }

  private deleteWorkExperience = async (experienceId: Uuid): Promise<void> => {
    const { rId: resumeId } = this.props.match.params;

    await deleteWorkExperience(resumeId, experienceId);
    this.setState(({ resume }) => ({
      resume: {
        ...resume,
        experiences: [...(resume.experiences || []).filter(exp => exp.uuid !== experienceId)]
      }
    }));
  }

  private createEducation = async () => {
    const { rId: resumeId } = this.props.match.params;

    const education = await createEducation(resumeId);
    this.setState(({ resume }) => ({
      resume: {
        ...resume,
        educations: [...(resume.educations || []), education]
      }
    }));
  }

  private deleteEducation = async (educationId: Uuid): Promise<void> => {
    const { rId: resumeId } = this.props.match.params;

    await deleteEducation(resumeId, educationId);
    this.setState(({ resume }) => ({
      resume: {
        ...resume,
        educations: [...(resume.educations || []).filter(exp => exp.uuid !== educationId)]
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

  private patchResume = (): void => {
    const { resume } = this.state;
    const { name } = resume;

    if (!name) {
      const { t } = this.props;

      return this.setState(prevState => ({
        resume: {
          ...prevState.resume,
          name: t('untitled')
        }
      }), () => patchResume(this.state.resume));
    }

    patchResume(resume);
  }
}

export const EditResume = withNamespaces()(EditResumeComponent);
