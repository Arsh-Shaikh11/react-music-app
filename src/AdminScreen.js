// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import * as DocumentPicker from "expo-document-picker";
// import { useNavigation } from "@react-navigation/native";
// import Popup from "./Popup";

// const AdminScreen = () => {
//     const [name, setName] = useState("");
//     const [artistName, setArtistName] = useState("");
//     const [audioFile, setAudioFile] = useState(null);
//     const [coverFile, setCoverFile] = useState(null);
//     const [artists, setArtists] = useState([]);
//     const [popupVisible, setPopupVisible] = useState(false);
//     const [popupMessage, setPopupMessage] = useState("");
//     const navigation = useNavigation();

//     useEffect(() => {
//         fetchArtists();
//     }, []);

//     const fetchArtists = async () => {
//         try {
//             const response = await fetch("http://localhost:5000/artists");
//             const data = await response.json();
//             setArtists(data);
//         } catch (error) {
//             console.error("Error fetching artists:", error);
//         }
//     };

//     const pickAudioFile = async () => {
//         try {
//             let result = await DocumentPicker.getDocumentAsync({ type: "audio/*", copyToCacheDirectory: true });
//             if (!result.canceled) {
//                 const file = {
//                     uri: result.uri || result.assets[0].uri,
//                     name: result.name || result.assets[0].name || "audio.mp3",
//                     type: result.mimeType || result.assets[0].mimeType || "audio/mpeg",
//                 };
//                 console.log("Selected audio file:", file);
//                 setAudioFile(file);
//             }
//         } catch (error) {
//             console.error("Error picking audio file:", error);
//             Alert.alert("Error", "Failed to pick an audio file.");
//         }
//     };

//     const pickCoverFile = async () => {
//         try {
//             let result = await DocumentPicker.getDocumentAsync({ type: "image/*", copyToCacheDirectory: true });
//             if (!result.canceled) {
//                 const file = {
//                     uri: result.uri || result.assets[0].uri,
//                     name: result.name || result.assets[0].name || "cover.jpg",
//                     type: result.mimeType || result.assets[0].mimeType || "image/jpeg",
//                 };
//                 console.log("Selected cover file:", file);
//                 setCoverFile(file);
//             }
//         } catch (error) {
//             console.error("Error picking cover file:", error);
//             Alert.alert("Error", "Failed to pick a cover file.");
//         }
//     };

//     const uriToBlob = async (uri) => {
//         if (!uri.startsWith("data:")) return uri;
//         const response = await fetch(uri);
//         const blob = await response.blob();
//         return blob;
//     };

//     const handleUpload = async () => {
//         if (!audioFile || !name || !artistName) {
//             Alert.alert("❌ Error", "Please fill all required fields and select an audio file!");
//             return;
//         }
//         try {
//             const formData = new FormData();
//             formData.append("name", name);
//             formData.append("artistName", artistName);
//             const audioBlob = await uriToBlob(audioFile.uri);
//             formData.append("audio", audioBlob, audioFile.name);
//             if (coverFile) {
//                 const coverBlob = await uriToBlob(coverFile.uri);
//                 formData.append("cover", coverBlob, coverFile.name);
//             }

//             const response = await fetch("http://localhost:5000/add-song", {
//                 method: "POST",
//                 body: formData,
//                 headers: { "Accept": "application/json" },
//             });

//             const result = await response.json();
//             if (response.ok) {
//                 setPopupMessage("✅ Song uploaded successfully!");
//                 setPopupVisible(true);
//                 setName("");
//                 setArtistName("");
//                 setAudioFile(null);
//                 setCoverFile(null);
//                 fetchArtists();
//             } else {
//                 Alert.alert("❌ Error", `Upload failed: ${result.error}`);
//             }
//         } catch (error) {
//             console.error("Upload error:", error);
//             Alert.alert("❌ Error", "Upload failed. Please try again.");
//         }
//     };

//     const renderArtistItem = ({ item }) => (
//         <TouchableOpacity
//             style={styles.artistItem}
//             onPress={() => navigation.navigate("ArtistDetail", { artistId: item._id, artistName: item.name })}
//         >
//             <Text style={styles.artistText}>{item.name}</Text>
//         </TouchableOpacity>
//     );

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>Add Song</Text>
//             <Text>Song Name:</Text>
//             <TextInput value={name} onChangeText={setName} style={styles.input} />
//             <Text>Artist Name:</Text>
//             <TextInput value={artistName} onChangeText={setArtistName} style={styles.input} />
//             <Button title="Pick Audio File" onPress={pickAudioFile} />
//             <Text>{audioFile ? `🎵 Audio: ${audioFile.name}` : "No audio file selected"}</Text>
//             <Button title="Pick Cover Photo" onPress={pickCoverFile} />
//             <Text>{coverFile ? `🖼️ Cover: ${coverFile.name}` : "No cover photo selected"}</Text>
//             <Button title="Upload Song" onPress={handleUpload} />

