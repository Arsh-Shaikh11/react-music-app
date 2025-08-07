// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, TouchableOpacity, TextInput, Image, StyleSheet, Platform } from "react-native";
// import axios from "axios";
// import { Audio } from "expo-av";

// const UserScreen = () => {
//     const [artists, setArtists] = useState([]);
//     const [songs, setSongs] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filteredArtists, setFilteredArtists] = useState([]);
//     const [selectedArtist, setSelectedArtist] = useState(null);
//     const [sound, setSound] = useState(null);
//     const [currentSongId, setCurrentSongId] = useState(null);

//     useEffect(() => {
//         fetchArtists();
//     }, []);

//     const fetchArtists = async () => {
//         const baseUrl = Platform.OS === "web" ? "http://localhost:5000" : "http://10.0.2.2:5000";
//         try {
//             const response = await axios.get(`${baseUrl}/artists`);
//             setArtists(response.data);
//             setFilteredArtists(response.data);
//         } catch (error) {
//             console.error("Error fetching artists:", error);
//         }
//     };

//     const fetchSongsByArtist = async (artistId) => {
//         const baseUrl = Platform.OS === "web" ? "http://localhost:5000" : "http://10.0.2.2:5000";
//         try {
//             const response = await axios.get(`${baseUrl}/songs/artist/${artistId}`);
//             setSongs(response.data);
//             setSelectedArtist(artistId);
//         } catch (error) {
//             console.error("Error fetching songs:", error);
//         }
//     };

//     const playSong = async (audioPath, songId) => {
//         try {
//             if (sound) await sound.unloadAsync();
//             const audioUrl = `http://localhost:5000/${audioPath}`;
//             const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl }, { shouldPlay: true });
//             setSound(newSound);
//             setCurrentSongId(songId);
//         } catch (error) {
//             console.error("Error playing audio:", error);
//             alert("Failed to play audio.");
//         }
//     };

//     const stopSong = async () => {
//         if (sound) {
//             await sound.unloadAsync();
//             setSound(null);
//             setCurrentSongId(null);
//         }
//     };

//     const handleSearch = (query) => {
//         setSearchQuery(query);
//         if (query.trim() === "") {
//             setFilteredArtists(artists);
//         } else {
//             const filtered = artists.filter((artist) =>
//                 artist.name.toLowerCase().includes(query.toLowerCase())
//             );
//             setFilteredArtists(filtered);
//         }
//     };

//     const renderArtistItem = ({ item }) => (
//         <TouchableOpacity style={styles.artistCard} onPress={() => fetchSongsByArtist(item._id)}>
//             {item.photoPath ? (
//                 <Image
//                     source={{ uri: `http://localhost:5000/${item.photoPath}` }}
//                     style={styles.artistPhoto}
//                     onError={() => console.log(`Failed to load image: ${item.photoPath}`)}
//                 />
//             ) : (
//                 <View style={styles.artistPhotoPlaceholder}>
//                     <Text style={styles.placeholderText}>{item.name[0]}</Text>
//                 </View>
//             )}
//             <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
//         </TouchableOpacity>
//     );

//     const renderSongItem = ({ item }) => (
//         <TouchableOpacity
//             style={[styles.songCard, currentSongId === item._id && styles.playingCard]}
//             onPress={() => playSong(item.audioPath, item._id)}
//         >
//             {item.coverPath ? (
//                 <Image source={{ uri: `http://localhost:5000/${item.coverPath}` }} style={styles.albumArt} />
//             ) : (
//                 <View style={styles.albumArtPlaceholder}>
//                     <Text style={styles.placeholderText}>{item.name[0]}</Text>
//                 </View>
//             )}
//             <View style={styles.songInfo}>
//                 <Text style={styles.songTitle} numberOfLines={1}>{item.name}</Text>
//                 <Text style={styles.artistName}>{item.artist.name}</Text>
//             </View>
//             {currentSongId === item._id && (
//                 <TouchableOpacity style={styles.stopButton} onPress={stopSong}>
//                     <Text style={styles.stopButtonText}>■</Text>
//                 </TouchableOpacity>
//             )}
//         </TouchableOpacity>
//     );

//     return (
//         <View style={styles.container}>
//             <View style={styles.headerContainer}>
//                 <Text style={styles.header}>Artists</Text>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search artists..."
//                     placeholderTextColor="#b3b3b3"
//                     value={searchQuery}
//                     onChangeText={handleSearch}
//                 />
//             </View>

