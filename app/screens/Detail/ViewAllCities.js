import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Button,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { SearchBar } from "react-native-elements";

//Conexion a la DB
const db = SQLite.openDatabase("city_db.db");

const ViewAllCities = ({ navigation }) => {
  let [flatListItems, setFlatListItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState();

  // Consulta a la DB
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM tbl_city", [], (tx, results) => {
      var temp = [];
      for (let i = 0; i < results.rows.length; ++i)
        temp.push(results.rows.item(i));
      setFlatListItems(temp);
    });
  });

  const filterList = (search) => {
    setSearch(search.toLowerCase());
    const filter = flatListItems.filter((item) => {
      return item.city_name.toLowerCase().match(search);
    });
    setFilteredItems(filter);
    if (!search || search === "") {
      setFilteredItems(flatListItems);
    }
  };

  useEffect(() => {
    return () => {
      setFlatListItems({}); // This worked for me
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Filtra las ciudades"
        onChangeText={filterList}
        value={search}
      />
      <FlatList
        data={filteredItems || flatListItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View key={item.city_id} style={styles.item}>
            <Text>Id: {item.city_id}</Text>
            <Text>City: {item.city_name}</Text>
            <Text>State: {item.city_state}</Text>
            <Text>Country: {item.city_country}</Text>
            <Text>Latitude: {item.latitud}</Text>
            <Text>Longitude: {item.longitud}</Text>

            <View style={styles.btn_row}>
              <Button
                title="Weather"
                color="#CD5C5C"
                onPress={() =>
                  navigation.navigate("Weather", { paramKey: item.city_id })
                }
              ></Button>

              <Button
                title="Delete"
                color="#CD5C5C"
                onPress={() =>
                  navigation.navigate("Delete", { paramKey: item.city_id })
                }
              ></Button>
            </View>
          </View>
        )}
      />
      <View style={styles.add_row}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Add")}
        >
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: "#FDEDEC",
  },
  item: {
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 40,
    marginTop: StatusBar.currentHeight || 0,
  },
  title: {
    fontSize: 16,
  },
  btn: {
    bottom: 70,
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: "#CD5C5C",
    alignItems: "center",
    justifyContent: "center",
  },
  add_row: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  btn_row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
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
});

export default ViewAllCities;
