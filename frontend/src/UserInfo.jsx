import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function UserInfo() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(700);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowerCount(prevCount => isFollowing ? prevCount - 1 : prevCount + 1);
  };

  return (
    <View style={styles.userInfo}>
      <View style={styles.username}>
        <Image
          source={{ uri: 'https://cdn.pixabay.com/photo/2023/07/30/09/12/red-hair-girl-8158373_640.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.usernameText}>bonheur</Text>
      </View>
      <Text style={styles.description}>The best platform ever!</Text>
      <Text style={styles.followers}>{followerCount} followers</Text>
      <TouchableOpacity 
        style={[styles.followBtn, isFollowing && styles.followingBtn]} 
        onPress={handleFollow}
      >
        <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  username: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  usernameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.8,
  },
  followers: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  followBtn: {
    backgroundColor: '#09b557',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  followingBtn: {
    backgroundColor: 'white',
  },
  followBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  followingBtnText: {
    color: 'black',
  },
});