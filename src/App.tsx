import React, { Component } from 'react';
import TopAppBar, { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';
import './App.scss';
import { withNamespaces, WithNamespaces } from 'react-i18next';

class App extends Component<WithNamespaces> {
  render() {
    const { t } = this.props;

    return (
      <>
        <TopAppBar
          title={t('welcome')}
          navigationIcon={<MaterialIcon
            icon='menu'
            onClick={() => console.log('click')}
          />}
          actionItems={[<MaterialIcon key='item' icon='bookmark' />]}
        />
        <TopAppBarFixedAdjust>
          My exciting content!
        </TopAppBarFixedAdjust>
      </>
    );
  }
}

export default withNamespaces()(App);
