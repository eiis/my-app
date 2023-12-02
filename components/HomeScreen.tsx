import React, { useRef, useState, useEffect } from 'react';
import { View, Button, TouchableOpacity, ActivityIndicator, useColorScheme} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { AntDesign } from '@expo/vector-icons';
import { WebViewNavigationEvent, WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';

type Props = {
  navigation: DrawerNavigationProp<any>;
  route: any;
};

const HomeScreen: React.FC<Props> = ({ route }) => {
  const { url } = route.params; // 获取传递的 URL 参数
  const webviewRef = useRef<WebView>(null);

  const colorScheme = useColorScheme()

  const savePageData = async (url: string, title: string, image: string) => {
    try {
      // 从 AsyncStorage 获取当前存储的 URLs 数据
      const urlsString = await AsyncStorage.getItem('urls');
      let urls = urlsString ? JSON.parse(urlsString) : [];
  
      // 查找当前 URL 对应的对象，并更新它
      const urlIndex = urls.findIndex((obj: any) => obj.url === url);
      if (urlIndex !== -1) {
        urls[urlIndex] = { ...urls[urlIndex], title, image };
        await AsyncStorage.setItem('urls', JSON.stringify(urls));
        // if (route.params.onRefresh) {
        //   route.params.onRefresh();
        // }
        const urlsString = await AsyncStorage.getItem('urls');
        console.log(urlsString,'HomeScreen');
      }
    } catch (e) {
      console.error(e);
    }
  };
  

  const goBack = () => {
    webviewRef.current?.goBack();
  };

  const goForward = () => {
    webviewRef.current?.goForward();
  };

  const injectedJavaScriptForImages = `
    setTimeout(() => {
      const image = document.getElementsByTagName('img')[0]?.src || '';
      const title = document.title || '';
      window.ReactNativeWebView.postMessage(JSON.stringify({image, title}));
    }, 1000);
    true;
  `;

  const onNavigationStateChange = (event: WebViewNavigation) => {
    if (!event.loading) {
      // 页面加载完成
      // console.log(event.title, 'navState');
      // setPageTitle(event.title || ''); // 确保不设置undefined或null
    }
  };

  const onWebViewMessage = (event: WebViewMessageEvent) => {
    const { image, title } = JSON.parse(event.nativeEvent.data);

    // console.log(image,title,'onWebViewMessage');
    
    // setPageImage(image);
    // setPageTitle(title);
    // 这里你可以将标题和图片保存到 AsyncStorage
    savePageData(url, title, image);
  };
  
  

  return (
    <View className='flex flex-1 bg-[blue] dark:bg-slate-800'>
      {/* <View className='flex flex-row justify-between px-[10px] py-[10px]'>
        <TouchableOpacity onPress={goBack}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={goForward}>
          <AntDesign name="rightcircleo" size={24} color="black" />
        </TouchableOpacity>
      </View> */}
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        style={{ flex: 1 }} 
        forceDarkOn={colorScheme === 'dark'}
        // onNavigationStateChange={onNavigationStateChange}
        injectedJavaScript={injectedJavaScriptForImages}
        mediaPlaybackRequiresUserAction={true} // iOS
        allowsInlineMediaPlayback={true} // iOS & Android
        onMessage={onWebViewMessage}
      />
    </View>
  );
};

export default HomeScreen;
