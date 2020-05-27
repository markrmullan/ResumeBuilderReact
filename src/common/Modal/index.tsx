import React, { PureComponent } from 'react';

import ReactModal from 'react-modal';
ReactModal.setAppElement('#root');

import styles from './styles.module.scss';

type ModalComponentProps = {
  isOpen: boolean;
  className?: string;
};

class ModalComponent extends PureComponent<ModalComponentProps> {
  public render() {
    const { children, className = '', isOpen } = this.props;

    return (
      <ReactModal
        overlayClassName={styles.overlay}
        className={`${styles.content} ${className}`}
        isOpen={isOpen}
        shouldCloseOnOverlayClick={false}
      >
        {children}
      </ReactModal>
    );
  }
}

export { ModalComponent as Modal };
