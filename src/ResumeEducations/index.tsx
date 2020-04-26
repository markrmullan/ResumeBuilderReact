import React, { Fragment, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Col, Row } from 'react-bootstrap';

import { EditEducation } from 'ResumeEducations/EditEducation';
import { Education } from 'utils/models';

import styles from './styles.module.scss';

type TOwnProps = {
  createEducation: () => void;
  updateEducation: (education: Partial<Education>) => Promise<void>;
  deleteEducation: (experienceId: Uuid) => Promise<void>;
  educations: Education[];
  resumeId: Uuid;
};

type TComponentProps = TOwnProps & WithNamespaces;

class ResumeEducationsComponent extends PureComponent<TComponentProps> {
  public render() {
    const { createEducation, deleteEducation, educations = [], resumeId, t, updateEducation } = this.props;

    return (
      <Fragment>
        {educations.map(edu => (
          <EditEducation
            key={edu.uuid}
            education={edu}
            updateEducation={updateEducation}
            deleteEducation={deleteEducation}
            resumeId={resumeId}
          />
        ))}
        <Row className={styles.mb16}>
          <Col xs={12}>
            <Button
              color="primary"
              startIcon={<Add />}
              onClick={createEducation}
              >
                {t('add_education')}
              </Button>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export const ResumeEducations = withNamespaces()(ResumeEducationsComponent);
