import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';


export default function App() {


  var imageSource = require('../Shotty/assets/white-claw-black-cherry-us3.png')
  var image2Source = require('../Shotty/assets/white-claw-with-hole.png')

  const [source, setSource] = useState(imageSource);

  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    setTimeout(() => {
      console.log('Button pressed 5 seconds ago');
    }, 5000);
  };

  const [pressTimer, setPressTimer] = useState(null);


  useEffect(() => {
    if (isPressed) {
      setPressTimer(setTimeout(() => {
        console.log('Button held for 5 seconds');
      }, 5000));
    } else {
      clearTimeout(pressTimer);
    }
  }, [isPressed, pressTimer]);

  return (
    <View style={styles.container}>

      <Image
        source={source}
        style={{ height: "95%", width: "95%" }}
      />

      <TouchableOpacity
        style={styles.touchableStyle}
        // onPress={() => {
        //   console.log("Pressed!")
        //   handlePress()
        //   setSource(imageSource)
        // }}
        onPressIn={() => { setIsPressed(true) }}
        onPressOut={() => { setIsPressed(false) }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: '10%',
    height: '10%',
  },
  touchableStyle: {
    position: 'absolute',
    bottom: '3%',
    // backgroundColor: 'rgba(255, 0, 0, 0.5)', // Uncomment to see the effected area
    height: '38%',
    width: '70%',
    underlayColor: null
  }
});