//             {!selectedArtist ? (
//                 <FlatList
//                     data={filteredArtists}
//                     renderItem={renderArtistItem}
//                     keyExtractor={(item) => item._id}
//                     horizontal={true} // Horizontal scroll
//                     showsHorizontalScrollIndicator={false}
//                     contentContainerStyle={styles.artistListContent}
//                 />
//             ) : (
//                 <>
//                     <TouchableOpacity style={styles.backButton} onPress={() => setSelectedArtist(null)}>
//                         <Text style={styles.backButtonText}>← Back to Artists</Text>
//                     </TouchableOpacity>
//                     <FlatList
//                         data={songs}
//                         renderItem={renderSongItem}
//                         keyExtractor={(item) => item._id}
//                         numColumns={2}
//                         columnWrapperStyle={styles.columnWrapper}
//                         contentContainerStyle={styles.listContent}
//                     />
//                 </>
//             )}

//             {currentSongId && (
//                 <View style={styles.playbackBar}>
//                     <Text style={styles.playbackText}>
//                         Now Playing: {songs.find((s) => s._id === currentSongId)?.name}
//                     </Text>
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#121212", paddingTop: 40 },
//     headerContainer: { paddingHorizontal: 16, marginBottom: 20 },
//     header: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 12 },
//     searchInput: {
//         backgroundColor: "#282828",
//         color: "#fff",
//         paddingVertical: 10,
//         paddingHorizontal: 16,
//         borderRadius: 20,
//         fontSize: 16,
//         borderWidth: 1,
//         borderColor: "#404040",
//     },
//     artistListContent: { paddingHorizontal: 16, paddingBottom: 20 },
//     artistCard: { alignItems: "center", marginRight: 16, width: 100 },
//     artistPhoto: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
//     artistPhotoPlaceholder: {
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         backgroundColor: "#333",
//         marginBottom: 8,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     placeholderText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
//     artistName: { fontSize: 14, fontWeight: "600", color: "#fff", textAlign: "center" },
//     songCard: { flex: 1, backgroundColor: "#181818", borderRadius: 8, margin: 8, padding: 10 },
//     playingCard: { borderColor: "#1DB954", borderWidth: 2 },
//     albumArt: { width: "100%", height: 120, borderRadius: 60, marginBottom: 8 }, // Circular cover
//     albumArtPlaceholder: {
//         width: "100%",
//         height: 120,
//         borderRadius: 60,
//         backgroundColor: "#333",
//         marginBottom: 8,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     songInfo: { flex: 1 },
//     songTitle: { fontSize: 16, fontWeight: "600", color: "#fff", marginBottom: 4 },
//     stopButton: {
//         position: "absolute",
//         bottom: 10,
//         right: 10,
//         width: 30,
//         height: 30,
//         backgroundColor: "#1DB954",
//         borderRadius: 15,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     stopButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
//     columnWrapper: { justifyContent: "space-between" },
//     listContent: { paddingHorizontal: 8 },
//     playbackBar: {
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: 60,
//         backgroundColor: "#282828",
//         justifyContent: "center",
//         paddingHorizontal: 16,
//         borderTopWidth: 1,
//         borderTopColor: "#404040",
//     },
//     playbackText: { color: "#fff", fontSize: 14 },
//     backButton: { padding: 10, marginHorizontal: 16, marginBottom: 10 },
//     backButtonText: { color: "#1DB954", fontSize: 16 },
// });

// export default UserScreen;




// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, TouchableOpacity, TextInput, Image, StyleSheet, Platform } from "react-native";
// import axios from "axios";
// import { Audio } from "expo-av";
// import Slider from "@react-native-community/slider";

// const UserScreen = () => {
//     const [artists, setArtists] = useState([]);
//     const [songs, setSongs] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filteredArtists, setFilteredArtists] = useState([]);
//     const [selectedArtist, setSelectedArtist] = useState(null);
//     const [sound, setSound] = useState(null);
//     const [currentSongId, setCurrentSongId] = useState(null);
//     const [position, setPosition] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);

//     const baseUrl = Platform.OS === "web" ? "http://localhost:5000" : "http://10.0.2.2:5000";

//     useEffect(() => {
//         fetchArtists();
//     }, []);

//     useEffect(() => {
//         let interval;
//         if (sound && isPlaying) {
//             interval = setInterval(async () => {
//                 const status = await sound.getStatusAsync();
//                 if (status.isLoaded) {
//                     setPosition(status.positionMillis);
//                     setDuration(status.durationMillis);
//                 }
//             }, 1000);
//         }
//         return () => clearInterval(interval);
//     }, [sound, isPlaying]);

//     const fetchArtists = async () => {
//         try {
//             const response = await axios.get(`${baseUrl}/artists`);
//             setArtists(response.data);
//             setFilteredArtists(response.data);
//         } catch (error) {
//             console.error("Error fetching artists:", error);
//         }
//     };

//     const fetchSongsByArtist = async (artistId) => {
//         try {
//             const response = await axios.get(`${baseUrl}/songs/artist/${artistId}`);
//             setSongs(response.data);
//             setSelectedArtist(artistId);
//         } catch (error) {
//             console.error("Error fetching songs:", error);
//         }
//     };

