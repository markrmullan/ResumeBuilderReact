import Button from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import TopAppBar, { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import React, { Component } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { Route, Switch } from 'react-router';
import './App.scss';
import { LoginComponent } from './LoginComponent/component';
import { SignupComponent } from './SignupComponent/component';

class App extends Component<WithNamespaces> {
  public render() {
    const { t } = this.props;

    return (
      <>
        <TopAppBar
          title={t('xhr')}
          navigationIcon={<MaterialIcon
            icon="menu"
            onClick={() => undefined}
          />}
          actionItems={
            [
              <Button
                key={1}
                unelevated={true}
                href="login"
              >
                {t('log_in')}
              </Button>,
              <Button
                key={2}
                raised={true}
                href="get-started"
              >
                {t('sign_up')}
              </Button>
            ]
          }
        />
        <TopAppBarFixedAdjust>
          <Switch>
            <Route exact={true} path="/login" component={LoginComponent} />
            <Route exact={true} path="/get-started" component={SignupComponent} />
          </Switch>
        </TopAppBarFixedAdjust>
      </>
    );
  }
}

export const AppComponent = withNamespaces()(App);
