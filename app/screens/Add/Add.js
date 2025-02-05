import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Bg from '../../assets/bg-gradient.jpg';
import Loading from "../Loading";

const db = SQLite.openDatabase('city_db.db');

//Schema validation
const addCityValidationSchema = yup.object().shape({
  city_name: yup
    .string()
    .min(3, "Pocos Caracteres")
    .max(100, "Demasiados Caracteres")
    .required("Debe ingresar el nombre de la Ciudad"),
  city_state: yup
    .string()
    .min(3, "Pocos Caracteres")
    .max(100, "Demasiados Caracteres")
    .required("Debe ingresar el nombre de la Provincia"),
  city_country: yup
    .string()
    .min(3, "Pocos Caracteres")
    .max(100, "Demasiados Caracteres")
    .required("Debe ingresar el nombre del Pais"),
});

const Add = ({ navigation }) => {
  // useState para tomar las coordenadas
  const [coordCity, setCoordCity] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Al actualizar coordenadas, ubica la ciudad en el mapa
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      navigation.navigate("Maps", {
        cityLon: coordCity.lon,
        cityLat: coordCity.lat,
        ciudad: coordCity.ciudad,
        provincia: coordCity.provincia,
        pais: coordCity.pais,
      });
    }

  }, [coordCity]);
  
  useEffect(() => {
    return () => {
      setCoordCity({}); 
    };
  }, []);

  // Obtener latitud y longitud de la ciudad y actualizar coordenadas
  const getGeolocation = (values) => {
    const params = {
      access_key: "08fd69a09f6670aa5cc0c6997b6535a3",
      query: `${values.city_name} ${values.city_state} ${values.city_country}`,
    };

    setIsVisible(true);

    axios
      .get("http://api.positionstack.com/v1/forward", { params })
      .then((response) => {
        const info = response.data.data[0];
        setCoordCity({
          ciudad: info.name,
          provincia: info.region,
          pais: info.country,
          lon: info.longitude,
          lat: info.latitude,
        });
      })
      .catch((error) => {
        Alert.alert(
          "Advertencia",
          "Ciudad no encontrada, revise los datos ingresados",
          [
            {
              text: "Ok",
              onPress: () => navigation.navigate("Add"),
            },
          ],
          { cancelable: false }
        );
      });
  };

  return (
  <ImageBackground source={Bg} resizeMode="cover" style={styles.bg}>
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Loading isVisible={isVisible} />
        <Text style={styles.text_title}>¿Qué ciudad deseas agregar?</Text>
          <Formik
            validationSchema={addCityValidationSchema}
            initialValues={{
              city_name: "",
              city_state: "",
              city_country: "",
            }}
            onSubmit={(values) => getGeolocation(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
            <>
              <TextInput
                name="city_name"
                style={styles.text_input}
                placeholder="Nombre de la Ciudad"
                onChangeText={handleChange("city_name")}
                onBlur={handleBlur("city_name")}
                value={values.city_name}
              />

              {errors.city_name && touched.city_name && (
                <Text style={styles.errorText}>{errors.city_name}</Text>
              )}

              <TextInput
                name="city_state"
                style={styles.text_input}
                placeholder="Nombre de la Provincia"
                onChangeText={handleChange("city_state")}
                onBlur={handleBlur("city_state")}
                value={values.city_state}
              />

              {errors.city_state && touched.city_state && (
                <Text style={styles.errorText}>{errors.city_state}</Text>
              )}

              <TextInput
                name="city_country"
                style={styles.text_input}
                placeholder="Nombre del Pais"
                onChangeText={handleChange("city_country")}
                onBlur={handleBlur("city_country")}
                value={values.city_country}
              />

              {errors.city_country && touched.city_country && (
                <Text style={styles.errorText}>{errors.city_country}</Text>
              )}

              <TouchableOpacity
                style={styles.btn_input}
                onPress={handleSubmit}
                title="Agregar Ciudad"
                disabled={!isValid || values.city_name === ""}
              >
                <Text style={styles.text_btn}> Agregar </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  </ImageBackground>
  );
};

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

  text: {
    fontSize: 40,
    margin: 10,
    textAlign: 'center',
  },

  text_title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    width: '85%',
  },

  card: {
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.270)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '85%',
    width: '80%',
  },

  text_input: {
    height: 40,
    width: "85%",
    margin: 10,
    paddingLeft: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.270)',
    color: 'white',
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    fontWeight: "600",
  },
  btn_input: {
    height: 40,
    width: "85%",
    margin: 10,
    backgroundColor: '#FF9696',
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text_btn: {
    color: "white",
    fontWeight: '500',
    fontSize: 16,
  },
  btn_row: {
    top: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  errorText: {
    fontSize: 12,
    color: "black",
    fontWeight: '500',
  },
});

export default Add;
