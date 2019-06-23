import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { get } from 'utils/api';
import { Resume } from 'utils/models';

import Button from '@material/react-button';
import { Cell, Grid, Row } from '@material/react-layout-grid';

import { ResumeListItem } from 'ResumesComponent/ResumeListItem/component';
import { CreateResumeModal } from 'ResumesComponent/CreateResumeModal/component';
import { Spinner } from 'common/Spinner/component';

import styles from './styles.module.scss';

type ResumesComponentState = {
  createResumeModalOpen: boolean;
  resumes: Resume[];
  pending: boolean;
};

class ResumesComponent extends PureComponent<WithNamespaces, ResumesComponentState> {
  public state = {
    resumes: [],
    createResumeModalOpen: false,
    pending: true
  };

  public render() {
    const { t } = this.props;
    const { createResumeModalOpen, resumes, pending } = this.state;

    if (pending) {
      return (
        <Grid marginHeight={50}>
          <Spinner />
        </Grid>
      );
    }

    return (
      <Grid
        marginHeight={50}
      >
        <ResumeListItem
          resumes={resumes}
        />

        <Row>
          <Cell
            className={styles.ctaButtonContainer}
            phoneColumns={4}
            tabletColumns={8}
            desktopColumns={12}
          >
            <Button
              onClick={this.openModal}
              raised={true}
            >
              {!resumes.length && t('create_your_first') || t('create_another')}
            </Button>
          </Cell>
        </Row>

        {createResumeModalOpen &&
          <CreateResumeModal
            onCreate={this.fetchResumes}
            isOpen={true}
            cancelAction={this.closeModal}
          />
        }
      </Grid>
    );
  }

  public componentDidMount() {
    this.fetchResumes();
  }

  private fetchResumes = async (): Promise<void> => {
    try {
      const resumes = await get({ baseResource: 'resumes' });

      this.setState({
        resumes: resumes.data,
        pending: false
      });
    } catch {
      this.setState({
        resumes: [],
        pending: false
      });
    }
  }

  private openModal = (): void => {
    this.setState({
      createResumeModalOpen: true
    });
  }

  private closeModal = (): void => {
    this.setState({
      createResumeModalOpen: false
    });
  }
}

export const Resumes = withNamespaces()(ResumesComponent);
