import React, { ChangeEvent, Component } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { Button, InputAdornment } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Add, EditOutlined, HelpOutline } from '@material-ui/icons';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import { Col, Container, Row } from 'react-bootstrap';

import { EditEducation } from 'EditEducation';
import { EditExperience } from 'EditExperience';
import { EditLinks } from 'EditLinks';
import { ResumePreview } from 'ResumePreview';
import { TextField } from 'common/TextField';
import { Tooltip } from 'common/Tooltip';
import { CurrentUserContextImpl } from 'utils/contexts';
import { Education, Experience, Link, Resume, User } from 'utils/models';
import { createEducation, createLink, createWorkExperience, deleteEducation, deleteLink, deleteWorkExperience, fetchResume, patchEducation, patchLink, patchResume, patchWorkExperience } from 'utils/requests';
import { BackLink } from './BackLink';
import { SectionHeader } from './SectionHeader';
import { SectionHeaderAndSupportingInfo } from './SectionHeader/WithSupportingInfo';
import { TopNav } from './TopNav';

import styles from './styles.module.scss';

type PathParams = {
  rId: Uuid;
};

type TComponentState = {
  lastUpdatedUuid: Nullable<Uuid>;
  resume: Resume;
  selectedTab: number;
};

type TComponentProps = RouteComponentProps<PathParams> & WithNamespaces;

class EditResumeComponent extends Component<TComponentProps, TComponentState> {
  public static contextType = CurrentUserContextImpl;
  private throttledPatchExperience: (resumeId: Uuid, experience: Partial<Experience>) => Promise<Experience>;
  private throttledPatchEducation: (resumeId: Uuid, education: Partial<Education>) => Promise<Education>;
  private throttledPatchLink: (resumeId: Uuid, link: Partial<Link>) => Promise<Link>;
  private throttledPatchCurrentUser: Nullable<(user: Partial<User>) => Promise<User>> = null;

  public constructor(props: TComponentProps) {
    super(props);

    this.throttledPatchExperience = throttle(patchWorkExperience, 2000, { leading: false });
    this.throttledPatchEducation = throttle(patchEducation, 2000, { leading: false });
    this.throttledPatchLink = throttle(patchLink, 2000, { leading: false });

    this.state = {
      lastUpdatedUuid: null,
      resume: {} as Resume,
      selectedTab: 0
    };
  }

