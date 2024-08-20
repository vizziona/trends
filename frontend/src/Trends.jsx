import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Header.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import UserInfo from './UserInfo.jsx';
import SideActions from './SideActions.jsx';
import DonateButtons from './DonateButtons.jsx';
import BackButton from './BackButton.jsx';
import SearchPopup from './SearchPopup.jsx';
import GridPopup from './GridPopup.jsx';

export default function Trends() {
  const [showSearchPopup, setShowSearchPopup] = React.useState(false);
  const [showGridPopup, setShowGridPopup] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(true);

  return (
    <View style={styles.container}>
      <Header 
        setShowSearchPopup={setShowSearchPopup} 
        setShowGridPopup={setShowGridPopup} 
      />
      <VideoPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      <UserInfo />
      <SideActions />
      <DonateButtons />
      <BackButton />
      <SearchPopup 
        showSearchPopup={showSearchPopup} 
        setShowSearchPopup={setShowSearchPopup} 
      />
      <GridPopup 
        showGridPopup={showGridPopup} 
        setShowGridPopup={setShowGridPopup} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});