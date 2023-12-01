import React, { useRef, useState } from 'react';
import { View, Button, TouchableOpacity, ActivityIndicator} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { WebView } from 'react-native-webview';
import { AntDesign } from '@expo/vector-icons';

type Props = {
  navigation: DrawerNavigationProp<any>;
  route: any;
};

const HomeScreen: React.FC<Props> = ({ route }) => {
  const { url } = route.params; // 获取传递的 URL 参数
  const webviewRef = useRef<WebView>(null);

  const goBack = () => {
    webviewRef.current?.goBack();
  };

  const goForward = () => {
    webviewRef.current?.goForward();
  };

  return (
    <View className='flex flex-1'>
      <View className='flex flex-row justify-between px-[10px] py-[10px] bg-white'>
        <TouchableOpacity onPress={goBack}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={goForward}>
          <AntDesign name="rightcircleo" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        style={{ flex: 1 }} 
      />
    </View>
  );
};

export default HomeScreen;
