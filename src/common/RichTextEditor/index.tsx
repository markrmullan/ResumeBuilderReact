import React, { Fragment, SFC } from 'react';

import { InputLabel } from '@material-ui/core';
import { Editor } from '@tinymce/tinymce-react';
import { KEY_CODES } from 'utils/constants';

import styles from './styles.module.scss';

type TComponentProps = {
  label?: string;
  onEditorChange?: (e: string) => void; // on change
  onBlur?: any;
  value?: string;
};

const CONTENT_STYLE: string = 'ul, ol { padding-inline-start: 30px; } p, ul, ol { margin: 0; }';
const KEY: string = 'vw2o44ss6yxeeus1sui02suy8d9qr62ht06rit7qfwn0uj6f';
const PLUGINS: string[] = ['lists link paste'];
const TOOLBAR: string = 'undo redo | bullist ';

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
        lists_indent_on_tab: false, // prevent multiple levels of indentation, for now. Translating nested indentation to the PDF will be difficult. figure out support for that later.
        statusbar: false,
        menubar: false,
        plugins: PLUGINS,
        toolbar: TOOLBAR,
        paste_as_text: true,
        paste_text_sticky_default: true,
        paste_text_sticky: true
      }}
      onBlur={onBlur}
      onEditorChange={onEditorChange}
      value={value}
      onKeyDown={e => { if (e.keyCode === KEY_CODES.TAB) e.preventDefault(); }} // since lists_indent_on_tab = false, prevent Tab from hopping to the next HTML element
    />
  </Fragment>
);