//     const playSong = async (audioPath, songId) => {
//         try {
//             if (sound) {
//                 await sound.unloadAsync();
//                 setSound(null);
//             }
//             const audioUrl = `${baseUrl}/${audioPath}`;
//             const { sound: newSound } = await Audio.Sound.createAsync(
//                 { uri: audioUrl },
//                 { shouldPlay: true },
//                 (status) => {
//                     if (status.isLoaded) {
//                         setPosition(status.positionMillis);
//                         setDuration(status.durationMillis);
//                         setIsPlaying(status.isPlaying);
//                     }
//                 }
//             );
//             setSound(newSound);
//             setCurrentSongId(songId);
//             setIsPlaying(true);
//         } catch (error) {
//             console.error("Error playing audio:", error);
//             alert("Failed to play audio.");
//         }
//     };

//     const togglePlayPause = async () => {
//         if (sound) {
//             if (isPlaying) {
//                 await sound.pauseAsync();
//                 setIsPlaying(false);
//             } else {
//                 await sound.playAsync();
//                 setIsPlaying(true);
//             }
//         }
//     };

//     const seekTo = async (value) => {
//         if (sound) {
//             await sound.setPositionAsync(value);
//             setPosition(value);
//         }
//     };

//     const playPreviousSong = () => {
//         const currentIndex = songs.findIndex((song) => song._id === currentSongId);
//         if (currentIndex > 0) {
//             const prevSong = songs[currentIndex - 1];
//             playSong(prevSong.audioPath, prevSong._id);
//         }
//     };

//     const playNextSong = () => {
//         const currentIndex = songs.findIndex((song) => song._id === currentSongId);
//         if (currentIndex < songs.length - 1) {
//             const nextSong = songs[currentIndex + 1];
//             playSong(nextSong.audioPath, nextSong._id);
//         }
//     };

//     const stopSong = async () => {
//         if (sound) {
//             await sound.unloadAsync();
//             setSound(null);
//             setCurrentSongId(null);
//             setPosition(0);
//             setDuration(0);
//             setIsPlaying(false);
//         }
//     };

//     const handleSearch = (query) => {
//         setSearchQuery(query);
//         if (query.trim() === "") {
//             setFilteredArtists(artists);
//         } else {
//             const filtered = artists.filter((artist) =>
//                 artist.name.toLowerCase().includes(query.toLowerCase())
//             );
//             setFilteredArtists(filtered);
//         }
//     };

//     const formatTime = (millis) => {
//         if (!millis) return "0:00";
//         const seconds = Math.floor(millis / 1000);
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
//     };

//     const renderArtistItem = ({ item }) => (
//         <TouchableOpacity style={styles.artistCard} onPress={() => fetchSongsByArtist(item._id)}>
//             {item.photoPath ? (
//                 <Image
//                     source={{ uri: `${baseUrl}/${item.photoPath}` }}
//                     style={styles.artistPhoto}
//                     onError={(e) => console.log(`Failed to load artist image: ${item.photoPath}`, e.nativeEvent.error)}
//                 />
//             ) : (
//                 <View style={styles.artistPhotoPlaceholder}>
//                     <Text style={styles.placeholderText}>{item.name[0]}</Text>
//                 </View>
//             )}
//             <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
//         </TouchableOpacity>
//     );

//     const renderSongItem = ({ item }) => (
//         <TouchableOpacity
//             style={[styles.songCard, currentSongId === item._id && styles.playingCard]}
//             onPress={() => playSong(item.audioPath, item._id)}
//         >
//             {item.coverPath ? (
//                 <Image
//                     source={{ uri: `${baseUrl}/${item.coverPath}` }}
//                     style={styles.albumArt}
//                     onError={(e) => console.log(`Failed to load song cover: ${item.coverPath}`, e.nativeEvent.error)}
//                 />
//             ) : (
//                 <View style={styles.albumArtPlaceholder}>
//                     <Text style={styles.placeholderText}>{item.name[0]}</Text>
//                 </View>
//             )}
//             <View style={styles.songInfo}>
//                 <Text style={styles.songTitle} numberOfLines={1}>{item.name}</Text>
//                 <Text style={styles.artistName}>{item.artist.name}</Text>
//             </View>
//             {currentSongId === item._id && (
//                 <TouchableOpacity style={styles.stopButton} onPress={stopSong}>
//                     <Text style={styles.stopButtonText}>■</Text>
//                 </TouchableOpacity>
//             )}
//         </TouchableOpacity>
//     );

//     return (
//         <View style={styles.container}>
//             <View style={styles.headerContainer}>
//                 <Text style={styles.header}>Artists</Text>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search artists..."
//                     placeholderTextColor="#b3b3b3"
//                     value={searchQuery}
//                     onChangeText={handleSearch}
//                 />
//             </View>

