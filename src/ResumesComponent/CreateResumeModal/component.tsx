import React, { FormEvent, PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { AT_LEAST_ONE_CHARACTER } from 'utils/regex';

import Button from '@material/react-button';
import Dialog, {
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogTitle
} from '@material/react-dialog';
import TextField, { HelperText, Input } from '@material/react-text-field';
import { post } from 'utils/api';
import styles from './styles.module.scss';

type CreateResumeModalComponentProps = {
  cancelAction: () => void;
  isOpen: boolean;
  onCreate: () => Promise<void>;
};

type CreateResumeModalComponentState = {
  isOpen: boolean;
  name: string;
};

class CreateResumeModalComponent extends PureComponent<CreateResumeModalComponentProps & WithNamespaces, CreateResumeModalComponentState> {
  public state = {
    name: '',
    isOpen: this.props.isOpen
  };

  public render() {
    const { t } = this.props;
    const { isOpen, name } = this.state;

    return (
      <Dialog
        allowFullScreen={true}
        open={isOpen}
        className={styles.modal}
      >
        <DialogTitle>{t('lets_get_started')}</DialogTitle>
        <DialogContent className={styles.grid}>
          <TextField
            label={t('name')}
            helperText={
              <HelperText
                isValidationMessage={true}
                validation={true}
              >
                {t('cannot_be_blank')}
              </HelperText>}
          >
            <Input
              autoFocus={true}
              id="name"
              name="name"
              required={true}
              pattern={AT_LEAST_ONE_CHARACTER.source}
              value={name}
              onChange={e => this.onChange(e)}/>
          </TextField>
        </DialogContent>

        <DialogFooter>
          <DialogButton
            action=""
          >
            {t('cancel')}
          </DialogButton>
          <Button
            disabled={!this.allFieldsValid}
            outlined={true}
            onClick={this.createResume}
          >
            {t('save')}
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }

  private closeModal() {
    this.setState({ isOpen: false });
  }

  private onChange(e: FormEvent<HTMLTextAreaElement>) {
    const { name, value }: { name: string; value: string } = e.currentTarget;

    this.setState({ [name]: value } as Pick<CreateResumeModalComponentState, 'name'>);
  }

  private get allFieldsValid(): boolean {
    const { name } = this.state;

    return AT_LEAST_ONE_CHARACTER.test(name);
  }

  private createResume = async(): Promise<void> => {
    if (this.allFieldsValid) {
      const { name } = this.state;
      const { onCreate } = this.props;
      await post({ baseResource: 'resumes' }, { resume: { name } });
      await onCreate();

      this.closeModal();
    }
  }
}

export const CreateResumeModal = withNamespaces()(CreateResumeModalComponent);
