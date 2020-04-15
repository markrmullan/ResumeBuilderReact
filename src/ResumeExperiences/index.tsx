import React, { Fragment, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Col, Row } from 'react-bootstrap';

import { EditExperience } from 'ResumeExperiences/EditExperience';
import { Experience } from 'utils/models';

type TOwnProps = {
  createWorkExperience: () => void;
  deleteWorkExperience: (experienceId: Uuid) => Promise<void>;
  experiences: Experience[];
  resumeId: Uuid;
};

type TComponentProps = TOwnProps & WithNamespaces;

class ResumeExperiencesComponent extends PureComponent<TComponentProps> {
  public render() {
    const { createWorkExperience, deleteWorkExperience, experiences = [], resumeId, t } = this.props;

    return (
      <Fragment>
        {experiences.map(exp => (
          <EditExperience
            key={exp.uuid}
            experience={exp}
            deleteWorkExperience={deleteWorkExperience}
            resumeId={resumeId}
          />
        ))}
        <Row>
          <Col xs={12} md={6}>
            <Button
              color="primary"
              startIcon={<Add />}
              onClick={createWorkExperience}
              >
                {t('add_work_experience')}
              </Button>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export const ResumeExperiences = withNamespaces()(ResumeExperiencesComponent);
