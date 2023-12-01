import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, Modal, StyleSheet,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import HomeScreen from './HomeScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const [modalVisible, setModalVisible] = useState(false);
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState(['https://www.baidu.com']); // 默认的屏幕名称

  useEffect(() => {
    // 获取存储的URLs
    const loadUrls = async () => {
      try {
        const urlsString = await AsyncStorage.getItem('urls');
        if (urlsString) {
          setUrls(JSON.parse(urlsString));
        }
      } catch (e) {
        // 读取错误
        console.error(e);
      }
    };

    loadUrls();
  }, []);


  // 动态生成 Drawer.Screen
  const screens = urls.map((url, index) => 
    <Drawer.Screen 
      name={url} 
      component={HomeScreen}
      initialParams={{ url: url }} 
      key={index} 
    />
  );

  // 添加屏幕的函数
  const addScreen = async () => {
    // 校验URL
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if (!urlPattern.test(url)) {
      Alert.alert("错误", "请输入一个有效的URL。");
      return;
    }

    // 保存到状态和本地存储
    try {
      const newUrls = [...urls, url];
      setUrls(newUrls);
      await AsyncStorage.setItem('urls', JSON.stringify(newUrls));
    } catch (e) {
      // 保存错误
      console.error(e);
    }

    setModalVisible(false);
    setUrl(''); // 重置URL输入
  };

  const  CustomDrawerContent = (props:any) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem label="Add" icon={() => <AntDesign name="pluscircleo" size={24} color="black" />} onPress={() => setModalVisible(true)} />
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
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
