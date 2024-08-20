import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SvgXml } from 'react-native-svg';
import { messageSvg, shareSvg } from './Svgs.jsx';

export default function SideActions() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(800);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
  };

  return (
    <View style={styles.sideActions}>
      <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
        <LinearGradient 
          colors={isLiked ? ['#ff4d4d', '#ff8080'] : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.3)']} 
          style={styles.actionIcon}
        >
          <Icon name="heart" size={28} color="white" />
        </LinearGradient>
        <Text style={styles.actionCount}>{likeCount}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <LinearGradient 
          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.3)']} 
          style={styles.actionIcon}
        >
          <SvgXml xml={messageSvg} width={28} height={28} fill="white" />
        </LinearGradient>
        <Text style={styles.actionCount}>500</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <LinearGradient 
          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.3)']} 
          style={styles.actionIcon}
        >
          <SvgXml xml={shareSvg} width={28} height={28} fill="white" />
        </LinearGradient>
        <Text style={styles.actionCount}>250</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sideActions: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCount: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
});