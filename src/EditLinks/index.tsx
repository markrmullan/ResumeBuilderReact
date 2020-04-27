import React, { ChangeEvent, Fragment, PureComponent } from 'react';

import { ExpansionPanelSummary } from '@material-ui/core';
import { DeleteOutlined, ExpandMore } from '@material-ui/icons';
import { Col, Row } from 'react-bootstrap';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { ConfirmationDialog } from 'common/ConfirmationDialog';
import { ExpansionPanel } from 'common/ExpansionPanel';
import { TextField } from 'common/TextField';
import { Tooltip } from 'common/Tooltip';
import { Link } from 'utils/models';

import styles from './styles.module.scss';

type TOwnProps = {
  deleteLink: (linkId: Uuid, callback?: Function) => Promise<void>;
  links: Link[];
  updateLink: (link: Partial<Link>) => void;
};

type TComponentProps = TOwnProps & WithNamespaces;

type TComponentState = {
  isDeleteConfirmationModalOpen: boolean;
  linkToDelete: Nullable<Uuid>;
};

class EditLinksComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    isDeleteConfirmationModalOpen: false,
    linkToDelete: null
  };

  public render() {
    const { links, t } = this.props;
    const { isDeleteConfirmationModalOpen } = this.state;

    return (
      <Fragment>
        <ConfirmationDialog
          title={t('delete_entry')}
          description={t('are_you_sure_you_want_to_delete_this_entry')}
          secondaryButtonAction={this.deleteLink}
          secondaryButtonText={t('delete')}
          primaryButtonAction={this.closeDeleteConfirmationModal}
          primaryButtonText={t('cancel')}
          open={isDeleteConfirmationModalOpen}
        />

        <ExpansionPanel className={styles.mb16}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Row>
              <Col xs={12} className={styles.summary}>
                {t('count_links_added', { count: links.length })}
              </Col>
            </Row>
          </ExpansionPanelSummary>

          {links.map(link => (
            <Row key={link.uuid} className={styles.mb16}>
              <Col xs={10} sm={11}>
                <TextField
                  label={t('link')}
                  name={link.uuid}
                  value={link.url}
                  onChange={this.updateLink}
                />
              </Col>

              <Col xs={2} sm={1} className={styles.deleteIconContainer}>
                <Tooltip title={t('delete')}>
                  <DeleteOutlined
                    className={styles.deleteIcon}
                    onClick={this.openDeleteConfirmationModal.bind(this, link.uuid)}
                  />
                </Tooltip>
              </Col>
            </Row>
          ))}

        </ExpansionPanel>
      </Fragment>
    );
  }

  private openDeleteConfirmationModal = (linkToDelete: Uuid): void => {
    this.setState({
      isDeleteConfirmationModalOpen: true,
      linkToDelete
    });
  }

  private closeDeleteConfirmationModal = (): void => {
    this.setState({
      isDeleteConfirmationModalOpen: false,
      linkToDelete: null
    });
  }

  private updateLink = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { updateLink } = this.props;
    const { name, value }: { name: Uuid; value: string } = e.currentTarget;

    updateLink({
      uuid: name,
      url: value
    });
  }

  private deleteLink = (): void => {
    const { linkToDelete } = this.state;
    const { deleteLink } = this.props;

    deleteLink(linkToDelete!, this.closeDeleteConfirmationModal);
  }
}

export const EditLinks = withNamespaces()(EditLinksComponent);
