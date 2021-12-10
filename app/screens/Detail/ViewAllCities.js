import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import * as SQLite from "expo-sqlite";
import Bg from "../../assets/bg-gradient.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { SearchBar } from "react-native-elements";
import Loading from "../Loading";

//Conexion a la DB
const db = SQLite.openDatabase("city_db.db");

const ViewAllCities = ({ navigation }) => {
  let [flatListItems, setFlatListItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState();
  const [isVisible, setIsVisible] = useState(true);

  // Consulta a la DB
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM tbl_city", [], (tx, results) => {
      var temp = [];
      for (let i = 0; i < results.rows.length; ++i)
        temp.push(results.rows.item(i));
      setFlatListItems(temp);
      setIsVisible(false);
    });
  });

  const filterList = (search) => {
    setSearch(search);
    const filter = flatListItems.filter((item) => {
      return item.city_name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredItems(filter);
    if (!search || search === "") {
      setFilteredItems(flatListItems);
    }
  };

  let content = (
    <View style={styles.card}>
      <Text style={styles.text}>
        No hay ciudades en el listado, agrega para continuar.
      </Text>
    </View>
  );

  if (flatListItems.length > 0) {
    content = (
      <>
        <SearchBar
          placeholder="Filtra las ciudades"
          placeholderTextColor={"white"}
          onChangeText={filterList}
          value={search}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={{ color: "white" }}
          leftIconContainerStyle={{ inputStyle: "white" }}
        />
        <FlatList
          style={styles.cards_container}
          data={filteredItems || flatListItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View key={item.city_id} style={styles.card}>
              <Text style={styles.card_city}>{item.city_name}</Text>
              <Text style={styles.card_country}>{item.city_country}</Text>

              <View style={styles.btn_row}>
                <TouchableOpacity
                  title="Clima"
                  style={styles.btn_card}
                  onPress={() =>
                    navigation.navigate("Weather", { paramKey: item.city_id })
                  }
                >
                  <Text style={styles.btn_card_text}>Clima</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  title="Eliminar"
                  style={styles.btn_card}
                  onPress={() =>
                    navigation.navigate("Delete", { paramKey: item.city_id })
                  }
                >
                  <Text style={styles.btn_card_text}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </>
    );
  }

  useEffect(() => {
    return () => {
      setFlatListItems([]);
    };
  }, []);

  return (
    <ImageBackground source={Bg} resizeMode="cover" style={styles.bg}>
      <SafeAreaView style={styles.container}>
        <Loading isVisible={isVisible} />

        {content}
      </SafeAreaView>
      <TouchableOpacity
        style={styles.btn_add}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("Add")}
      >
        <FontAwesomeIcon icon={faPlus} style={styles.icon} />
      </TouchableOpacity>
    </ImageBackground>
  );
};

//----- Estilos -----
const styles = StyleSheet.create({
  //----- Estilos contenedores -----
  container: {
    flex: 1,
    justifyContent: "space-around",
    width: "100%",
  },

  bg: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },

  cards_container: {
    width: "100%",
  },

  //----- Estilos card -----
  card: {
    padding: 10,
    margin: 7,
    marginHorizontal: 8,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.270)",
  },

  card_city: {
    color: "white",
    fontSize: 20,
    fontWeight: "400",
    paddingTop: 8,
  },

  card_country: {
    color: "white",
    fontSize: 16,
    paddingTop: 8,
  },

  card_conditions: {
    color: "white",
    fontSize: 15,
    paddingTop: 8,
  },

  //----- Botones card
  btn_card: {
    marginTop: 12,
    borderRadius: 15,
    backgroundColor: "#ff9696d0",
    height: 40,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },

  btn_card_text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
  },

  //Otros botones
  btn_row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
  },

  btn_add: {
    backgroundColor: "#fae4e4",
    color: "#FF9696",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    display: "flex",
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    height: 65,
    borderRadius: 100,
  },

  icon: {
    color: "#FF9696",
  },

  title: {
    fontSize: 16,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },

  // SearchBar
  containerStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.270)",
    borderRadius: 15,
    borderColor: "white",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  inputContainerStyle: {
    backgroundColor: "#ff9696",
    borderRadius: 15,
    borderColor: "white",
  },
});

export default ViewAllCities;
