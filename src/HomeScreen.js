import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Implement logout functionality here
    navigation.replace('Login'); // Navigate back to login screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Music App</Text>

      <Text style={styles.subtitle}>Discover your favorite tunes</Text>

      {/* Featured Music Section */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.albumContainer}>
            <Image
              style={styles.albumCover}
              source={{ uri: 'https://via.placeholder.com/150' }} // Add album cover image URLs here
            />
            <Text style={styles.albumName}>Album 1</Text>
          </View>
          <View style={styles.albumContainer}>
            <Image
              style={styles.albumCover}
              source={{ uri: 'https://via.placeholder.com/150' }}
            />
            <Text style={styles.albumName}>Album 2</Text>
          </View>
          <View style={styles.albumContainer}>
            <Image
              style={styles.albumCover}
              source={{ uri: 'https://via.placeholder.com/150' }}
            />
            <Text style={styles.albumName}>Album 3</Text>
          </View>
        </ScrollView>
      </View>

      {/* Music Genres Section */}
      <View style={styles.genresSection}>
        <Text style={styles.sectionTitle}>Genres</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.genreButton}>
            <Text style={styles.genreText}>Pop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.genreButton}>
            <Text style={styles.genreText}>Rock</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.genreButton}>
            <Text style={styles.genreText}>Hip-hop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.genreButton}>
            <Text style={styles.genreText}>Classical</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#bbb',
    marginBottom: 20,
  },
  featuredSection: {
    width: '100%',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  albumContainer: {
    marginRight: 20,
    alignItems: 'center',
  },
  albumCover: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  albumName: {
    marginTop: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  genresSection: {
    width: '100%',
    marginBottom: 40,
  },
  genreButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
