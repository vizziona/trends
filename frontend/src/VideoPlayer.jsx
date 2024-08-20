import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

export default function VideoPlayer({ isPlaying, setIsPlaying }) {
  const videoRef = useRef(null);

  const handleVideoPress = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.videoContainer} 
      onPress={handleVideoPress}
      activeOpacity={1}
    >
      <Video
        ref={videoRef}
        source={require('../../assets/images/try.mp4')}
        style={styles.video}
        resizeMode="cover"
        isLooping
        shouldPlay={isPlaying}
        isMuted={false}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});