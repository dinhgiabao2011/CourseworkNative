import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, FlatList, Dimensions } from "react-native";
import { Text, Flex, Input, Button } from "native-base";
import Database from "../Database";
import { StyleSheet } from "react-native";


const SearchScreen = () => {
  const [search, setSearch] = useState("");
  const [listHike, setListHike] = useState([]);

  const handleSearch = () => {
    if (search.trim() !== "") {
      Database.search(search)
        .then((res) => setListHike(res))
        .catch((err) => console.log("Error fetching hike", err));
    }
  }

  const renderListHike = ({ item }) => {
    return (
      <TouchableOpacity style={styles.hike}>
        <View key={item.id}
          style={styles.content}
        >
            <Flex
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"baseline"}
            >
              <Text fontWeight={"bold"} fontSize={"lg"}>
                {item.name}
              </Text>
            </Flex>
          </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        height: Dimensions.get("window").height,
        marginTop: 40
      }}
    >
        <Input
            value={search} 
            onChangeText={text => setSearch(text)}
            size='xl'
        />
        <Button
            onPress={handleSearch}
        >
            Search
        </Button>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderListHike}
        style={styles.container}
        data={listHike}
        numColumns={1}
      ></FlatList>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    paddingHorizontal: 25,
    backgroundColor: "white",
    height: Dimensions.get("window").height,
  },
  hike: {
    backgroundColor: "#fcfaf9",
    marginVertical: 10,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
  },
  content: {
    padding: 10,
  },
});
export default SearchScreen;
