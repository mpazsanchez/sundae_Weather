import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  ImageBackground,
  Animated
} from "react-native";
import Bg from '../../assets/bg-gradient.jpg';
import Logo from '../../assets/sundae.png';
import LogoText from '../../assets/logo.png';


const About = ({ navigation }) => {

  return (
    <ScrollView>
      <ImageBackground source={Bg} resizeMode="cover" style={styles.bg}>
        <Text style={styles.text}>
            ¡Hola! Somos el grupo 24 que resultó de la unión de otros equipos.
            Somos cuatro personas apasionadas por la tecnología que unimos 
            nuestras diversas aptitudes para realizar esta aplicación pensando 
            en que los usuarios tengan una buena experiencia. 
        </Text>
        <Text style={styles.text}>
            Estamos estudiando programación y realizando el curso de especialización 
            en desarrollo mobile - Codo a Codo | IBM Skillsbuild.
        </Text>
            <Text style={styles.text}>
            Desarrollamos una app que permite agregar ciudades a un listado y visualizar 
            el clima en el momento. Consume dos APIs, una de Geocoding (positionstack) y
            otra del clima (openweathermap). Fue desarrollada en React Native y el diseño
            se hizo siguiendo los estilos de Material Design.
        </Text>

        <Animated.Image source={Logo} style={styles.image} />
          <Animated.Image source={LogoText} style={styles.imageText} />



      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "#FDEDEC",
      },
      text: {
        fontSize: 20,
        margin: 10,
        color: '#ffffff',
      },
      bg: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
      },
      
      image: {
        marginTop: 50,
        width: 50,
        height: 50,

      },
      imageText: {
        width: 150,
        height: 75,
        resizeMode: 'contain',
        
      }
});

export default About;
