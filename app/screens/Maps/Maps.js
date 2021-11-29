import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Button,
  Alert
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const db = SQLite.openDatabase('city_db.db');

const Maps = ({ route, navigation }) => {

  const { cityLon, cityLat, ciudad, provincia, pais } = route.params;

  const lat = parseFloat(cityLat);
  const lon = parseFloat(cityLon);
  const location = {
    latitude: lat,
    longitude: lon,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  //Funcion para registrar Ciudad en la Base de Datos si la localizacion es la correcta
  function registerCity() {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM tbl_city where latitud = ? AND longitud = ?',
        [lat, lon],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            Alert.alert('Advertencia', 'La ciudad ya se encuentra en el listado',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Add'),
                }
              ],
              { cancelable: false },
            );
          } else {
          tx.executeSql(
            'INSERT INTO tbl_city (city_name, city_state, city_country, latitud, longitud) VALUES (?,?,?,?,?)',
            [ciudad, provincia, pais, lat, lon],
            (tx, results) => {
//              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                Alert.alert(
                  'Success',
                  'La ciudad ha sido agregada correctamente',
                  [
                    {
                      text: 'Ok',
                      onPress: () => navigation.navigate('ViewAllCities'),
                    },
                  ],
                  { cancelable: false },
                );
              } else {
                alert('La ciudad no se agrego');
              }
            });
          }
        });
    });
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        mapType='standard'
        region={location}
      >
        <MapView.Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        />
      </MapView>
      <View style={styles.bottomView}>
        <View style={styles.txt_map}>
          <Text>Ciudad: {ciudad} </Text>
          <Text>Latitud: {lat}</Text>
          <Text>Longitud: {lon}</Text>
        </View>
        <View style={styles.btn_row}>
          <Button
            title="Confirmar"
            color="#CD5C5C"
            onPress={() => registerCity()}
          />
          <Button
            title="Cancelar"
            color="#CD5C5C"
            onPress={() => navigation.navigate("Add")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  btn_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  txt_map: {
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    height: 80,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
  },
});

export default Maps;