//             {!selectedArtist ? (
//                 <FlatList
//                     data={filteredArtists}
//                     renderItem={renderArtistItem}
//                     keyExtractor={(item) => item._id}
//                     horizontal={true}
//                     showsHorizontalScrollIndicator={false}
//                     contentContainerStyle={styles.artistListContent}
//                 />
//             ) : (
//                 <>
//                     <TouchableOpacity style={styles.backButton} onPress={() => setSelectedArtist(null)}>
//                         <Text style={styles.backButtonText}>← Back to Artists</Text>
//                     </TouchableOpacity>
//                     <FlatList
//                         data={songs}
//                         renderItem={renderSongItem}
//                         keyExtractor={(item) => item._id}
//                         numColumns={2}
//                         columnWrapperStyle={styles.columnWrapper}
//                         contentContainerStyle={styles.listContent}
//                     />
//                 </>
//             )}

//             {currentSongId && (
//                 <View style={styles.playbackBar}>
//                     <Text style={styles.playbackText}>
//                         Now Playing: {songs.find((s) => s._id === currentSongId)?.name}
//                     </Text>
//                     <View style={styles.progressContainer}>
//                         <Text style={styles.timeText}>{formatTime(position)}</Text>
//                         <Slider
//                             style={styles.progressBar}
//                             minimumValue={0}
//                             maximumValue={duration || 1}
//                             value={position}
//                             onSlidingComplete={seekTo}
//                             minimumTrackTintColor="#1DB954"
//                             maximumTrackTintColor="#404040"
//                             thumbTintColor="#1DB954"
//                         />
//                         <Text style={styles.timeText}>{formatTime(duration)}</Text>
//                     </View>
//                     <View style={styles.controlButtons}>
//                         <TouchableOpacity onPress={playPreviousSong} disabled={songs.findIndex((s) => s._id === currentSongId) === 0}>
//                             <Text style={[styles.controlButtonText, songs.findIndex((s) => s._id === currentSongId) === 0 && styles.disabledButton]}>⏮</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={togglePlayPause}>
//                             <Text style={styles.controlButtonText}>{isPlaying ? "⏸" : "▶"}</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={playNextSong} disabled={songs.findIndex((s) => s._id === currentSongId) === songs.length - 1}>
//                             <Text style={[styles.controlButtonText, songs.findIndex((s) => s._id === currentSongId) === songs.length - 1 && styles.disabledButton]}>⏭</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#121212", paddingTop: 40 },
//     headerContainer: { paddingHorizontal: 16, marginBottom: 20 },
//     header: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 12 },
//     searchInput: {
//         backgroundColor: "#282828",
//         color: "#fff",
//         paddingVertical: 10,
//         paddingHorizontal: 16,
//         borderRadius: 20,
//         fontSize: 16,
//         borderWidth: 1,
//         borderColor: "#404040",
//     },
//     artistListContent: { paddingHorizontal: 16, paddingBottom: 20 },
//     artistCard: { alignItems: "center", marginRight: 16, width: 100 },
//     artistPhoto: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
//     artistPhotoPlaceholder: {
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         backgroundColor: "#333",
//         marginBottom: 8,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     placeholderText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
//     artistName: { fontSize: 14, fontWeight: "600", color: "#fff", textAlign: "center" },
//     songCard: { flex: 1, backgroundColor: "#181818", borderRadius: 8, margin: 8, padding: 10 },
//     playingCard: { borderColor: "#1DB954", borderWidth: 2 },
//     albumArt: { width: "100%", height: 120, borderRadius: 60, marginBottom: 8 },
//     albumArtPlaceholder: {
//         width: "100%",
//         height: 120,
//         borderRadius: 60,
//         backgroundColor: "#333",
//         marginBottom: 8,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     songInfo: { flex: 1 },
//     songTitle: { fontSize: 16, fontWeight: "600", color: "#fff", marginBottom: 4 },
//     stopButton: {
//         position: "absolute",
//         bottom: 10,
//         right: 10,
//         width: 30,
//         height: 30,
//         backgroundColor: "#1DB954",
//         borderRadius: 15,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     stopButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
//     columnWrapper: { justifyContent: "space-between" },
//     listContent: { paddingHorizontal: 8 },
//     playbackBar: {
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: "#282828",
//         paddingVertical: 10,
//         paddingHorizontal: 16,
//         borderTopWidth: 1,
//         borderTopColor: "#404040",
//     },
//     playbackText: { color: "#fff", fontSize: 14, marginBottom: 8 },
//     progressContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
//     progressBar: { flex: 1, marginHorizontal: 8 },
//     timeText: { color: "#fff", fontSize: 12 },
//     controlButtons: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
//     controlButtonText: { fontSize: 24, color: "#fff", marginHorizontal: 20 },
//     disabledButton: { color: "#404040" },
//     backButton: { padding: 10, marginHorizontal: 16, marginBottom: 10 },
//     backButtonText: { color: "#1DB954", fontSize: 16 },
// });

