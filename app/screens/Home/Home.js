import React, {useEffect} from 'react';
import {Text, View, Animated, StyleSheet, Button, ImageBackground, TouchableOpacity} from 'react-native';
import Logo from '../../assets/sundae.png';
import LogoText from '../../assets/logo.png';
import * as SQLite from 'expo-sqlite';
import Bg from '../../assets/bg-gradient.jpg';

const db = SQLite.openDatabase('city_db.db');

const Home = ({ navigation }) => {

  // Crear tabla si no existe
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='tbl_city'",
      [],
      function (tx, results) {
        console.log('Alert found tables:', results.rows.length);
        if (results.rows.length == 0) {
          txn.executeSql('CREATE TABLE tbl_city (city_id INTEGER PRIMARY KEY AUTOINCREMENT, city_name VARCHAR(100), city_state VARCHAR(100), city_country VARCHAR(100), latitud FLOAT(100), longitud FLOAT(100))');
          console.log('Se creo la tabla');
        } else {
          console.log('La tabla city ya existe');
        }
      }
    );
  });

  return (
    <ImageBackground source={Bg} resizeMode="cover" style={styles.bg}>
      <View style={styles.container}>
        <Animated.Image source={Logo} style={styles.image} />
          <Animated.Image source={LogoText} style={styles.imageText} />

        <Text style={styles.descripcion}>
        ¡Busca tu ciudad y accede al pronostico en tiempo real!
        </Text>

        <View style={styles.btn_row} >

          <TouchableOpacity
              title='Iniciar'
              style={styles.btn_card}
              onPress={() => navigation.navigate('ViewAllCities')}
          >
            <Text style={styles.btn_card_text} >Iniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity
              title='Acerca nuestro'
              style={styles.btn_card}
              onPress={() => navigation.navigate('About')}
            >
            <Text style={styles.btn_card_text}>Nosotros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  bg: {
    flex: 1,
    width: '100%',
  },

  image: {
    marginTop: 50,
    width: 150,
    height: 150,

  },
  imageText: {
    width: 280,
    height: 150,
    resizeMode: 'contain',
    
  },

  descripcion: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    width: '80%',

  },
  btn: {
    color: 'white',
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',

  },
  icon: {
    color: 'white',
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',

  },
  btn_row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    width: '100%',

  },
  btn_card: {
    marginTop: 12,
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
export default Home;