//             <Text style={styles.header}>Existing Artists</Text>
//             <FlatList
//                 data={artists}
//                 renderItem={renderArtistItem}
//                 keyExtractor={(item) => item._id}
//                 style={styles.artistList}
//             />

//             <Popup visible={popupVisible} message={popupMessage} onClose={() => setPopupVisible(false)} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { padding: 20, backgroundColor: "#f5f5f5", flex: 1 },
//     header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
//     input: { borderWidth: 1, padding: 8, marginBottom: 12, borderRadius: 4 },
//     artistList: { marginTop: 20 },
//     artistItem: { padding: 10, backgroundColor: "#fff", marginBottom: 8, borderRadius: 4 },
//     artistText: { fontSize: 16 },
// });

// export default AdminScreen;


// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   FlatList,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import * as DocumentPicker from "expo-document-picker";
// import { useNavigation } from "@react-navigation/native";
// import Popup from "./Popup";

// const AdminScreen = () => {
//   const [selectedTab, setSelectedTab] = useState("Add Song");
//   const [name, setName] = useState("");
//   const [artistName, setArtistName] = useState("");
//   const [audioFile, setAudioFile] = useState(null);
//   const [coverFile, setCoverFile] = useState(null);
//   const [artists, setArtists] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [popupMessage, setPopupMessage] = useState("");
//   const [selectedArtist, setSelectedArtist] = useState(null);
//   const [artistSongs, setArtistSongs] = useState([]);
//   const [artistPhoto, setArtistPhoto] = useState(null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     if (selectedTab === "Add Song" || selectedTab === "Artists") {
//       fetchArtists();
//     } else if (selectedTab === "Users") {
//       fetchUsers();
//     }
//     if (selectedArtist) {
//       fetchSongs(selectedArtist._id);
//     }
//   }, [selectedTab, selectedArtist]);

//   const fetchArtists = async () => {
//     try {
//       console.log("Fetching artists...");
//       const response = await fetch("http://localhost:5000/artists");
//       const data = await response.json();
//       console.log("Artists fetched:", data);
//       setArtists(data);
//     } catch (error) {
//       console.error("Error fetching artists:", error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       console.log("Fetching users...");
//       const response = await fetch("http://localhost:5000/users");
//       const data = await response.json();
//       console.log("Users fetched:", data);
//       setUsers(data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const fetchSongs = async (artistId) => {
//     try {
//       console.log(`Fetching songs for artist ID: ${artistId}`);
//       const response = await fetch(`http://localhost:5000/songs/artist/${artistId}`);
//       const data = await response.json();
//       console.log("Songs fetched:", data);
//       setArtistSongs(data);
//     } catch (error) {
//       console.error("Error fetching songs:", error);
//     }
//   };

//   // Add Song Functions
//   const pickAudioFile = async () => {
//     try {
//       let result = await DocumentPicker.getDocumentAsync({
//         type: "audio/*",
//         copyToCacheDirectory: true,
//       });
//       if (!result.canceled) {
//         const file = {
//           uri: result.uri || result.assets[0].uri,
//           name: result.name || result.assets[0].name || "audio.mp3",
//           type: result.mimeType || result.assets[0].mimeType || "audio/mpeg",
//         };
//         console.log("Audio file picked:", file);
//         setAudioFile(file);
//       }
//     } catch (error) {
//       console.error("Error picking audio file:", error);
//       Alert.alert("Error", "Failed to pick an audio file.");
//     }
//   };

//   const pickCoverFile = async () => {
//     try {
//       let result = await DocumentPicker.getDocumentAsync({
//         type: "image/*",
//         copyToCacheDirectory: true,
//       });
//       if (!result.canceled) {
//         const file = {
//           uri: result.uri || result.assets[0].uri,
//           name: result.name || result.assets[0].name || "cover.jpg",
//           type: result.mimeType || result.assets[0].mimeType || "image/jpeg",
//         };
//         console.log("Cover file picked:", file);
//         setCoverFile(file);
//       }
//     } catch (error) {
//       console.error("Error picking cover file:", error);
//       Alert.alert("Error", "Failed to pick a cover file.");
//     }
//   };