// export default UserScreen;

// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, TouchableOpacity, TextInput, Image, StyleSheet, Platform } from "react-native";
// import axios from "axios";
// import { Audio } from "expo-av";
// import Slider from "@react-native-community/slider";

// const UserScreen = () => {
//     const [artists, setArtists] = useState([]);
//     const [songs, setSongs] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filteredArtists, setFilteredArtists] = useState([]);
//     const [selectedArtist, setSelectedArtist] = useState(null);
//     const [sound, setSound] = useState(null);
//     const [currentSongId, setCurrentSongId] = useState(null);
//     const [position, setPosition] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);

//     const baseUrl = Platform.OS === "web" ? "http://localhost:5000" : "http://10.0.2.2:5000";

//     const normalizePath = (path) => path ? path.replace(/\\/g, '/') : '';

//     useEffect(() => {
//         fetchArtists();
//     }, []);

//     useEffect(() => {
//         let interval;
//         if (sound && isPlaying) {
//             interval = setInterval(async () => {
//                 const status = await sound.getStatusAsync();
//                 if (status.isLoaded) {
//                     setPosition(status.positionMillis);
//                     setDuration(status.durationMillis);
//                 }
//             }, 1000);
//         }
//         return () => clearInterval(interval);
//     }, [sound, isPlaying]);

//     const fetchArtists = async () => {
//         try {
//             const response = await axios.get(`${baseUrl}/artists`);
//             setArtists(response.data);
//             setFilteredArtists(response.data);
//         } catch (error) {
//             console.error("Error fetching artists:", error);
//         }
//     };

//     const fetchSongsByArtist = async (artistId) => {
//         try {
//             const response = await axios.get(`${baseUrl}/songs/artist/${artistId}`);
//             setSongs(response.data);
//             setSelectedArtist(artistId);
//         } catch (error) {
//             console.error("Error fetching songs:", error);
//         }
//     };

//     const playSong = async (audioPath, songId) => {
//         try {
//             if (sound) {
//                 await sound.unloadAsync();
//                 setSound(null);
//             }
//             const audioUrl = `${baseUrl}/${normalizePath(audioPath)}`;
//             console.log("Playing audio URL:", audioUrl);
//             const { sound: newSound } = await Audio.Sound.createAsync(
//                 { uri: audioUrl },
//                 { shouldPlay: true },
//                 (status) => {
//                     if (status.isLoaded) {
//                         setPosition(status.positionMillis);
//                         setDuration(status.durationMillis);
//                         setIsPlaying(status.isPlaying);
//                     }
//                 }
//             );
//             setSound(newSound);
//             setCurrentSongId(songId);
//             setIsPlaying(true);
//         } catch (error) {
//             console.error("Error playing audio:", error);
//             alert("Failed to play audio.");
//         }
//     };

//     const togglePlayPause = async () => {
//         if (sound) {
//             if (isPlaying) {
//                 await sound.pauseAsync();
//                 setIsPlaying(false);
//             } else {
//                 await sound.playAsync();
//                 setIsPlaying(true);
//             }
//         }
//     };

//     const seekTo = async (value) => {
//         if (sound) {
//             await sound.setPositionAsync(value);
//             setPosition(value);
//         }
//     };

//     const playPreviousSong = () => {
//         const currentIndex = songs.findIndex((song) => song._id === currentSongId);
//         if (currentIndex > 0) {
//             const prevSong = songs[currentIndex - 1];
//             playSong(prevSong.audioPath, prevSong._id);
//         }
//     };

//     const playNextSong = () => {
//         const currentIndex = songs.findIndex((song) => song._id === currentSongId);
//         if (currentIndex < songs.length - 1) {
//             const nextSong = songs[currentIndex + 1];
//             playSong(nextSong.audioPath, nextSong._id);
//         }
//     };

//     const stopSong = async () => {
//         if (sound) {
//             await sound.unloadAsync();
//             setSound(null);
//             setCurrentSongId(null);
//             setPosition(0);
//             setDuration(0);
//             setIsPlaying(false);
//         }
//     };

//     const handleSearch = (query) => {
//         setSearchQuery(query);
//         if (query.trim() === "") {
//             setFilteredArtists(artists);
//         } else {
//             const filtered = artists.filter((artist) =>
//                 artist.name.toLowerCase().includes(query.toLowerCase())
//             );
//             setFilteredArtists(filtered);
//         }
//     };

//     const formatTime = (millis) => {
//         if (!millis) return "0:00";
//         const seconds = Math.floor(millis / 1000);
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
//     };

