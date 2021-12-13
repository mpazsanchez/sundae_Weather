import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Alert,
  TouchableOpacity,
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
              if (results.rowsAffected > 0) {
                Alert.alert(
                  'Excelente',
                  '¡La ciudad ha sido agregada correctamente!',
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


        <View style={styles.btn_row} >

          <TouchableOpacity
              title='Confirmar'
              style={styles.btn_card}
              onPress={() => registerCity()}
            >
            <Text style={styles.btn_card_text} >Confirmar</Text>
          </TouchableOpacity>

          <TouchableOpacity
              title='Cancelar'
              style={styles.btn_card}
              onPress={() => navigation.navigate("Add")}
          >
            <Text style={styles.btn_card_text} >Cancelar</Text>
          </TouchableOpacity>


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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    margin: 10,
  },
  txt_map: {
    margin: 10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: '#ff9696d0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  bottomView: {
    height: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
 
  },

  btn_card: {
    margin: 12,
    borderRadius: 15,
    backgroundColor: '#ff9696d0',
    height: 40,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',

  },

  btn_card_text: {
    color: 'white',
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
  },
});

export default Maps;