//   const uriToBlob = async (uri) => {
//     if (!uri.startsWith("data:")) return uri;
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     return blob;
//   };

//   const handleUpload = async () => {
//     if (!audioFile || !name || !artistName) {
//       Alert.alert("❌ Error", "Please fill all required fields and select an audio file!");
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("artistName", artistName);
//       const audioBlob = await uriToBlob(audioFile.uri);
//       formData.append("audio", audioBlob, audioFile.name);
//       if (coverFile) {
//         const coverBlob = await uriToBlob(coverFile.uri);
//         formData.append("cover", coverBlob, coverFile.name);
//       }

//       console.log("Uploading song...");
//       const response = await fetch("http://localhost:5000/add-song", {
//         method: "POST",
//         body: formData,
//         headers: { Accept: "application/json" },
//       });
//       const result = await response.json();
//       console.log("Upload response:", result);

//       if (response.ok) {
//         setPopupMessage("✅ Song uploaded successfully!");
//         setPopupVisible(true);
//         setName("");
//         setArtistName("");
//         setAudioFile(null);
//         setCoverFile(null);
//         fetchArtists();
//       } else {
//         Alert.alert("❌ Error", `Upload failed: ${result.error}`);
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       Alert.alert("❌ Error", "Upload failed. Please try again.");
//     }
//   };

//   // Artist Detail Functions
//   const pickArtistPhoto = async () => {
//     try {
//       let result = await DocumentPicker.getDocumentAsync({
//         type: "image/*",
//         copyToCacheDirectory: true 
//       });
//       if (!result.canceled) {
//         const file = {
//           uri: result.uri || result.assets[0].uri,
//           name: result.name || result.assets[0].name || "artist.jpg",
//           type: result.mimeType || result.assets[0].mimeType || "image/jpeg",
//         };
//         console.log("Artist photo picked:", file);
//         setArtistPhoto(file);
//       }
//     } catch (error) {
//       console.error("Error picking artist photo:", error);
//       Alert.alert("Error", "Failed to pick an artist photo.");
//     }
//   };

//   const handleAddSongToArtist = async (artistId, artistName) => {
//     if (!audioFile || !name) {
//       Alert.alert("❌ Error", "Please fill song name and select an audio file!");
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("artistName", artistName);
//       const audioBlob = await uriToBlob(audioFile.uri);
//       formData.append("audio", audioBlob, audioFile.name);
//       if (coverFile) {
//         const coverBlob = await uriToBlob(coverFile.uri);
//         formData.append("cover", coverBlob, coverFile.name);
//       }

//       console.log("Adding song to artist ID:", artistId);
//       const response = await fetch("http://localhost:5000/add-song", {
//         method: "POST",
//         body: formData,
//         headers: { Accept: "application/json" },
//       });
//       const result = await response.json();
//       console.log("Add song response:", result);

//       if (response.ok) {
//         setPopupMessage("✅ Song added successfully!");
//         setPopupVisible(true);
//         setName("");
//         setAudioFile(null);
//         setCoverFile(null);
//         fetchSongs(artistId);
//       } else {
//         Alert.alert("❌ Error", `Add failed: ${result.error}`);
//       }
//     } catch (error) {
//       console.error("Add song error:", error);
//       Alert.alert("❌ Error", "Failed to add song.");
//     }
//   };

//   const handleUpdateArtist = async (artistId) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", artistName);
//       if (artistPhoto) {
//         const photoBlob = await uriToBlob(artistPhoto.uri);
//         formData.append("photo", photoBlob, artistPhoto.name);
//       }

//       console.log("Updating artist ID:", artistId);
//       const response = await fetch(`http://localhost:5000/update-artist/${artistId}`, {
//         method: "PUT",
//         body: formData,
//         headers: { Accept: "application/json" },
//       });
//       const result = await response.json();
//       console.log("Update artist response:", result);

//       if (response.ok) {
//         setPopupMessage("✅ Artist updated successfully!");
//         setPopupVisible(true);
//         setArtistPhoto(null);
//         fetchArtists();
//       } else {
//         Alert.alert("❌ Error", `Update failed: ${result.error}`);
//       }
//     } catch (error) {
//       console.error("Update artist error:", error);
//       Alert.alert("❌ Error", "Failed to update artist.");
//     }
//   };

