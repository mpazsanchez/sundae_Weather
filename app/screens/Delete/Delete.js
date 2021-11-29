import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ImageBackground, TouchableOpacity} from 'react-native';
import * as SQLite from 'expo-sqlite';
import Bg from '../../assets/bg-gradient.jpg';

const db = SQLite.openDatabase('city_db.db');

const Delete = ({ route, navigation }) => {
//  let [userCity, setUserCity] = useState({});

  let deleteCity = () => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM tbl_city where city_id = ?',
        [route.params.paramKey],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
        });
    });
  };

  return (
    <ImageBackground source={Bg} resizeMode="cover" style={styles.bg}>
    <View style={styles.card}>
      <Text style={styles.text_title}>¿Desea eliminar la ciudad de la lista?</Text>

      <TouchableOpacity
      style={styles.btn}
            title="Delete"
            color="#CD5C5C"
            onPress={
              () => {
                deleteCity(); navigation.navigate('ViewAllCities');
              }
            }
          >
            <Text style={styles.text_btn}> Eliminar </Text>
            
      </TouchableOpacity>

    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  card: {
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.270)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40%',
    width: '80%',
  },
  
  text_title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    width: '85%',
  },

  btn: {
    marginTop: 12,
    borderRadius: 15,
    backgroundColor: '#ff9696d0',
    height: 40,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },

  text_btn: {
    color: 'white',
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
  },
});

export default Delete;