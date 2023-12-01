import React, {useState, useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DrawerNavigator from './components/DrawerNavigator'

const App = () => {

  return (
    <SafeAreaProvider>
      <DrawerNavigator/>
    </SafeAreaProvider>
  );
};

export default App;
