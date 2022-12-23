import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, Vibration } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';



export default function App() {

  var imageSource = require('../Shotty/assets/white-claw-black-cherry-us3.png')
  var image2Source = require('../Shotty/assets/white-claw-with-hole.png')

  const [source, setSource] = useState(imageSource);
  const [imagingSource, setImageSource] = useState(imageSource);

  const [sound, setSound] = useState();


  async function thumbHoleSound() {
    // console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('./assets/can-open.mp3')
    );
    setSound(sound);

    // console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
        // console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  const putHole = () => {
    thumbHoleSound()
    setSource(imageSource === imageSource ? image2Source : imageSource);
    Vibration.vibrate()


  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [tilt, setTilt] = useState(null);

  // useEffect(() => {
  //   async function startAccelerometer() {
  //     try {
  //       Accelerometer.setUpdateInterval(100);
  //       Accelerometer.addListener(async accelerometerData => {
  //         if (accelerometerData.z > 0.5) {
  //           if (!isPlaying) {
  //             setIsPlaying(true);
  //             sound = new Audio.Sound();
  //             try {
  //               await sound.loadAsync(require('./assets/gulping.mp3'));
  //               await sound.playAsync();
  //             } catch (error) {
  //               console.log('error playing sound', error);
  //             }
  //           }
  //         } else {
  //           if (isPlaying) {
  //             setIsPlaying(false);
  //             try {
  //               await sound.stopAsync();
  //               await sound.unloadAsync();
  //             } catch (error) {
  //               console.log('error stopping sound', error);
  //             }
  //           }
  //         }
  //       });
  //     } catch (error) {
  //       console.log('error starting accelerometer', error);
  //     }
  //   }

  //   startAccelerometer();

  //   return () => {
  //     Accelerometer.removeAllListeners();
  //   };
  // }, []);



  useEffect(() => {
    const subscription = Accelerometer.addListener(acceleration => {
      if (acceleration.z < 0.5) {
        setTilt('forward');
      } else if (acceleration.z > 0.5) {
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
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Uncomment to see the effected area
    height: '38%',
    width: '70%',
    underlayColor: null
  }
});


