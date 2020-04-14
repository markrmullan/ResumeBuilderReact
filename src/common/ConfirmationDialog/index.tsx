import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React, { Fragment, MouseEvent, SFC } from 'react';

type TComponentProps = {
  description?: string;
  open: boolean;
  onClose?: () => void;
  primaryButtonAction: (e: MouseEvent) => void;
  primaryButtonText: string;
  secondaryButtonAction: (e: MouseEvent) => void;
  secondaryButtonText: string;
  title?: string;
};

export const ConfirmationDialog: SFC<TComponentProps> = ({ description, open, onClose, primaryButtonAction, primaryButtonText, secondaryButtonAction, secondaryButtonText, title }) => (
  <Fragment>
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title &&
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      }

      {description &&
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
      }

      <DialogActions>
        <Button onClick={secondaryButtonAction} color="primary" variant="outlined">
          {secondaryButtonText}
        </Button>
        <Button onClick={primaryButtonAction} color="primary" variant="contained">
          {primaryButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  </Fragment>
);
