import React, { Component } from 'react';
import TopAppBar, { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';
import './App.scss';

class App extends Component {
  render() {
    return (
      <>
        <TopAppBar
          title='Miami, FL'
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

export default App;
