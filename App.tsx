import React, {useState, useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text} from 'react-native';
import DrawerNavigator from './components/DrawerNavigator'

const App = () => {

  return (
    <SafeAreaProvider className='flex flex-1 bg-[red] dark:bg-slate-800'>
      <View className='flex flex-1 bg-[red] dark:bg-slate-800'>
        <DrawerNavigator/>
      </View>
    </SafeAreaProvider>
  );
};

export default App;
