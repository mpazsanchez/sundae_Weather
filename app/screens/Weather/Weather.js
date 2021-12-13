import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, ImageBackground } from 'react-native';
import * as SQLite from 'expo-sqlite';
import axios from 'axios';
import iconRef from '../../utils/iconRef.js';
import Bg from '../../assets/bg-gradient.jpg';
import Loading from '../Loading.js';

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarkerAlt, faWind, faTint } from "@fortawesome/free-solid-svg-icons";

const db = SQLite.openDatabase('city_db.db');

function Weather({ route }) {
  const [userCity, setUserCity] = useState({});
  const [infoCity, setInfoCity] = useState({}); 
  const [isVisible, setIsVisible] = useState(true);

  // Obtener la informacion de la ciudad
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

  // Obtener la informacion del clima
  function getWeather() {

    if (userCity.city_name != null) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${userCity.latitud}&lon=${userCity.longitud}&appid=128cbb6d697b9515f235f503e5961922&units=metric&lang=es`)
        .then(response => {
          const info = response.data;
          setInfoCity({
            ciudad: userCity.city_name,
            pais: info.sys.country,
            description: info.weather[0].description,
            condiciones: info.weather[0].icon,
            temperatura: Math.round(info.main.temp),
            humedad: info.main.humidity,
            viento: info.wind.speed,
          })
          setIsVisible(false);
        })
    }
  }

  useEffect(() => {
    getWeather()
  }, [userCity.city_name]);

  useEffect(() => {
    return () => {
      setInfoCity({}); 
      setUserCity({});
    };
  }, []);

  return (
    <ImageBackground source={Bg} resizeMode="cover" style={styles.bg}>
      <Loading isVisible={isVisible} />

      <View style={styles.container}>

        <View style={styles.card}>

            <Text style={styles.card_title}><FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} /> {infoCity.ciudad}, {infoCity.pais}</Text>

            <View style={styles.card_temp}>
                <Text style={styles.card_text_temp}>{infoCity.temperatura}° </Text>
                <Image
                    style={{width: 75, height: 75}}
                    source={iconRef[infoCity.condiciones]}
                  />
            </View>

            <View style={styles.card_info}> 
              <Text style={styles.card_details}>Detalles</Text>

              <View style={styles.card_details_container}>
                <Text style={styles.card_text}>Condiciones: {infoCity.description}</Text>
                <Text style={styles.card_text}><FontAwesomeIcon icon={faTint} style={styles.icon} /> Humedad: {infoCity.humedad} % </Text>
                <Text style={styles.card_text}><FontAwesomeIcon icon={faWind} style={styles.icon} /> Viento: {infoCity.viento} m/s</Text>
              </View>
            </View>

        </View>

      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },

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
    justifyContent: 'space-around',
    height: '80%',
    width: '80%',
  },
  
  card_title: {
    color: 'white',
    fontSize: 25,
  },

  icon: {
    color: 'white',
  },

  card_temp: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  card_text_temp: {
    color: 'white',
    fontSize: 55,
    fontWeight: "400",
  },

  card_text_tempMax: {
    color: 'white',
    fontSize: 16,
  },
  
  card_text: {
    color: 'white',
    fontSize: 18,
    fontWeight: "400",
  },

  card_details: {
    fontSize: 20,
    color: 'white',
    paddingBottom: 16,

  },

  card_details_container: {
    borderTopColor: 'white',
    borderTopWidth: 1,
    borderStyle: 'solid',
    paddingTop: 20,

  },

  card_info: {
   alignItems: 'center',


  },

  btn_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});

export default Weather;

