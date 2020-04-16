import React, { Fragment, SFC } from 'react';

import { InputLabel } from '@material-ui/core';
import { Editor } from '@tinymce/tinymce-react';

import styles from './styles.module.scss';

type TComponentProps = {
  label?: string;
  onEditorChange?: (e: string) => void; // on change
  onBlur?: any;
  value?: string;
};

const CONTENT_STYLE: string = 'ul, ol { padding-inline-start: 30px; } p, ul, ol { margin: 0; }';
const KEY: string = 'vw2o44ss6yxeeus1sui02suy8d9qr62ht06rit7qfwn0uj6f';
const PLUGINS: string[] = ['lists link'];
const TOOLBAR: string = 'undo redo | bold italic underline | bullist numlist';

export const RichTextEditor: SFC<TComponentProps> = ({ label, onBlur, onEditorChange, value }) => (
  <Fragment>
    {label &&
      <InputLabel color="primary" className={styles.label}>
        {label}
      </InputLabel>
    }

    <Editor
      apiKey={KEY}
      init={{
        browser_spellcheck: true,
        content_style: CONTENT_STYLE,
        height: 200,
        statusbar: false,
        menubar: false,
        plugins: PLUGINS,
        toolbar: TOOLBAR
      }}
      onBlur={onBlur}
      onEditorChange={onEditorChange}
      value={value}
    />
  </Fragment>
);
