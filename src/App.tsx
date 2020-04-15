import React, { Component } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { deepPurple } from '@material-ui/core/colors';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { Dashboard } from 'DashboardComponent';
import { EditResume } from 'EditResume';
import { LoginComponent } from 'LoginComponent';
import { SignupComponent } from 'SignupComponent';
import { TopAppHeader } from 'common/TopAppHeader';

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
    const { currentUser } = this.state;

    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CurrentUserContextImpl.Provider value={{
            user: currentUser,
            updateUser: (currentUser: User) => this.setState({ currentUser }),
            patchCurrentUser: async (toUpdate: User) => patchCurrentUser(toUpdate)
          }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <TopAppHeader />
              <Switch>
                <Route exact path={ROUTES.login} component={LoginComponent} />
                <Route exact path="/get-started" component={SignupComponent} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route path="/resumes/:rId/edit" component={EditResume} />
              </Switch>
            </MuiPickersUtilsProvider>
          </CurrentUserContextImpl.Provider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  public async componentDidMount() {
    const currentUser: User = await fetchCurrentUser();

    this.setState({ currentUser });
  }
}

export const AppComponent = withNamespaces()(App);
