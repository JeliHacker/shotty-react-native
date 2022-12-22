import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';


export default function App() {


  var imageSource = require('../Shotty/assets/white-claw-black-cherry-us3.png')
  var image2Source = require('../Shotty/assets/white-claw-with-hole.png')

  const [source, setSource] = useState(imageSource);
  const [imagingSource, setImageSource] = useState(imageSource);

  const putHole = () => {
    setSource(imageSource === imageSource ? image2Source : imageSource);
  }

  const [tilt, setTilt] = useState(null);

  useEffect(() => {
    const subscription = Accelerometer.addListener(acceleration => {
      if (acceleration.z < 0) {
        setTilt('forward');
      } else if (acceleration.z > 0) {
        setTilt('backward');
      } else {
        setTilt(null);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>

      <Image
        source={imagingSource}
        style={{ height: "95%", width: "95%" }}
      />

      <TouchableOpacity
        style={styles.touchableStyle}
        onLongPress={() => {
          putHole()
          setImageSource(imagingSource === imageSource ? image2Source : imageSource);
        }}
        delayLongPress={800}
      />
      <View>
        <Text>{tilt === 'forward' ? 'Phone is tilted forward' : 'Phone is not tilted forward'}</Text>
      </View>
      <StatusBar style="auto" />
    </View >
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