  public render() {
    const { t } = this.props;
    const { user } = this.context;
    const { city = '', email = '', firstName = '', jobTitle = '', lastName = '', phoneNumber = '', resumeEmail = '', state = '', zip = '' } = user;
    const { lastUpdatedUuid, resume, selectedTab } = this.state;
    const { educations = [], experiences = [], links = [], name = '' } = resume;

    const isMobilePreviewEnabled = selectedTab === 1;

    return (
      <Container fluid className={styles.backContainer}>
        <BackLink isMobilePreviewEnabled={isMobilePreviewEnabled} />

        <TopNav
          value={selectedTab}
          handleChange={this.handleTopNavChange}
        />

        <Row>
          <Col xs={12} md={{ span: 10, offset: 1 }} lg={{ span: 7, offset: 0 }} xl={6} className={classnames(styles.outerResumeCol, { [styles.previewMode]: isMobilePreviewEnabled })}>
            <Container fluid className={styles.outerContainer}>
              <Row className={`${styles.resumeNameContainer} ${styles.mb16}`}>
                <Col xs={8} sm={5} md={4}>
                  <TextField
                    variant="standard"
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
                    label={t('first_name')}
                    name="firstName"
                    value={firstName}
                    onChange={this.onUserChange}
                  />
                </Col>

                <Col xs={12} md={6} className={styles.mb16} >
                  <TextField
                    label={t('last_name')}
                    name="lastName"
                    value={lastName}
                    onChange={this.onUserChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    label={t('email')}
                    name="resumeEmail"
                    value={resumeEmail || email}
                    onChange={this.onUserChange}
                    InputProps={{
                      endAdornment: (
                        <Tooltip title={t('use_best_email_for_resume', { email })}>
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
                    label={t('phone')}
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
                    label={t('job_title')}
                    name="jobTitle"
                    value={jobTitle}
                    onChange={this.onUserChange}
                    InputProps={{
                      endAdornment: (
                        <Tooltip title={t('add_a_title_that_summarizes')}>
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
                    label={t('city')}
                    name="city"
                    value={city}
                    onChange={this.onUserChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    label={t('state_or_province')}
                    name="state"
                    value={state}
                    onChange={this.onUserChange}
                  />
                </Col>

                <Col xs={12} md={6} className={styles.mb16}>
                  <TextField
                    label={t('zip_or_postal')}
                    name="zip"
                    value={zip}
                    onChange={this.onUserChange}
                    InputProps={{
                      endAdornment: (
                        <Tooltip title={t('adding_location_tooltip')}>
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
                  lastUpdatedUuid={lastUpdatedUuid}
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
                  lastUpdatedUuid={lastUpdatedUuid}
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

              <SectionHeaderAndSupportingInfo
                title={t('links')}
                supportingInfo={t('links_supporting_info')}
              />

              <EditLinks
                deleteLink={this.deleteLink}
                links={links}
                updateLink={this.updateLink}
              />

              <Row className={styles.mb16}>
                <Col xs={12}>
                  <Button
                    color="primary"
                    startIcon={<Add />}
                    onClick={this.createLink}
                    >
                      {t('add_link')}
                    </Button>
                </Col>
              </Row>
            </Container>
          </Col>

          {resume.uuid && user.uuid &&
            <ResumePreview
              isMobilePreviewEnabled={isMobilePreviewEnabled}
              resume={resume}
            />
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
  }

  private handleTopNavChange = (_: React.ChangeEvent<{}>, newValue: any): void => {
    this.setState({ selectedTab: newValue as number });
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
    const { uuid } = experience;

    this.setState(({ resume }) => ({
      lastUpdatedUuid: uuid || null,
      resume: {
        ...resume,
        experiences: (resume.experiences || []).map(prevExp => prevExp.uuid === uuid ? { ...prevExp, ...experience } : prevExp)
      }
    }), () => {
      const toUpdate: Maybe<Experience> = (this.state.resume.experiences || []).find(exp => exp.uuid === uuid);

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
    const { uuid } = education;

    this.setState(({ resume }) => ({
      lastUpdatedUuid: uuid || null,
      resume: {
        ...resume,
        educations: (resume.educations || []).map(prevEducation => prevEducation.uuid === uuid ? { ...prevEducation, ...education } : prevEducation)
      }
    }), () => {
      const toUpdate: Maybe<Education> = (this.state.resume.educations || []).find(exp => exp.uuid === uuid);

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

  private createLink = async (): Promise<void> => {
    const { rId: resumeId } = this.props.match.params;

    const link: Link = await createLink(resumeId);

    this.setState(({ resume }) => ({
      resume: {
        ...resume,
        links: [...(resume.links || []), link]
      }
    }));
  }

  private updateLink = (link: Partial<Link>): void => {
    const { rId: resumeId } = this.props.match.params;
    const { uuid } = link;

    this.setState(({ resume }) => ({
      lastUpdatedUuid: uuid || null,
      resume: {
        ...resume,
        links: (resume.links || []).map(prevLink => prevLink.uuid === uuid ? { ...prevLink, ...link } : prevLink)
      }
    }), () => {
      const toUpdate: Maybe<Link> = (this.state.resume.links || []).find(link => link.uuid === uuid);

      if (toUpdate) {
        this.throttledPatchLink(resumeId, toUpdate);
      }
    });
  }

  private deleteLink = async (linkId: Uuid, callback?: Function): Promise<void> => {
    const { rId: resumeId } = this.props.match.params;

    await deleteLink(resumeId, linkId);
    this.setState(({ resume }) => ({
      resume: {
        ...resume,
        links: [...(resume.links || []).filter(link => link.uuid !== linkId)]
      }
    }), () => {
      if (callback) callback();
    });
  }
}

export const EditResume = withNamespaces()(EditResumeComponent);
