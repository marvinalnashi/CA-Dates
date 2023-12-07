import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import AppReducer from './src/reducers';
import AppNavigator from './src/navigators/AppNavigator';

export const getStore = createStore(AppReducer);

class App extends React.Component {
  render() {
    return (
        <Provider store={getStore}>
          <AppNavigator />
        </Provider>
    );
  }
}

export default App;
