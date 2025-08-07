import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import Popup from "./Popup";

const ArtistDetailScreen = () => {
    const [name, setName] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [artistPhoto, setArtistPhoto] = useState(null);
    const [songs, setSongs] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const navigation = useNavigation();
    const route = useRoute();
    const { artistId, artistName } = route.params;

    useEffect(() => {
        fetchSongs();
        setName(artistName);
    }, []);

    const fetchSongs = async () => {
        try {
            const response = await fetch(`http://localhost:5000/songs/artist/${artistId}`);
            const data = await response.json();
            setSongs(data);
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };

    const pickAudioFile = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ type: "audio/*", copyToCacheDirectory: true });
            if (!result.canceled) {
                const file = {
                    uri: result.uri || result.assets[0].uri,
                    name: result.name || result.assets[0].name || "audio.mp3",
                    type: result.mimeType || result.assets[0].mimeType || "audio/mpeg",
                };
                setAudioFile(file);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick an audio file.");
        }
    };

    const pickCoverFile = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ type: "image/*", copyToCacheDirectory: true });
            if (!result.canceled) {
                const file = {
                    uri: result.uri || result.assets[0].uri,
                    name: result.name || result.assets[0].name || "cover.jpg",
                    type: result.mimeType || result.assets[0].mimeType || "image/jpeg",
                };
                setCoverFile(file);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick a cover file.");
        }
    };

    const pickArtistPhoto = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ type: "image/*", copyToCacheDirectory: true });
            if (!result.canceled) {
                const file = {
                    uri: result.uri || result.assets[0].uri,
                    name: result.name || result.assets[0].name || "artist.jpg",
                    type: result.mimeType || result.assets[0].mimeType || "image/jpeg",
                };
                setArtistPhoto(file);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick an artist photo.");
        }
    };

    const uriToBlob = async (uri) => {
        if (!uri.startsWith("data:")) return uri;
        const response = await fetch(uri);
        return await response.blob();
    };

    const handleAddSong = async () => {
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

            const response = await fetch("http://localhost:5000/add-song", {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" },
            });

            const result = await response.json();
            if (response.ok) {
                setPopupMessage("✅ Song added successfully!");
                setPopupVisible(true);
                setName("");
                setAudioFile(null);
                setCoverFile(null);
                fetchSongs();
            } else {
                Alert.alert("❌ Error", `Add failed: ${result.error}`);
            }
        } catch (error) {
            console.error("Add song error:", error);
            Alert.alert("❌ Error", "Failed to add song.");
        }
    };

    const handleUpdateArtist = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            if (artistPhoto) {
                const photoBlob = await uriToBlob(artistPhoto.uri);
                formData.append("photo", photoBlob, artistPhoto.name);
            }

            const response = await fetch(`http://localhost:5000/update-artist/${artistId}`, {
                method: "PUT",
                body: formData,
                headers: { "Accept": "application/json" },
            });

            const result = await response.json();
            if (response.ok) {
                setPopupMessage("✅ Artist updated successfully!");
                setPopupVisible(true);
                setArtistPhoto(null);
            } else {
                Alert.alert("❌ Error", `Update failed: ${result.error}`);
            }
        } catch (error) {
            console.error("Update artist error:", error);
            Alert.alert("❌ Error", "Failed to update artist.");
        }
    };

    const handleDeleteArtist = async () => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this artist and all their songs?", [
            { text: "Cancel" },
            {
                text: "Delete",
                onPress: async () => {
                    try {
                        const response = await fetch(`http://localhost:5000/delete-artist/${artistId}`, {
                            method: "DELETE",
                        });
                        const result = await response.json();
                        if (response.ok) {
                            setPopupMessage("✅ Artist deleted successfully!");
                            setPopupVisible(true);
                            setTimeout(() => navigation.goBack(), 2000); // Navigate back after popup
                        } else {
                            Alert.alert("❌ Error", `Delete failed: ${result.error}`);
                        }
                    } catch (error) {
                        console.error("Delete artist error:", error);
                        Alert.alert("❌ Error", "Failed to delete artist.");
                    }
                },
            },
        ]);
    };

    const renderSongItem = ({ item }) => (
        <View style={styles.songItem}>
            <Text style={styles.songText}>{item.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Artist: {artistName}</Text>

            <Text style={styles.subHeader}>Add Song</Text>
            <Text>Song Name:</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />
            <Button title="Pick Audio File" onPress={pickAudioFile} />
            <Text>{audioFile ? `🎵 Audio: ${audioFile.name}` : "No audio file selected"}</Text>
            <Button title="Pick Cover Photo" onPress={pickCoverFile} />
            <Text>{coverFile ? `🖼️ Cover: ${coverFile.name}` : "No cover photo selected"}</Text>
            <Button title="Add Song" onPress={handleAddSong} />

            <Text style={styles.subHeader}>Update Artist</Text>
            <Text>Artist Name:</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />
            <Button title="Pick Artist Photo" onPress={pickArtistPhoto} />
            <Text>{artistPhoto ? `🖼️ Photo: ${artistPhoto.name}` : "No photo selected"}</Text>
            <Button title="Update Artist" onPress={handleUpdateArtist} />

            <Text style={styles.subHeader}>Songs</Text>
            <FlatList
                data={songs}
                renderItem={renderSongItem}
                keyExtractor={(item) => item._id}
                style={styles.songList}
            />

            <Button title="Delete Artist" onPress={handleDeleteArtist} color="red" />

            <Popup visible={popupVisible} message={popupMessage} onClose={() => setPopupVisible(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: "#f5f5f5", flex: 1 },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    subHeader: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 12 },
    input: { borderWidth: 1, padding: 8, marginBottom: 12, borderRadius: 4 },
    songList: { marginTop: 10, marginBottom: 20 },
    songItem: { padding: 10, backgroundColor: "#fff", marginBottom: 8, borderRadius: 4 },
    songText: { fontSize: 16 },
});

export default ArtistDetailScreen;