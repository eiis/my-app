import React from 'react';
import { Calendar } from 'react-native-calendars';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CalendarComponentProps {
  selected: string;
  setSelected: (date: string) => void;
  backgroundColor: string;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ selected, setSelected, backgroundColor }) => {
  console.log(backgroundColor);
  
  return (
    <></>
    // <SafeAreaView style={{backgroundColor}}>
    //   <Calendar
    //     onDayPress={day => {
    //       setSelected(day.dateString);
    //     }}
    //     markedDates={{
    //       [selected]: {selected: true, disableTouchEvent: true, selectedColor: 'orange'}
    //     }}
    //   />
    // </SafeAreaView>
  );
};

export default CalendarComponent;
