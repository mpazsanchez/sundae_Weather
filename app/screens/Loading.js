import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";

const Loading = (props) => {
  return (
    <Overlay isVisible={props.isVisible} overlayStyle={styles.overlay}>
      <View style={styles.view}>
        <Text style={styles.text}>Cargando...</Text>
        <ActivityIndicator size="large" color="#FF9696" />
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#FF9696",
    marginTop: 10,
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    height: 150,
    width: 150,
    backgroundColor: "#fff",
    borderColor: "#FF9696",
    borderWidth: 2,
    borderRadius: 10,
  },
});

export default Loading;
