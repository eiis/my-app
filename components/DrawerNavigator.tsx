import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, Modal, StyleSheet,Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DefaultTheme, DarkTheme,useTheme } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import HomeScreen from './HomeScreen';
import DefaultScreen from './DefaultScreen';

const Drawer = createDrawerNavigator();


type UrlObject = {
  index: number;
  url: string;
  title:string,
  image:string
};

export default function DrawerNavigator() {
  
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [urls, setUrls] = useState<UrlObject[]>([]);

  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      // primary: 'rgb(255, 45, 85)',
      card: 'rgb(30,41,59)',
      text: 'rgb(199, 199, 204)',
      // border: 'rgb(199, 199, 204)',
      // notification: 'rgb(255, 69, 58)',
    },
  };
  
  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      // primary: 'rgb(255, 45, 85)',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      // border: 'rgb(199, 199, 204)',
      // notification: 'rgb(255, 69, 58)',
    },
  };
  


  useEffect(() => {
    // 获取存储的URLs
    const loadUrls = async () => {
      try {
        const urlsString = await AsyncStorage.getItem('urls');
        console.log(urlsString,'DrawerNavigator');
        
        if (urlsString) {
          const storedUrls = JSON.parse(urlsString);
          setUrls(storedUrls);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadUrls();
  }, []);
  


  // 动态生成 Drawer.Screen
  const screens = urls.length > 0 ? urls.map((urlObject, index) => 
    <Drawer.Screen 
      name={urlObject.title ? urlObject.title :urlObject.url } // 使用 urlObject.index 作为屏幕名称
      component={HomeScreen}
      initialParams={{ 
        url: urlObject.url,
        // onRefresh: handleRefresh,
      }} // 使用 urlObject.url 作为参数
      key={index} 
    />
  ) : (
    // 如果 urls 为空，渲染一个默认的屏幕
    <Drawer.Screen 
      name="default-screen" 
      component={DefaultScreen} // 替换为您的默认屏幕组件
    />
  );

  const loadUrls = async () => {
    try {
      const urlsString = await AsyncStorage.getItem('urls');
      
      if (urlsString) {
        const storedUrls = JSON.parse(urlsString);
        setUrls(storedUrls);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 添加屏幕的函数
  const addScreen = async () => {
    
    // 校验URL
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

     // 如果 URL 校验通过
     if (urlPattern.test(url)) {
      // 保存 URL 到状态和本地存储
      try {
        // 构建一个带有 index 的新对象数组
      const newIndex = urls.length;
      const newUrlObject = { index: newIndex, url: url,title:'',image:'' };
      const newUrls = [...urls, newUrlObject];

      // 更新状态
      setUrls(newUrls);
        
      await AsyncStorage.setItem('urls', JSON.stringify(newUrls));
      // loadUrls()

      } catch (e) {
        console.error(e);
      }

      setModalVisible(false); // 关闭模态框
      setUrl(''); // 重置 URL 输入
    } else {
      Alert.alert("错误", "请输入一个有效的URL。");
    }
  };

  const clearAllUrls = async () => {
    try {
      // 清空状态中的 urls 数组
      setUrls([]);
  
      // 从 AsyncStorage 中删除 'urls' 键及其数据
      await AsyncStorage.removeItem('urls');
      const urlsString = await AsyncStorage.getItem('urls');

      console.log(urls,'urls',urlsString);
      
    } catch (e) {
      console.error(e);
    }
  };
  

  const  CustomDrawerContent = (props:any) => {
    return (
      <DrawerContentScrollView {...props} style={colorScheme === 'dark' ? styles.br: styles.unbr }>
        <View style={colorScheme === 'dark' ? styles.actionBar: styles.unactionBar }>
          <TouchableOpacity style={styles.actionButton} onPress={loadUrls}>
            <AntDesign name="reload1" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={()=>clearAllUrls()}>
            <AntDesign name="delete" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
      <Drawer.Navigator
        screenOptions={{
          drawerType:"slide",
          overlayColor:"transparent"
        }}
        initialRouteName="111"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        {screens}
      </Drawer.Navigator>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              onChangeText={setUrl}
              value={url}
              placeholder="输入URL"
            />
            <View className='flex flex-row'>
            <Button title="取消" onPress={()=>setModalVisible(false)} />
            <Button title="保存" onPress={addScreen} />
            </View>
          </View>
        </View>
      </Modal>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  br:{
    backgroundColor: 'rgb(30 41 59)', // 或者任何其他颜色
  },
  unbr:{
    backgroundColor: 'rgb(255, 255, 255)', // 或者任何其他颜色
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgb(30 41 59)', // 或者任何其他颜色
  },
  unactionBar:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgb(255, 255, 255)', // 或者任何其他颜色
  },
  actionButton: {
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
});
