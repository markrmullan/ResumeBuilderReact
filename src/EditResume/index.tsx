 import React, { ChangeEvent, Component } from 'react';
 import { WithNamespaces, withNamespaces } from 'react-i18next';
 import { RouteComponentProps } from 'react-router-dom';

 import { Button, InputAdornment, TextField, Tooltip } from '@material-ui/core';
 import { grey } from '@material-ui/core/colors';
 import { Add, EditOutlined, HelpOutline } from '@material-ui/icons';
 import throttle from 'lodash.throttle';
 import { Col, Container, Row } from 'react-bootstrap';

 import { EditEducation } from 'EditEducation';
 import { EditExperience } from 'EditExperience';
 import { ResumePreview } from 'ResumePreview';
 import { CurrentUserContextImpl } from 'utils/contexts';
 import { Education, Experience, Resume, User } from 'utils/models';
 import { createEducation, createWorkExperience, deleteEducation, deleteWorkExperience, fetchResume, patchEducation, patchResume, patchWorkExperience } from 'utils/requests';
 import { BackLink } from './BackLink';
 import { SectionHeader } from './SectionHeader';
 import { SectionHeaderAndSupportingInfo } from './SectionHeader/WithSupportingInfo';

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
  private throttledPatchEducation: (resumeId: Uuid, education: Partial<Education>) => Promise<Education>;
  private throttledPatchCurrentUser: Nullable<(user: Partial<User>) => Promise<User>> = null;

  public constructor(props: TComponentProps) {
    super(props);

    this.throttledPatchExperience = throttle(patchWorkExperience, 2000, { leading: false });
    this.throttledPatchEducation = throttle(patchEducation, 2000, { leading: false });

    this.state = {
      resume: {} as Resume,
      showResumePreview: false
    };
  }

  public render() {
    const { t } = this.props;
    const { user } = this.context;
    const { city = '', email = '', firstName = '', jobTitle = '', lastName = '', phoneNumber = '', resumeEmail = '', state = '', zip = '' } = user;
    const { resume, showResumePreview } = this.state;
    const { educations = [], experiences = [], name = '' } = resume;

    return (
      <Container fluid className={styles.backContainer}>
        <BackLink />

        <Row>
          <Col xs={12} md={{ span: 10, offset: 1 }} lg={{ span: 7, offset: 0 }} xl={6} className={styles.outerResumeCol}>
            <Container fluid className={styles.outerContainer}>
              <Row className={`${styles.resumeNameContainer} ${styles.mb16}`}>
                <Col xs={8} sm={5} md={4}>
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
                          <InputAdornment position="end" style={{ color: grey[400] }}>
                            <EditOutlined />
                          </InputAdornment>
                      )
                    }}
                  />
                </Col>
              </Row>

              <SectionHeader title={t('personal_information')} />

              <Row>
                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    variant="filled"
                    label={t('first_name')}
                    fullWidth
                    name="firstName"
                    value={firstName}
                    onChange={this.onUserChange}
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
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    variant="filled"
                    label={t('email')}
                    fullWidth
                    name="resumeEmail"
                    value={resumeEmail || email}
                    onChange={this.onUserChange}
                    InputProps={{
                      endAdornment: (
                        <Tooltip arrow title={t('use_best_email_for_resume', { email })} placement="top">
                          <InputAdornment position="end" style={{ color: grey[400] }}>
                            <HelpOutline />
                          </InputAdornment>
                        </Tooltip>
                      )
                    }}
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
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    variant="filled"
                    label={t('job_title')}
                    fullWidth
                    name="jobTitle"
                    value={jobTitle}
                    onChange={this.onUserChange}
                    InputProps={{
                      endAdornment: (
                        <Tooltip arrow title={t('add_a_title_that_summarizes')} placement="top">
                          <InputAdornment position="end" style={{ color: grey[400] }}>
                            <HelpOutline />
                          </InputAdornment>
                        </Tooltip>
                      )
                    }}
                  />
                </Col>

                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    variant="filled"
                    label={t('city')}
                    fullWidth
                    name="city"
                    value={city}
                    onChange={this.onUserChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    variant="filled"
                    label={t('state_or_province')}
                    fullWidth
                    name="state"
                    value={state}
                    onChange={this.onUserChange}
                  />
                </Col>

                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    variant="filled"
                    label={t('zip_or_postal')}
                    fullWidth
                    name="zip"
                    value={zip}
                    onChange={this.onUserChange}
                    InputProps={{
                      endAdornment: (
                        <Tooltip arrow title={t('adding_location_tooltip')} placement="top">
                          <InputAdornment position="end" style={{ color: grey[400] }}>
                            <HelpOutline />
                          </InputAdornment>
                        </Tooltip>
                      )
                    }}
                  />
                </Col>
              </Row>

              <SectionHeaderAndSupportingInfo
                title={t('professional_experience')}
                supportingInfo={t('professional_experience_supporting_info')}
              />

              {experiences.map(exp => (
                <EditExperience
                  key={exp.uuid}
                  experience={exp}
                  updateWorkExperience={this.updateWorkExperience}
                  deleteWorkExperience={this.deleteWorkExperience}
                />
              ))}
              <Row className={styles.mb16}>
                <Col xs={12}>
                  <Button
                    color="primary"
                    startIcon={<Add />}
                    onClick={this.createWorkExperience}
                    >
                      {t('add_work_experience')}
                    </Button>
                </Col>
              </Row>

              <SectionHeaderAndSupportingInfo
                title={t('education')}
                supportingInfo={t('education_supporting_info')}
              />

              {educations.map(edu => (
                <EditEducation
                  key={edu.uuid}
                  education={edu}
                  updateEducation={this.updateEducation}
                  deleteEducation={this.deleteEducation}
                />
              ))}

              <Row className={styles.mb16}>
                <Col xs={12}>
                  <Button
                    color="primary"
                    startIcon={<Add />}
                    onClick={this.createEducation}
                    >
                      {t('add_education')}
                    </Button>
                </Col>
              </Row>
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
    const { patchCurrentUser } = this.context;
    this.throttledPatchCurrentUser = throttle(patchCurrentUser, 2000, { leading: false });

    const resume: Resume = await fetchResume(resumeId);
    this.setState({ resume });
    setTimeout(() => this.setState({ showResumePreview: true }), 200);

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

  private updateEducation = async (education: Partial<Education>): Promise<void> => {
    const { rId: resumeId } = this.props.match.params;

    this.setState(({ resume }) => ({
      resume: {
        ...resume,
        educations: (resume.educations || []).map(prevEducation => prevEducation.uuid === education.uuid ? { ...prevEducation, ...education } : prevEducation)
      }
    }), () => {
      const toUpdate: Maybe<Education> = (this.state.resume.educations || []).find(exp => exp.uuid === education.uuid);

      if (toUpdate) {
        this.throttledPatchEducation(resumeId, toUpdate);
      }
    });
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

    const newUser = {
      ...user,
      [name]: value
    };

    updateUser(newUser, () => {
      this.throttledPatchCurrentUser!(newUser);
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
