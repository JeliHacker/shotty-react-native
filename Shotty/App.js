import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, Vibration } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';


const TILTINGPOINT = -0.3
const TARGET_DURATION = 3000; // target duration in milliseconds

export default function App() {

  var canWithoutHole = require('../Shotty/assets/white-claw-black-cherry-us3.png');
  var canWithHole = require('../Shotty/assets/white-claw-hole-unpopped.png');

  const [imageSource, setImageSource] = useState(canWithoutHole);

  async function playThumbHoleSound() {

    const { sound } = await Audio.Sound
      .createAsync(require('./assets/thumb-gun-2.mp3'))
      .catch((error) => { console.log(error) });


    await sound.playAsync();
  }




  const [fizzIsLoaded, setFizzIsLoaded] = useState(false);
  const fizzSoundObject = useRef(new Audio.Sound());

  const loadFizzSound = async () => {
    if (!fizzIsLoaded) {
      await fizzSoundObject.current.loadAsync(require('./assets/fizz.mp3')).catch((error) => { console.log(error) });
      setFizzIsLoaded(true);
    }
  };

  loadFizzSound()

  async function playFizzSound() {
    console.log("I'm playing the fizz sound!!")
    await fizzSoundObject.current.playAsync().catch((error) => { console.log(error) });
    await fizzSoundObject.current.setIsLoopingAsync(true).catch((error) => { console.log(error) });
  }

  const stopFizzSound = async () => {
    try {
      await fizzSoundObject.current.stopAsync().catch((error) => { console.log(error) });
      await fizzSoundObject.current.setPositionAsync(0).catch((error) => { console.log(error) });
    } catch (error) {
      console.log(error);
    }
  }






  const [isLoaded, setIsLoaded] = useState(false);

  const soundObject = useRef(new Audio.Sound());

  const loadGulpSound = async () => {
    if (!isLoaded) {
      await soundObject.current.loadAsync(require('./assets/gulping.mp3')).catch((error) => { console.log(error) });
      setIsLoaded(true);
    }
  };

  loadGulpSound()

  async function playGulpSound() {

    await soundObject.current.playAsync().catch((error) => { console.log(error) });
    await soundObject.current.setIsLoopingAsync(true).catch((error) => { console.log(error) });

  }

  const stopGulpSound = async () => {
    try {
      await soundObject.current.stopAsync().catch((error) => { console.log(error) });
      await soundObject.current.setPositionAsync(0).catch((error) => { console.log(error) });
    } catch (error) {
      console.log(error);
    }
  }


  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function wait() {
    console.log('Waiting...');
    await sleep(1000);
    console.log('Done waiting');
  }

  const putHole = async () => {
    setImageSource(imageSource === canWithoutHole ? canWithHole : canWithoutHole);
    playThumbHoleSound()
    Vibration.vibrate()
  }

  /* ---------------------------- Timer ---------------------------- */
  const [isTiltedForward, setIsTiltedForward] = useState(false);
  const [tiltedDuration, setTiltedDuration] = useState(0);

  useEffect(() => {
    const subscription = Accelerometer.addListener(acceleration => {
      if (acceleration.z > TILTINGPOINT) {
        setIsTiltedForward(true);
      } else if (acceleration.z < TILTINGPOINT) {
        setIsTiltedForward(false);
        // console.log("tiltedDuration " + tiltedDuration)
        setTiltedDuration(tiltedDuration);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [tiltedDuration]);

  useEffect(() => {
    let interval;
    if (isTiltedForward) {
      interval = setInterval(() => {
        setTiltedDuration(tiltedDuration + 100);

        if (tiltedDuration >= TARGET_DURATION) {
          console.log('Phone has been tilted forward for 3 seconds!');
          clearInterval(interval);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTiltedForward, tiltedDuration]);




  /* ---------------------------- Accelerometer ---------------------------- */

  const [tilt, setTilt] = useState(null);

  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(setData)
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  Accelerometer.setUpdateInterval(500) // TODO: change to 100 for launch


  useEffect(() => {
    const subscription = Accelerometer.addListener(acceleration => {
      if (acceleration.z < TILTINGPOINT) {
        setTilt('backward');
        stopGulpSound();
      } else if (acceleration.z > TILTINGPOINT) {
        setTilt('forward');
        playGulpSound();
      } else {
        console.log("You must've encountered some nasty error if you're getting this console.log message.")
        setTilt(null);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);


  /* ---------------------------- Fizz Sound ---------------------------- */

  // Play the sound when the image source changes
  useEffect(() => {
    if (imageSource === canWithHole) {
      (async () => {
        try {
          setTimeout(playFizzSound, 500);

          console.log("imageSource is currently!" + imageSource);
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      stopFizzSound();
      console.log("imageSource must be can without hole!")
    }
  }, [imageSource]);

  /* ---------------------------- Return ---------------------------- */

  return (
    <View style={styles.container}>

      <Image
        source={imageSource}
        style={{ height: "95%", width: "95%" }}
      />

      {imageSource === canWithHole && z > TILTINGPOINT ? (
        <Image
          source={require('../Shotty/assets/waterfall-cropped-more.gif')}
          style={styles.waterfall}
        />
      ) : (
        <View />
      )}
      <TouchableOpacity
        style={styles.touchableStyle}
        onLongPress={() => {
          putHole()
        }}
        delayLongPress={500}
      />
      <View style={{ alignContent: 'center', alignItems: 'center' }}>
        <Text>{tilt === 'forward' ? 'Phone is tilted forward' : 'Phone is not tilted forward'} z: {Math.round(z * 1000) / 1000}</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}


/* ---------------------------- Styling ---------------------------- */

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
    backgroundColor: 'rgba(255, 0, 0, 0.3)', // Uncomment to see the effected area
    height: '38%',
    width: '70%',
    underlayColor: null
  },
  waterfall: {
    position: 'absolute',
    bottom: '3%',
    width: '25%',
  }
});