//   const handleDeleteArtist = async (artistId) => {
//     console.log("Delete Artist function called, ID:", artistId);
//     try {
//       const response = await fetch(`http://localhost:5000/delete-artist/${artistId}`, {
//         method: "DELETE",
//         headers: { Accept: "application/json" },
//       });
//       console.log("Response status:", response.status);
//       const result = await response.json();
//       console.log("Response body:", result);
//       setPopupMessage(result.message || "✅ Artist deleted successfully!");
//       setPopupVisible(true);
//       setSelectedArtist(null);
//       setArtistSongs([]);
//       fetchArtists();
//     } catch (error) {
//       console.error("Delete error:", error);
//       Alert.alert("❌ Error", `Failed: ${error.message}`);
//     }
//   };

  
//   const handleDeleteSong = (songId, artistId) => {
//     console.log("Delete Song button clicked, Song ID:", songId, "Artist ID:", artistId);
//     if (!songId || !artistId) {
//       console.error("Invalid song or artist ID for deletion");
//       Alert.alert("❌ Error", "Invalid song or artist ID");
//       return;
//     }
//     Alert.alert("Confirm Delete", "Are you sure you want to delete this song?", [
//       { text: "Cancel" },
//       {
//         text: "Delete",
//         onPress: async () => {
//           try {
//             console.log(`Sending DELETE request for song ID: ${songId}`);
//             const response = await fetch(`http://localhost:5000/delete-song/${songId}`, {
//               method: "DELETE",
//               headers: {
//                 Accept: "application/json",
//                 "Content-Type": "application/json",
//               },
//             });
//             console.log("Delete song response status:", response.status);
//             const result = await response.json();
//             console.log("Delete song response body:", result);

//             if (response.ok) {
//               setPopupMessage(result.message || "✅ Song deleted successfully!");
//               setPopupVisible(true);
//               fetchSongs(artistId);
//             } else {
//               Alert.alert("❌ Error", `Delete failed: ${result.message || result.error || "Unknown error"}`);
//             }
//           } catch (error) {
//             console.error("Delete song error:", error);
//             Alert.alert("❌ Error", `Failed to delete song: ${error.message}`);
//           }
//         },
//       },
//     ]);
//   };

//   // Render Functions
//   const renderArtistItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.artistItem}
//       onPress={() => {
//         console.log("Artist selected:", item.name, "ID:", item._id);
//         setSelectedArtist(item);
//         setArtistName(item.name);
//         fetchSongs(item._id);
//       }}
//     >
//       <Text style={styles.artistText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const renderSongItem = ({ item }) => (
//     <View style={styles.songItem}>
//       <Text style={styles.songText}>{item.name}</Text>
//       <TouchableOpacity
//         style={styles.deleteSongButton}
//         onPress={() => handleDeleteSong(item._id, selectedArtist._id)}
//       >
//         <Text style={styles.deleteSongText}>Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderUserItem = ({ item }) => (
//     <View style={styles.userItem}>
//       <Text style={styles.userText}>Username: {item.username}</Text>
//       <Text style={styles.userText}>Email: {item.email}</Text>
//       <Text style={styles.userText}>Role: {item.role}</Text>
//     </View>
//   );

//   const renderAddSongTab = () => (
//     <ScrollView style={styles.tabContent}>
//       <Text style={styles.header}>Add Song</Text>
//       <Text>Song Name:</Text>
//       <TextInput value={name} onChangeText={setName} style={styles.input} />
//       <Text>Artist Name:</Text>
//       <TextInput value={artistName} onChangeText={setArtistName} style={styles.input} />
//       <Button title="Pick Audio File" onPress={pickAudioFile} />
//       <Text>{audioFile ? `🎵 Audio: ${audioFile.name}` : "No audio file selected"}</Text>
//       <Button title="Pick Cover Photo" onPress={pickCoverFile} />
//       <Text>{coverFile ? `🖼️ Cover: ${coverFile.name}` : "No cover photo selected"}</Text>
//       <Button title="Upload Song" onPress={handleUpload} />

//       <Text style={styles.header}>Existing Artists</Text>
//       <FlatList
//         data={artists}
//         renderItem={renderArtistItem}
//         keyExtractor={(item) => item._id}
//         style={styles.artistList}
//         nestedScrollEnabled
//       />
//     </ScrollView>
//   );

//   const renderArtistsTab = () => (
//     <ScrollView style={styles.tabContent}>
//       <Text style={styles.header}>Artists</Text>
//       {selectedArtist ? (
//         <View>
//           <Text style={styles.subHeader}>Artist: {selectedArtist.name}</Text>

