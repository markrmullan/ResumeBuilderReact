import React, { Component } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import { deepPurple } from '@material-ui/core/colors';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MaterialIcon from '@material/react-material-icon';
import TopAppBar, { TopAppBarFixedAdjust } from '@material/react-top-app-bar';

import { LoginComponent } from 'LoginComponent/component';
import { ResumeBuilder } from 'ResumeBuilderComponent/component';
import { EditResume } from 'ResumesComponent/EditResume/component';
import { Resumes } from 'ResumesComponent/component';
import { SignupComponent } from 'SignupComponent/component';

import { ROUTES } from 'utils/constants';

import './App.scss';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple
  }
});

class App extends Component<WithNamespaces> {
  public render() {
    const { t } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <TopAppBar
          title={t('xhr')}
          navigationIcon={<MaterialIcon
            icon="menu"
            onClick={() => undefined}
          />}
          actionItems={
            [
              <Link
                key={1}
                className="mdc-button mdc-ripple-upgraded mdc-top-app-bar__action-item mdc-button--outlined"
                to="login"
              >
                {t('log_in')}
              </Link>,
              <Link
                key={2}
                className="mdc-button mdc-ripple-upgraded mdc-top-app-bar__action-item mdc-button--raised"
                to="get-started"
              >
                {t('sign_up')}
              </Link>
            ]
          }
        />
        <TopAppBarFixedAdjust>
          <div className="app-wrapper-max-width">
            <Switch>
              <Route exact={true} path={ROUTES.login} component={LoginComponent} />
              <Route exact={true} path="/get-started" component={SignupComponent} />
              <Route exact={true} path="/dashboard" component={Resumes} />
              <Route path="/resumes/:rId/edit" component={EditResume} />
              <Route exact={true} path="/resume" component={ResumeBuilder} />
            </Switch>
          </div>
        </TopAppBarFixedAdjust>
      </ThemeProvider>
    );
  }
}

export const AppComponent = withNamespaces()(App);