//     const renderArtistItem = ({ item }) => (
//         <TouchableOpacity style={styles.artistCard} onPress={() => fetchSongsByArtist(item._id)}>
//             {item.photoPath ? (
//                 <Image
//                     source={{ uri: `${baseUrl}/${normalizePath(item.photoPath)}?t=${Date.now()}` }}
//                     style={styles.artistPhoto}
//                     onError={(e) => {
//                         console.log(`Failed to load artist image: ${item.photoPath}`);
//                         console.log(`URL: ${baseUrl}/${normalizePath(item.photoPath)}`);
//                         console.log(`Error:`, e.nativeEvent.error);
//                     }}
//                 />
//             ) : (
//                 <View style={styles.artistPhotoPlaceholder}>
//                     <Text style={styles.placeholderText}>{item.name[0]}</Text>
//                 </View>
//             )}
//             <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
//         </TouchableOpacity>
//     );

//     const renderSongItem = ({ item }) => (
//         <TouchableOpacity
//             style={[styles.songCard, currentSongId === item._id && styles.playingCard]}
//             onPress={() => playSong(item.audioPath, item._id)}
//         >
//             {item.coverPath ? (
//                 <Image
//                     source={{ uri: `${baseUrl}/${normalizePath(item.coverPath)}?t=${Date.now()}` }}
//                     style={styles.albumArt}
//                     onError={(e) => {
//                         console.log(`Failed to load song cover: ${item.coverPath}`);
//                         console.log(`URL: ${baseUrl}/${normalizePath(item.coverPath)}`);
//                         console.log(`Error:`, e.nativeEvent.error);
//                     }}
//                 />
//             ) : (
//                 <View style={styles.albumArtPlaceholder}>
//                     <Text style={styles.placeholderText}>{item.name[0]}</Text>
//                 </View>
//             )}
//             <View style={styles.songInfo}>
//                 <Text style={styles.songTitle} numberOfLines={1}>{item.name}</Text>
//                 <Text style={styles.artistName}>{item.artist.name}</Text>
//             </View>
//             {currentSongId === item._id && (
//                 <TouchableOpacity style={styles.stopButton} onPress={stopSong}>
//                     <Text style={styles.stopButtonText}>■</Text>
//                 </TouchableOpacity>
//             )}
//         </TouchableOpacity>
//     );

//     return (
//         <View style={styles.container}>
//             <View style={styles.headerContainer}>
//                 <Text style={styles.header}>Artists</Text>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search artists..."
//                     placeholderTextColor="#b3b3b3"
//                     value={searchQuery}
//                     onChangeText={handleSearch}
//                 />
//             </View>

//             {!selectedArtist ? (
//                 <FlatList
//                     data={filteredArtists}
//                     renderItem={renderArtistItem}
//                     keyExtractor={(item) => item._id}
//                     horizontal={true}
//                     showsHorizontalScrollIndicator={false}
//                     contentContainerStyle={styles.artistListContent}
//                 />
//             ) : (
//                 <>
//                     <TouchableOpacity style={styles.backButton} onPress={() => setSelectedArtist(null)}>
//                         <Text style={styles.backButtonText}>← Back to Artists</Text>
//                     </TouchableOpacity>
//                     <FlatList
//                         data={songs}
//                         renderItem={renderSongItem}
//                         keyExtractor={(item) => item._id}
//                         numColumns={2}
//                         columnWrapperStyle={styles.columnWrapper}
//                         contentContainerStyle={styles.listContent}
//                     />
//                 </>
//             )}