//           <Text style={styles.subHeader}>Add Song</Text>
//           <Text>Song Name:</Text>
//           <TextInput value={name} onChangeText={setName} style={styles.input} />
//           <Button title="Pick Audio File" onPress={pickAudioFile} />
//           <Text>{audioFile ? `🎵 Audio: ${audioFile.name}` : "No audio file selected"}</Text>
//           <Button title="Pick Cover Photo" onPress={pickCoverFile} />
//           <Text>{coverFile ? `🖼️ Cover: ${coverFile.name}` : "No cover photo selected"}</Text>
//           <Button
//             title="Add Song"
//             onPress={() => handleAddSongToArtist(selectedArtist._id, selectedArtist.name)}
//           />

//           <Text style={styles.subHeader}>Update Artist</Text>
//           <Text>Artist Name:</Text>
//           <TextInput value={artistName} onChangeText={setArtistName} style={styles.input} />
//           <Button title="Pick Artist Photo" onPress={pickArtistPhoto} />
//           <Text>{artistPhoto ? `🖼️ Photo: ${artistPhoto.name}` : "No photo selected"}</Text>
//           <Button title="Update Artist" onPress={() => handleUpdateArtist(selectedArtist._id)} />

//           <Text style={styles.subHeader}>Songs</Text>
//           <FlatList
//             data={artistSongs}
//             renderItem={renderSongItem}
//             keyExtractor={(item) => item._id}
//             style={styles.songList}
//             nestedScrollEnabled
//           />

//           <Button
//             title="Delete Artist"
//             onPress={() => {
//               console.log("Delete Artist button pressed for ID:", selectedArtist._id);
//               handleDeleteArtist(selectedArtist._id);
//             }}
//             color="red"
//           />
//           <Button title="Back to Artists" onPress={() => {
//             console.log("Back to Artists clicked");
//             setSelectedArtist(null);
//           }} />
//         </View>
//       ) : (
//         <FlatList
//           data={artists}
//           renderItem={renderArtistItem}
//           keyExtractor={(item) => item._id}
//           style={styles.artistList}
//           nestedScrollEnabled
//         />
//       )}
//     </ScrollView>
//   );

//   const renderUsersTab = () => (
//     <ScrollView style={styles.tabContent}>
//       <Text style={styles.header}>Users</Text>
//       <FlatList
//         data={users}
//         renderItem={renderUserItem}
//         keyExtractor={(item) => item._id}
//         style={styles.userList}
//         nestedScrollEnabled
//       />
//     </ScrollView>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.sidebar}>
//         <TouchableOpacity
//           style={[styles.sidebarItem, selectedTab === "Users" && styles.selectedSidebarItem]}
//           onPress={() => {
//             console.log("Users tab selected");
//             setSelectedTab("Users");
//             setSelectedArtist(null);
//           }}
//         >
//           <Text style={styles.sidebarText}>Users</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.sidebarItem, selectedTab === "Add Song" && styles.selectedSidebarItem]}
//           onPress={() => {
//             console.log("Add Song tab selected");
//             setSelectedTab("Add Song");
//             setSelectedArtist(null);
//           }}
//         >
//           <Text style={styles.sidebarText}>Add Song</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.sidebarItem, selectedTab === "Artists" && styles.selectedSidebarItem]}
//           onPress={() => {
//             console.log("Artists tab selected");
//             setSelectedTab("Artists");
//             setSelectedArtist(null);
//           }}
//         >
//           <Text style={styles.sidebarText}>Artists</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.mainContent}>
//         {selectedTab === "Add Song" && renderAddSongTab()}
//         {selectedTab === "Artists" && renderArtistsTab()}
//         {selectedTab === "Users" && renderUsersTab()}
//       </View>
//       <Popup visible={popupVisible} message={popupMessage} onClose={() => setPopupVisible(false)} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "#f5f5f5",
//   },
//   sidebar: {
//     width: 150,
//     backgroundColor: "#333",
//     paddingTop: 20,
//   },
//   sidebarItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#444",
//   },
//   selectedSidebarItem: {
//     backgroundColor: "#555",
//   },
//   sidebarText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   mainContent: {
//     flex: 1,
//     padding: 20,
//   },
//   tabContent: {
//     flex: 1,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   subHeader: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginTop: 20,
//     marginBottom: 12,
//   },
//   input: {
//     borderWidth: 1,
//     padding: 8,
//     marginBottom: 12,
//     borderRadius: 4,
//   },
//   artistList: {
//     marginTop: 20,
//   },
//   artistItem: {
//     padding: 10,
//     backgroundColor: "#fff",
//     marginBottom: 8,
//     borderRadius: 4,
//   },
//   artistText: {
//     fontSize: 16,
//   },
//   songList: {
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   songItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 10,
//     backgroundColor: "#fff",
//     marginBottom: 8,
//     borderRadius: 4,
//   },
//   songText: {
//     fontSize: 16,
//     flex: 1,
//   },
//   deleteSongButton: {
//     backgroundColor: "#ff4444",
//     padding: 5,
//     borderRadius: 4,
//   },
//   deleteSongText: {
//     color: "#fff",
//     fontSize: 14,
//   },
//   userList: {
//     marginTop: 20,
//   },
//   userItem: {
//     padding: 10,
//     backgroundColor: "#fff",
//     marginBottom: 8,
//     borderRadius: 4,
//   },
//   userText: {
//     fontSize: 14,
//   },
// });

