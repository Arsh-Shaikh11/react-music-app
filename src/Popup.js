import React, { useEffect } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";

const Popup = ({ visible, message, onClose }) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => onClose(), 2000); // Auto-close after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.popup}>
                    <Text style={styles.popupText}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    popup: { backgroundColor: "#1DB954", padding: 20, borderRadius: 10, alignItems: "center" },
    popupText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default Popup;