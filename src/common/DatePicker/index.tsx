import React, { PureComponent } from 'react';

import { DatePicker, DatePickerProps } from '@material-ui/pickers';

class DatePickerComponent extends PureComponent<DatePickerProps> {
  public render() {
    return (
      <DatePicker
        inputVariant="filled"
        variant="inline"
        autoOk
        disableToolbar
        openTo="year"
        {...this.props}
      />
    );
  }
}

export { DatePickerComponent as DatePicker };
