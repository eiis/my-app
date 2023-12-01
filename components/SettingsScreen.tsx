import React from 'react';
import { View, Text, Button } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type Props = {
  navigation: DrawerNavigationProp<any>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Setting Screen</Text>
      <Button onPress={() => navigation.toggleDrawer()} title="Open Drawer" />
    </View>
  );
};

export default HomeScreen;
