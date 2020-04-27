import React, { PureComponent } from 'react';

import { FilledTextFieldProps, StandardTextFieldProps, TextField } from '@material-ui/core';

class TextFieldComponent extends PureComponent<FilledTextFieldProps | StandardTextFieldProps> {
  public render() {
    return (
      <TextField
        variant="filled"
        fullWidth
        {...this.props as FilledTextFieldProps}
      />
    );
  }
}

export { TextFieldComponent as TextField };
