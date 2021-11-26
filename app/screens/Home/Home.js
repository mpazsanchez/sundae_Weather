import React, { useEffect } from 'react';
import { Text, View, Animated, StyleSheet, Button } from 'react-native';
import Fondo from '../../assets/sundae.png';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('city_db.db');

const Home = ({ navigation }) => {

  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='tbl_city'",
      [],
      function (tx, results) {
        console.log('Alert found tables:', results.rows.length);
        if (results.rows.length == 0) {
          //txn.executeSql('DROP TABLE IF EXISTS tbl_city', []);
          txn.executeSql('CREATE TABLE tbl_city (city_id INTEGER PRIMARY KEY AUTOINCREMENT, city_name VARCHAR(100), city_state VARCHAR(100), city_country VARCHAR(100), latitud FLOAT(100), longitud FLOAT(100))');
          console.log('Se creo la tabla');
        } else {
          console.log('La tabla city ya existe');
        }
      }
    );
  });

  return (
    <View style={styles.container}>
      <Animated.Image source={Fondo} style={styles.image} />
      <Animated.Text style={styles.text}>Sundae Weather</Animated.Text>
      <Text style={styles.descripcion}>
        Informacion del proyecto, proposito de la aplicacion, descripcion de
        funcionalidades y uso de la misma.
      </Text>
      <Button
        title="Iniciar"
        color="#CD5C5C"
        onPress={() => navigation.navigate('ViewAllCities')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FDEDEC',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    // fontFamily: 'FredokaOne-Regular',
    color: '#CD5C5C',
    fontSize: 50,
  },
  descripcion: {
    // fontFamily: 'Gluten-Bold',
    color: '#CD5C5C',
    fontSize: 20,
    textAlign: 'center',
  },
  btn: {
    color: '#CD5C5C',
  },
});
export default Home;