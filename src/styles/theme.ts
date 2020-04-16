import { deepPurple, grey } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  overrides: {
    MuiFormControlLabel: {
      label: {
        color: grey[700],
        fontSize: '0.875em',
        userSelect: 'none'
      }
    },
    MuiCollapse: {
      container: {
        padding: '0 16px'
      }
    },
    MuiFilledInput: {
      root: {
        'backgroundColor': grey[100],
        '&&:hover': {
          backgroundColor: grey[200]
        }
      }
    },
    MuiExpansionPanel: {
      root: {
        '&&:before': {
          backgroundColor: 'transparent'
        }
      }
    },
    MuiExpansionPanelSummary: {
      root: {
        padding: '0 16px'
      }
    }
  },
  palette: {
    primary: deepPurple
  }
});
