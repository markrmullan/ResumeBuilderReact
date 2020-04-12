import React, { createContext, Component } from 'react';
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
import { User } from 'utils/models';
import { getCurrentUser } from 'utils/requests';

import './App.scss';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple
  }
});

const CurrentUserContext = createContext(undefined);

type AppState = {
  currentUser?: User;
};

class App extends Component<WithNamespaces, AppState> {
  public state = {
    currentUser: undefined
  };

  public render() {
    const { t } = this.props;
    const { currentUser } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <CurrentUserContext.Provider value={currentUser}>
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
        </CurrentUserContext.Provider>
      </ThemeProvider>
    );
  }

  public async componentDidMount() {
    const currentUser: User = await getCurrentUser();

    this.setState({ currentUser });
  }
}

export const AppComponent = withNamespaces()(App);
