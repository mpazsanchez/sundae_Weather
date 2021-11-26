import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

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
    <View style={styles.container}>
      <Text>Desea Eliminar de la Lista?</Text>
      <Button
        title="Delete"
        color="#CD5C5C"
        onPress={
          () => {
            deleteCity(); navigation.navigate('ViewAllCities');
          }
        }
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
});

export default Delete;