//             {currentSongId && (
//                 <View style={styles.playbackBar}>
//                     <Text style={styles.playbackText}>
//                         Now Playing: {songs.find((s) => s._id === currentSongId)?.name}
//                     </Text>
//                     <View style={styles.progressContainer}>
//                         <Text style={styles.timeText}>{formatTime(position)}</Text>
//                         <Slider
//                             style={styles.progressBar}
//                             minimumValue={0}
//                             maximumValue={duration || 1}
//                             value={position}
//                             onSlidingComplete={seekTo}
//                             minimumTrackTintColor="#1DB954"
//                             maximumTrackTintColor="#404040"
//                             thumbTintColor="#1DB954"
//                         />
//                         <Text style={styles.timeText}>{formatTime(duration)}</Text>
//                     </View>
//                     <View style={styles.controlButtons}>
//                         <TouchableOpacity onPress={playPreviousSong} disabled={songs.findIndex((s) => s._id === currentSongId) === 0}>
//                             <Text style={[styles.controlButtonText, songs.findIndex((s) => s._id === currentSongId) === 0 && styles.disabledButton]}>⏮</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={togglePlayPause}>
//                             <Text style={styles.controlButtonText}>{isPlaying ? "⏸" : "▶"}</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={playNextSong} disabled={songs.findIndex((s) => s._id === currentSongId) === songs.length - 1}>
//                             <Text style={[styles.controlButtonText, songs.findIndex((s) => s._id === currentSongId) === songs.length - 1 && styles.disabledButton]}>⏭</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#121212", paddingTop: 40 },
//     headerContainer: { paddingHorizontal: 16, marginBottom: 20 },
//     header: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 12 },
//     searchInput: {
//         backgroundColor: "#282828",
//         color: "#fff",
//         paddingVertical: 10,
//         paddingHorizontal: 16,
//         borderRadius: 20,
//         fontSize: 16,
//         borderWidth: 1,
//         borderColor: "#404040",
//     },
//     artistListContent: { paddingHorizontal: 16, paddingBottom: 20 },
//     artistCard: { alignItems: "center", marginRight: 16, width: 100 },
//     artistPhoto: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
//     artistPhotoPlaceholder: {
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         backgroundColor: "#333",
//         marginBottom: 8,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     placeholderText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
//     artistName: { fontSize: 14, fontWeight: "600", color: "#fff", textAlign: "center" },
//     songCard: { flex: 1, backgroundColor: "#181818", borderRadius: 8, margin: 8, padding: 10 },
//     playingCard: { borderColor: "#1DB954", borderWidth: 2 },
//     albumArt: { width: "100%", height: 120, borderRadius: 60, marginBottom: 8 },
//     albumArtPlaceholder: {
//         width: "100%",
//         height: 120,
//         borderRadius: 60,
//         backgroundColor: "#333",
//         marginBottom: 8,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     songInfo: { flex: 1 },
//     songTitle: { fontSize: 16, fontWeight: "600", color: "#fff", marginBottom: 4 },
//     stopButton: {
//         position: "absolute",
//         bottom: 10,
//         right: 10,
//         width: 30,
//         height: 30,
//         backgroundColor: "#1DB954",
//         borderRadius: 15,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     stopButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
//     columnWrapper: { justifyContent: "space-between" },
//     listContent: { paddingHorizontal: 8 },
//     playbackBar: {
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: "#282828",
//         paddingVertical: 10,
//         paddingHorizontal: 16,
//         borderTopWidth: 1,
//         borderTopColor: "#404040",
//     },
//     playbackText: { color: "#fff", fontSize: 14, marginBottom: 8 },
//     progressContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
//     progressBar: { flex: 1, marginHorizontal: 8 },
//     timeText: { color: "#fff", fontSize: 12 },
//     controlButtons: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
//     controlButtonText: { fontSize: 24, color: "#fff", marginHorizontal: 20 },
//     disabledButton: { color: "#404040" },
//     backButton: { padding: 10, marginHorizontal: 16, marginBottom: 10 },
//     backButtonText: { color: "#1DB954", fontSize: 16 },
// });

// export default UserScreen;


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import axios from "axios";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

