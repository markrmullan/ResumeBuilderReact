import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import TopAppBar, { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';
import './App.scss';
import { withNamespaces, WithNamespaces } from 'react-i18next';
import Button from '@material/react-button';
import { LoginComponent } from './LoginComponent/component';

class App extends Component<WithNamespaces> {
  render() {
    const { t } = this.props;

    return (
      <>
        <TopAppBar
          title={t('xhr')}
          navigationIcon={<MaterialIcon
            icon='menu'
            onClick={() => console.log('click')}
          />}
          actionItems={
            [
              <Button href='login'>
                {t('log_in')}
              </Button>
            ]
          }
        />
          <Switch>
            <Route exact={true} path='/login' component={LoginComponent} />
          </Switch>
        <TopAppBarFixedAdjust>
          My exciting content!
        </TopAppBarFixedAdjust>
      </>
    );
  }
}

export default withNamespaces()(App);
