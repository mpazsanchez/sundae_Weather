import React, {useEffect} from 'react';
import {Text, View, Animated, StyleSheet, Button, ImageBackground, TouchableOpacity} from 'react-native';
import Logo from '../../assets/sundae.png';
import LogoText from '../../assets/logo.png';
import * as SQLite from 'expo-sqlite';
import Bg from '../../assets/bg-gradient.jpg';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';



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
    <ImageBackground source={Bg} resizeMode="cover" style={styles.bg}>
    <View style={styles.container}>
        <Animated.Image source={Logo} style={styles.image} />
          <Animated.Image source={LogoText} style={styles.imageText} />

      <Text style={styles.descripcion}>
      ¡Busca tu ciudad y accede al pronostico en tiempo real!
      </Text>
      
      <TouchableOpacity
         title="Iniciar"
         style={styles.btn}
         activeOpacity={0.7}
        onPress={() => navigation.navigate('ViewAllCities')}
      >
         <FontAwesomeIcon icon={ faArrowDown } style={styles.icon} />
        </TouchableOpacity>

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
});
export default Home;