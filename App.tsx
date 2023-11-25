import React, {useState, useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appearance, Pressable, Text, View } from 'react-native';
import { withExpoSnack, styled, useColorScheme } from 'nativewind';

import Calendar from './components/Calendar'

const StyledPressable = styled(Pressable)
const StyledText = styled(Text)
// const StyleCalendar =styled(Calendar)

const App = () => {
  const [selected, setSelected] = useState('');
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';

  return (
    <SafeAreaProvider>
      {/* <StyleCalendar selected={selected} setSelected={setSelected}  backgroundColor={backgroundColor}/> */}
      <StyledPressable
        onPress={toggleColorScheme}
        className="flex-1 items-center justify-center dark:bg-slate-800"
      >
        <StyledText
          selectable={false}
          className="dark:text-white"
        >
          {`Try clicking me! ${colorScheme === "dark" ? "🌙" : "🌞"}`}
        </StyledText>
      </StyledPressable>
    </SafeAreaProvider>
  );
};

export default App;
