import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import axios from 'axios';
import iconRef from '../../utils/iconRef.js';

const db = SQLite.openDatabase('city_db.db');

function Weather({ route, navigation }) {
  const [userCity, setUserCity] = useState({});
  const [infoCity, setInfoCity] = useState({});

  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM tbl_city where city_id = ?',
      [route.params.paramKey],
      (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          setUserCity(results.rows.item(0));
        } else {
          alert('Ciudad no encontrada!');
        }
      });
  });

  //API_KEY = '562c8cf7ac4589daca68d9eeaa5237ea';

  function getWeather() {

    if (userCity.city_name != null) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${userCity.latitud}&lon=${userCity.longitud}&appid=128cbb6d697b9515f235f503e5961922&units=metric&lang=esp`)
        .then(response => {
          const info = response.data;
          setInfoCity({
            ciudad: userCity.city_name,
            pais: info.sys.country,
            //condiciones: info.weather[0].description,
            condiciones: info.weather[0].icon,
            temperatura: info.main.temp,
            temp_max: info.main.temp_max,
            temp_min: info.main.temp_min,
            humedad: info.main.humidity,
            viento: info.wind.speed,
          })
          console.log('weather', info)
        })
    }
  }

  useEffect(() => {
    getWeather()
  }, [userCity.city_name]);


  const { ciudad, pais, condiciones, temperatura, humedad, viento } = infoCity;
  return (
    <View style={styles.container}>
      <Text>Veamos como esta el Clima</Text>
      
      <Image
          style={{width: 150, height: 150}}
//        source={{uri: `https://openweathermap.org/img/wn/${infoCity.condiciones}@2x.png`}}
          source={iconRef[infoCity.condiciones]}
        />

      <View>
        <Text>Ciudad: {ciudad}</Text>
        <Text>Pais: {infoCity.pais}</Text>
        <Text>Temperatura: {infoCity.temperatura} °C </Text>
        <Text>Max/Min: {infoCity.temp_max}°C / {infoCity.temp_min}°C</Text>
        <Text>Humedad: {infoCity.humedad} % </Text>
        <Text>Viento: {infoCity.viento} km/h</Text>
        <Text>Condiciones: {infoCity.condiciones}</Text>
      </View>
      <View style={styles.btn_row} >
        <Button
          title="Cerrar"
          color="#CD5C5C"
          onPress={() => navigation.push('ViewAllCities')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FDEDEC',
  },
  btn_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Weather;

