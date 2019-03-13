import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { get } from 'utils/api';
import { CV } from 'utils/models';

import Button from '@material/react-button';
import { Cell, Grid, Row } from '@material/react-layout-grid';

import { CreateCVModal } from 'CVsComponent/CreateCVModal/component';
import { CVListItem } from 'CVsComponent/CVListItem/component';
import { Spinner } from 'common/Spinner/component';

import styles from './styles.module.scss';

type CVsComponentState = {
  createCVModalOpen: boolean;
  cvs: CV[];
  pending: boolean;
};

class CVsComponent extends PureComponent<WithNamespaces, CVsComponentState> {
  public state = {
    cvs: [],
    createCVModalOpen: false,
    pending: true
  };

  public render() {
    const { t } = this.props;
    const { createCVModalOpen, cvs, pending } = this.state;

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
        <CVListItem
          cvs={cvs}
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
              {!cvs.length && t('create_your_first') || t('create_another')}
            </Button>
          </Cell>
        </Row>

        {createCVModalOpen &&
          <CreateCVModal
            onCreate={this.fetchCVs}
            isOpen={true}
            cancelAction={this.closeModal}
          />
        }
      </Grid>
    );
  }

  public componentDidMount() {
    this.fetchCVs();
  }

  private fetchCVs = async (): Promise<void> => {
    try {
      const cvs = await get({ baseResource: 'cvs' });

      this.setState({
        cvs: cvs.data,
        pending: false
      });
    } catch {
      this.setState({
        cvs: [],
        pending: false
      });
    }
  }

  private openModal = (): void => {
    this.setState({
      createCVModalOpen: true
    });
  }

  private closeModal = (): void => {
    this.setState({
      createCVModalOpen: false
    });
  }
}

export const CVs = withNamespaces()(CVsComponent);