// export default AdminScreen;


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import Popup from "./Popup";

const AdminScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Add Song");
  const [name, setName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [users, setUsers] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistSongs, setArtistSongs] = useState([]);
  const [artistPhoto, setArtistPhoto] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (selectedTab === "Add Song" || selectedTab === "Artists") {
      fetchArtists();
    } else if (selectedTab === "Users") {
      fetchUsers();
    }
    if (selectedArtist) {
      fetchSongs(selectedArtist._id);
    }
  }, [selectedTab, selectedArtist]);

  const fetchArtists = async () => {
    try {
      console.log("Fetching artists...");
      const response = await fetch("http://localhost:5000/artists");
      const data = await response.json();
      console.log("Artists fetched:", data);
      setArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();
      console.log("Users fetched:", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchSongs = async (artistId) => {
    try {
      console.log(`Fetching songs for artist ID: ${artistId}`);
      const response = await fetch(`http://localhost:5000/songs/artist/${artistId}`);
      const data = await response.json();
      console.log("Songs fetched:", data);
      setArtistSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const pickAudioFile = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        const file = {
          uri: result.uri || result.assets[0].uri,
          name: result.name || result.assets[0].name || "audio.mp3",
          type: result.mimeType || result.assets[0].mimeType || "audio/mpeg",
        };
        console.log("Audio file picked:", file);
        setAudioFile(file);
      }
    } catch (error) {
      console.error("Error picking audio file:", error);
      Alert.alert("Error", "Failed to pick an audio file.");
    }
  };

  const pickCoverFile = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        const file = {
          uri: result.uri || result.assets[0].uri,
          name: result.name || result.assets[0].name || "cover.jpg",
          type: result.mimeType || result.assets[0].mimeType || "image/jpeg",
        };
        console.log("Cover file picked:", file);
        setCoverFile(file);
      }
    } catch (error) {
      console.error("Error picking cover file:", error);
      Alert.alert("Error", "Failed to pick a cover file.");
    }
  };

  const uriToBlob = async (uri) => {
    if (!uri.startsWith("data:")) return uri;
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const handleUpload = async () => {
    if (!audioFile || !name || !artistName) {
      Alert.alert("❌ Error", "Please fill all required fields and select an audio file!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("artistName", artistName);
      const audioBlob = await uriToBlob(audioFile.uri);
      formData.append("audio", audioBlob, audioFile.name);
      if (coverFile) {
        const coverBlob = await uriToBlob(coverFile.uri);
        formData.append("cover", coverBlob, coverFile.name);
      }

      console.log("Uploading song...");
      const response = await fetch("http://localhost:5000/add-song", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const result = await response.json();
      console.log("Upload response:", result);

      if (response.ok) {
        setPopupMessage("✅ Song uploaded successfully!");
        setPopupVisible(true);
        setName("");
        setArtistName("");
        setAudioFile(null);
        setCoverFile(null);
        fetchArtists();
      } else {
        Alert.alert("❌ Error", `Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("❌ Error", "Upload failed. Please try again.");
    }
  };

  const pickArtistPhoto = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        const file = {
          uri: result.uri || result.assets[0].uri,
          name: result.name || result.assets[0].name || "artist.jpg",
          type: result.mimeType || result.assets[0].mimeType || "image/jpeg",
        };
        console.log("Artist photo picked:", file);
        setArtistPhoto(file);
      }
    } catch (error) {
      console.error("Error picking artist photo:", error);
      Alert.alert("Error", "Failed to pick an artist photo.");
    }
  };

  const handleAddSongToArtist = async (artistId, artistName) => {
    if (!audioFile || !name) {
      Alert.alert("❌ Error", "Please fill song name and select an audio file!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("artistName", artistName);
      const audioBlob = await uriToBlob(audioFile.uri);
      formData.append("audio", audioBlob, audioFile.name);
      if (coverFile) {
        const coverBlob = await uriToBlob(coverFile.uri);
        formData.append("cover", coverBlob, coverFile.name);
      }

      console.log("Adding song to artist ID:", artistId);
      const response = await fetch("http://localhost:5000/add-song", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const result = await response.json();
      console.log("Add song response:", result);

      if (response.ok) {
        setPopupMessage("✅ Song added successfully!");
        setPopupVisible(true);
        setName("");
        setAudioFile(null);
        setCoverFile(null);
        fetchSongs(artistId);
      } else {
        Alert.alert("❌ Error", `Add failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Add song error:", error);
      Alert.alert("❌ Error", "Failed to add song.");
    }
  };

  const handleUpdateArtist = async (artistId) => {
    try {
      const formData = new FormData();
      formData.append("name", artistName);
      if (artistPhoto) {
        const photoBlob = await uriToBlob(artistPhoto.uri);
        formData.append("photo", photoBlob, artistPhoto.name);
      }

      console.log("Updating artist ID:", artistId);
      const response = await fetch(`http://localhost:5000/update-artist/${artistId}`, {
        method: "PUT",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const result = await response.json();
      console.log("Update artist response:", result);

      if (response.ok) {
        setPopupMessage("✅ Artist updated successfully!");
        setPopupVisible(true);
        setArtistPhoto(null);
        fetchArtists();
      } else {
        Alert.alert("❌ Error", `Update failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Update artist error:", error);
      Alert.alert("❌ Error", "Failed to update artist.");
    }
  };

  const handleDeleteArtist = async (artistId) => {
    console.log("Delete Artist function called, ID:", artistId);
    try {
      const response = await fetch(`http://localhost:5000/delete-artist/${artistId}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response body:", result);
      setPopupMessage(result.message || "✅ Artist deleted successfully!");
      setPopupVisible(true);
      setSelectedArtist(null);
      setArtistSongs([]);
      fetchArtists();
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("❌ Error", `Failed: ${error.message}`);
    }
  };

  const handleDeleteSong = (songId, artistId) => {
    console.log("Delete Song button clicked, Song ID:", songId, "Artist ID:", artistId);
    if (!songId || !artistId) {
      console.error("Invalid song or artist ID for deletion");
      Alert.alert("❌ Error", "Invalid song or artist ID");
      return;
    }
    Alert.alert("Confirm Delete", "Are you sure you want to delete this song?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            console.log(`Sending DELETE request for song ID: ${songId}`);
            const response = await fetch(`http://localhost:5000/delete-song/${songId}`, {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            });
            console.log("Delete song response status:", response.status);
            const result = await response.json();
            console.log("Delete song response body:", result);

            if (response.ok) {
              setPopupMessage(result.message || "✅ Song deleted successfully!");
              setPopupVisible(true);
              fetchSongs(artistId);
            } else {
              Alert.alert("❌ Error", `Delete failed: ${result.message || result.error || "Unknown error"}`);
            }
          } catch (error) {
            console.error("Delete song error:", error);
            Alert.alert("❌ Error", `Failed to delete song: ${error.message}`);
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  const renderArtistItem = ({ item }) => (
    <TouchableOpacity
      style={styles.artistItem}
      onPress={() => {
        console.log("Artist selected:", item.name, "ID:", item._id);
        setSelectedArtist(item);
        setArtistName(item.name);
        fetchSongs(item._id);
      }}
    >
      <Text style={styles.artistText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSongItem = ({ item }) => (
    <View style={styles.songItem}>
      <Text style={styles.songText}>{item.name}</Text>
      <TouchableOpacity
        style={styles.deleteSongButton}
        onPress={() => handleDeleteSong(item._id, selectedArtist._id)}
      >
        <Text style={styles.deleteSongText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>Username: {item.username}</Text>
      <Text style={styles.userText}>Email: {item.email}</Text>
      <Text style={styles.userText}>Role: {item.role}</Text>
    </View>
  );

  const renderAddSongTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.header}>Add Song</Text>
      <Text>Song Name:</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <Text>Artist Name:</Text>
      <TextInput value={artistName} onChangeText={setArtistName} style={styles.input} />
      <Button title="Pick Audio File" onPress={pickAudioFile} />
      <Text>{audioFile ? `🎵 Audio: ${audioFile.name}` : "No audio file selected"}</Text>
      <Button title="Pick Cover Photo" onPress={pickCoverFile} />
      <Text>{coverFile ? `🖼️ Cover: ${coverFile.name}` : "No cover photo selected"}</Text>
      <Button title="Upload Song" onPress={handleUpload} />

      <Text style={styles.header}>Existing Artists</Text>
      <FlatList
        data={artists}
        renderItem={renderArtistItem}
        keyExtractor={(item) => item._id}
        style={styles.artistList}
        nestedScrollEnabled
      />
    </ScrollView>
  );

  const renderArtistsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.header}>Artists</Text>
      {selectedArtist ? (
        <View>
          <Text style={styles.subHeader}>Artist: {selectedArtist.name}</Text>

          <Text style={styles.subHeader}>Add Song</Text>
          <Text>Song Name:</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />
          <Button title="Pick Audio File" onPress={pickAudioFile} />
          <Text>{audioFile ? `🎵 Audio: ${audioFile.name}` : "No audio file selected"}</Text>
          <Button title="Pick Cover Photo" onPress={pickCoverFile} />
          <Text>{coverFile ? `🖼️ Cover: ${coverFile.name}` : "No cover photo selected"}</Text>
          <Button
            title="Add Song"
            onPress={() => handleAddSongToArtist(selectedArtist._id, selectedArtist.name)}
          />

          <Text style={styles.subHeader}>Update Artist</Text>
          <Text>Artist Name:</Text>
          <TextInput value={artistName} onChangeText={setArtistName} style={styles.input} />
          <Button title="Pick Artist Photo" onPress={pickArtistPhoto} />
          <Text>{artistPhoto ? `🖼️ Photo: ${artistPhoto.name}` : "No photo selected"}</Text>
          <Button title="Update Artist" onPress={() => handleUpdateArtist(selectedArtist._id)} />

          <Text style={styles.subHeader}>Songs</Text>
          <FlatList
            data={artistSongs}
            renderItem={renderSongItem}
            keyExtractor={(item) => item._id}
            style={styles.songList}
            nestedScrollEnabled
          />

          <Button
            title="Delete Artist"
            onPress={() => {
              console.log("Delete Artist button pressed for ID:", selectedArtist._id);
              handleDeleteArtist(selectedArtist._id);
            }}
            color="red"
          />
          <Button
            title="Back to Artists"
            onPress={() => {
              console.log("Back to Artists clicked");
              setSelectedArtist(null);
            }}
          />
        </View>
      ) : (
        <FlatList
          data={artists}
          renderItem={renderArtistItem}
          keyExtractor={(item) => item._id}
          style={styles.artistList}
          nestedScrollEnabled
        />
      )}
    </ScrollView>
  );

  const renderUsersTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.header}>Users</Text>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item._id}
        style={styles.userList}
        nestedScrollEnabled
      />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <TouchableOpacity
          style={[styles.sidebarItem, selectedTab === "Users" && styles.selectedSidebarItem]}
          onPress={() => {
            console.log("Users tab selected");
            setSelectedTab("Users");
            setSelectedArtist(null);
          }}
        >
          <Text style={styles.sidebarText}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sidebarItem, selectedTab === "Add Song" && styles.selectedSidebarItem]}
          onPress={() => {
            console.log("Add Song tab selected");
            setSelectedTab("Add Song");
            setSelectedArtist(null);
          }}
        >
          <Text style={styles.sidebarText}>Add Song</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sidebarItem, selectedTab === "Artists" && styles.selectedSidebarItem]}
          onPress={() => {
            console.log("Artists tab selected");
            setSelectedTab("Artists");
            setSelectedArtist(null);
          }}
        >
          <Text style={styles.sidebarText}>Artists</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
        {selectedTab === "Add Song" && renderAddSongTab()}
        {selectedTab === "Artists" && renderArtistsTab()}
        {selectedTab === "Users" && renderUsersTab()}
      </View>
      <Popup visible={popupVisible} message={popupMessage} onClose={() => setPopupVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
  },
  sidebar: {
    width: 150,
    backgroundColor: "#333",
    paddingTop: 20,
  },
  sidebarItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  selectedSidebarItem: {
    backgroundColor: "#555",
  },
  sidebarText: {
    color: "#fff",
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  artistList: {
    marginTop: 20,
  },
  artistItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 4,
  },
  artistText: {
    fontSize: 16,
  },
  songList: {
    marginTop: 10,
    marginBottom: 20,
  },
  songItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 4,
  },
  songText: {
    fontSize: 16,
    flex: 1,
  },
  deleteSongButton: {
    backgroundColor: "#ff4444",
    padding: 5,
    borderRadius: 4,
  },
  deleteSongText: {
    color: "#fff",
    fontSize: 14,
  },
  userList: {
    marginTop: 20,
  },
  userItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 4,
  },
  userText: {
    fontSize: 14,
  },
});

export default AdminScreen;