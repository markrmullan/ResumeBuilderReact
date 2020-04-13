import React, { Component } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { deepPurple } from '@material-ui/core/colors';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MaterialIcon from '@material/react-material-icon';
import TopAppBar, { TopAppBarFixedAdjust } from '@material/react-top-app-bar';

import { Dashboard } from 'DashboardComponent';
import { EditResume } from 'EditResume';
import { LoginComponent } from 'LoginComponent';
import { ResumeBuilder } from 'ResumeBuilderComponent';
import { SignupComponent } from 'SignupComponent';

import { ROUTES } from 'utils/constants';
import { CurrentUserContextImpl } from 'utils/contexts';
import { User } from 'utils/models';
import { fetchCurrentUser, patchCurrentUser } from 'utils/requests';

import './App.scss';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple
  }
});

type AppState = {
  currentUser: User;
};

class App extends Component<WithNamespaces, AppState> {
  public state = {
    currentUser: {} as User
  };

  public render() {
    const { t } = this.props;
    const { currentUser } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <CurrentUserContextImpl.Provider value={{
          user: currentUser,
          updateUser: (currentUser: User) => this.setState({ currentUser }),
          patchCurrentUser: async (toUpdate: User) => patchCurrentUser(toUpdate)
        }}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TopAppBar
              title={t('app_name')}
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
              <Switch>
                <Route exact path={ROUTES.login} component={LoginComponent} />
                <Route exact path="/get-started" component={SignupComponent} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route path="/resumes/:rId/edit" component={EditResume} />
                <Route exact path="/resume" component={ResumeBuilder} />
              </Switch>
            </TopAppBarFixedAdjust>
          </MuiPickersUtilsProvider>
        </CurrentUserContextImpl.Provider>
      </ThemeProvider>
    );
  }

  public async componentDidMount() {
    const currentUser: User = await fetchCurrentUser();

    this.setState({ currentUser });
  }
}

export const AppComponent = withNamespaces()(App);
