import React from 'react';
import { Modal, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function SearchPopup({ showSearchPopup, setShowSearchPopup }) {
  return (
    <Modal
      visible={showSearchPopup}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSearchPopup(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={() => setShowSearchPopup(false)}
      >
        <View style={styles.searchPopup}>
          <TextInput 
            placeholder="Search..." 
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={styles.searchInput} 
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchPopup: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 20,
    width: '80%',
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 10,
    color: 'white',
  },
});