const UserScreen = () => {
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [sound, setSound] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigation = useNavigation();

  const baseUrl = Platform.OS === "web" ? "http://localhost:5000" : "http://10.0.2.2:5000";

  const normalizePath = (path) => (path ? path.replace(/\\/g, "/") : "");

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    let interval;
    if (sound && isPlaying) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sound, isPlaying]);

  const fetchArtists = async () => {
    try {
      const response = await axios.get(`${baseUrl}/artists`);
      setArtists(response.data);
      setFilteredArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const fetchSongsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${baseUrl}/songs/artist/${artistId}`);
      setSongs(response.data);
      setSelectedArtist(artistId);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const playSong = async (audioPath, songId) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const audioUrl = `${baseUrl}/${normalizePath(audioPath)}`;
      console.log("Playing audio URL:", audioUrl);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
            setIsPlaying(status.isPlaying);
          }
        }
      );
      setSound(newSound);
      setCurrentSongId(songId);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
      alert("Failed to play audio.");
    }
  };

  const togglePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const seekTo = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  const playPreviousSong = () => {
    const currentIndex = songs.findIndex((song) => song._id === currentSongId);
    if (currentIndex > 0) {
      const prevSong = songs[currentIndex - 1];
      playSong(prevSong.audioPath, prevSong._id);
    }
  };

  const playNextSong = () => {
    const currentIndex = songs.findIndex((song) => song._id === currentSongId);
    if (currentIndex < songs.length - 1) {
      const nextSong = songs[currentIndex + 1];
      playSong(nextSong.audioPath, nextSong._id);
    }
  };

  const stopSong = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setCurrentSongId(null);
      setPosition(0);
      setDuration(0);
      setIsPlaying(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter((artist) =>
        artist.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArtists(filtered);
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  const formatTime = (millis) => {
    if (!millis) return "0:00";
    const seconds = Math.floor(millis / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const renderArtistItem = ({ item }) => (
    <TouchableOpacity style={styles.artistCard} onPress={() => fetchSongsByArtist(item._id)}>
      {item.photoPath ? (
        <Image
          source={{ uri: `${baseUrl}/${normalizePath(item.photoPath)}?t=${Date.now()}` }}
          style={styles.artistPhoto}
          onError={(e) => {
            console.log(`Failed to load artist image: ${item.photoPath}`);
            console.log(`URL: ${baseUrl}/${normalizePath(item.photoPath)}`);
            console.log(`Error:`, e.nativeEvent.error);
          }}
        />
      ) : (
        <View style={styles.artistPhotoPlaceholder}>
          <Text style={styles.placeholderText}>{item.name[0]}</Text>
        </View>
      )}
      <Text style={styles.artistName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSongItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.songCard, currentSongId === item._id && styles.playingCard]}
      onPress={() => playSong(item.audioPath, item._id)}
    >
      <View style={styles.songContent}>
        {item.coverPath ? (
          <Image
            source={{ uri: `${baseUrl}/${normalizePath(item.coverPath)}?t=${Date.now()}` }}
            style={styles.songAlbumArt}
            onError={(e) => {
              console.log(`Failed to load song cover: ${item.coverPath}`);
              console.log(`URL: ${baseUrl}/${normalizePath(item.coverPath)}`);
              console.log(`Error:`, e.nativeEvent.error);
            }}
          />
        ) : (
          <View style={styles.songAlbumArtPlaceholder}>
            <Text style={styles.placeholderText}>{item.name[0]}</Text>
          </View>
        )}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.artistName}>{item.artist.name}</Text>
        </View>
      </View>
      {currentSongId === item._id && (
        <TouchableOpacity style={styles.stopButton} onPress={stopSong}>
          <Text style={styles.stopButtonText}>■</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Artists</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search artists..."
          placeholderTextColor="#b3b3b3"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {!selectedArtist ? (
        <FlatList
          data={filteredArtists}
          renderItem={renderArtistItem}
          keyExtractor={(item) => item._id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.artistListContent}
        />
      ) : (
        <>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedArtist(null)}>
            <Text style={styles.backButtonText}>← Back to Artists</Text>
          </TouchableOpacity>
          <FlatList
            data={songs}
            renderItem={renderSongItem}
            keyExtractor={(item) => item._id}
            numColumns={1}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}

      {currentSongId && (
        <View style={styles.playbackBar}>
          <Text style={styles.playbackText}>
            Now Playing: {songs.find((s) => s._id === currentSongId)?.name}
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Slider
              style={styles.progressBar}
              minimumValue={0}
              maximumValue={duration || 1}
              value={position}
              onSlidingComplete={seekTo}
              minimumTrackTintColor="#1DB954"
              maximumTrackTintColor="#404040"
              thumbTintColor="#1DB954"
            />
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
          <View style={styles.controlButtons}>
            <TouchableOpacity
              onPress={playPreviousSong}
              disabled={songs.findIndex((s) => s._id === currentSongId) === 0}
            >
              <Text
                style={[
                  styles.controlButtonText,
                  songs.findIndex((s) => s._id === currentSongId) === 0 && styles.disabledButton,
                ]}
              >
                ⏮
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayPause}>
              <Text style={styles.controlButtonText}>{isPlaying ? "⏸" : "▶"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={playNextSong}
              disabled={songs.findIndex((s) => s._id === currentSongId) === songs.length - 1}
            >
              <Text
                style={[
                  styles.controlButtonText,
                  songs.findIndex((s) => s._id === currentSongId) === songs.length - 1 &&
                    styles.disabledButton,
                ]}
              >
                ⏭
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", paddingTop: 40 },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoutButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  headerContainer: { paddingHorizontal: 16, marginBottom: 20 },
  header: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 12 },
  searchInput: {
    backgroundColor: "#282828",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#404040",
  },
  artistListContent: { paddingHorizontal: 16, paddingBottom: 20 },
  artistCard: { alignItems: "center", marginRight: 16, width: 100 },
  artistPhoto: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  artistPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#333",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  artistName: { fontSize: 14, fontWeight: "600", color: "#fff", textAlign: "center" },
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181818",
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 10,
  },
  playingCard: { borderColor: "#1DB954", borderWidth: 2 },
  songContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  songAlbumArt: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  songAlbumArtPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: "#333",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  songInfo: { flex: 1 },
  songTitle: { fontSize: 16, fontWeight: "600", color: "#fff", marginBottom: 4 },
  stopButton: {
    width: 30,
    height: 30,
    backgroundColor: "#1DB954",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  stopButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  listContent: { paddingHorizontal: 8 },
  playbackBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#282828",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#404040",
  },
  playbackText: { color: "#fff", fontSize: 14, marginBottom: 8 },
  progressContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  progressBar: { flex: 1, marginHorizontal: 8 },
  timeText: { color: "#fff", fontSize: 12 },
  controlButtons: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  controlButtonText: { fontSize: 24, color: "#fff", marginHorizontal: 20 },
  disabledButton: { color: "#404040" },
  backButton: { padding: 10, marginHorizontal: 16, marginBottom: 10 },
  backButtonText: { color: "#1DB954", fontSize: 16 },
});

export default UserScreen;