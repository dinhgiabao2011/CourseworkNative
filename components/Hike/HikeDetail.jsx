import React, { useState, useRef, useMemo } from "react";
import { Flex, Input, Text, Button, TextArea, Box } from "native-base";
import {
  Dimensions,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RadioGroup } from "react-native-radio-buttons-group";
import SelectDropdown from "react-native-select-dropdown";
import { useToast } from "native-base";
import Database from "../../Database";

const HikeDetail = ({ route }) => {
  const [hikeDetail, setHikeDetail] = useState(route.params.hike);
  const [show, setShow] = useState(false);
  const [name, setName] = useState(hikeDetail.name);
  const [location, setLocation] = useState(hikeDetail.location);
  const [date, setDate] = useState(hikeDetail.date);
  const [newDate, setNewDate] = useState(null);
  const [length, setLength] = useState(hikeDetail.length);
  const [parkingAvailable, setParkingAvailable] = useState(
    hikeDetail.parking_available
  );
  const [difficultyLevel, setDifficultyLevel] = useState(
    hikeDetail.difficulty_level
  );
  const [description, setDescription] = useState(hikeDetail.description);
  const toast = useToast();
  const dropdown = useRef(null);
  const level = ["High", "Medium", "Low"];
  const radioButtons = useMemo(
    () => [
      {
        id: "1",
        label: "Yes",
        value: "yes",
      },
      {
        id: "2",
        label: "No",
        value: "no",
      },
    ],
    []
  );

  const handleDatePicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setNewDate(currentDate);
  };
  const showDatepicker = () => {
    setShow(true);
  };

  const handleOnUpdate = () => {
    const updatedHikeDetail = {
      ...hikeDetail,
      name: name,
      location: location,
      length: length,
      date: newDate === null ? date : newDate.toLocaleDateString(),
      parking_available: parkingAvailable,
      difficulty_level: difficultyLevel,
      description: description,
    };
    if (
      !updatedHikeDetail.name ||
      !updatedHikeDetail.location ||
      !updatedHikeDetail.date ||
      !updatedHikeDetail.parking_available ||
      !updatedHikeDetail.length ||
      !updatedHikeDetail.difficulty_level
    ) {
      toast.show({
        title: "Please fill in all required information",
        status: "warning",
      });
      return;
    }
    Alert.alert(
      "Confirmation ?",
      `Hike name: ${name} \nLocation: ${location} \nDate: ${date} \nParking available: ${
         parkingAvailable ? "Yes" : " No"
      }\nLength: ${length}\nLevel of difficulties: ${difficultyLevel}\nDescription: ${description} `,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            Database.updateHike(hikeDetail.id, updatedHikeDetail);
            toast.show({
              description: "",
              duration: 1000,
              render: () => {
                return (
                  <Box bg="emerald.500" px="3" py="2" rounded="sm" mb={5}>
                    <Text fontWeight={"bold"} color={"white"}>
                      Hike was updated
                    </Text>
                  </Box>
                );
              },
            });
            const data = Database.getHikeDetail(hikeDetail.id);
            setHikeDetail(data);
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={Keyboard.dismiss} activeOpacity={1}>
      <View style={styles.container}>
        <View style={styles.hike_detail_container}>
          <Flex flexDirection={"row"} alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={"xl"}>
              Name:
            </Text>
            <Input
              value={name}
              onChangeText={(text) => setName(text)}
              width={260}
              fontSize={"xl"}
              marginLeft={3}
            />
          </Flex>
          <Flex marginTop={5} flexDirection={"row"} alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={"xl"}>
              Location:
            </Text>
            <Input
              value={location}
              onChangeText={(text) => setLocation(text)}
              fontSize="16"
              width={225}
              marginLeft={4}
            />
          </Flex>
          <Flex marginTop={5} flexDirection={"row"} alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={"xl"}>
              Date:
            </Text>
            {!show ? (
              <Text
                fontSize={"lg"}
                onPress={showDatepicker}
                style={styles.text}
              >
                {newDate == null ? date : newDate.toLocaleDateString()}
              </Text>
            ) : (
              <Text style={styles.text}></Text>
            )}

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode="date"
                is24Hour={true}
                onChange={handleDatePicker}
                style={{
                  width: 150,
                }}
              />
            )}
          </Flex>
          <Flex marginTop={5} flexDirection={"row"} alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={"xl"}>
              Parking Available:
            </Text>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={(buttons) => {
                const selectedValue = parkingAvailable ? "1" : "2";
                setParkingAvailable(selectedValue);
              }}
              selectedId={parkingAvailable ? "1" : "2"}
            />
          </Flex>
          <Flex marginTop={5} flexDirection={"row"} alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={"xl"}>
              Length:
            </Text>
            <Input
              value={length.toString()}
              onChangeText={(text) => setLength(text)}
              width={243}
              keyboardType="numeric"
              marginLeft={4}
              fontSize="16"
            />
          </Flex>
          <Flex marginTop={5} flexDirection={"row"} alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={"xl"}>
              Dificulty level:
            </Text>
            <SelectDropdown
              ref={dropdown}
              data={level}
              buttonStyle={{ width: 197 }}
              onSelect={(selectedItem, index) => {
                setDifficultyLevel(selectedItem);
              }}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Icon
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    size={15}
                  />
                );
              }}
              defaultButtonText={"Choose Options"}
              defaultValue={difficultyLevel}
            />
          </Flex>

          <Flex marginTop={5} flexDirection={"row"} alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={"xl"}>
              Description:
            </Text>
          </Flex>
          <TextArea
            value={description}
            onChangeText={(text) => setDescription(text)}
            width={330}
            size="lg"
          />
          <View marginTop={10} marginBottom={10}>
            <Button onPress={handleOnUpdate} style={styles.button}>
              <Text fontWeight={"bold"} color={"white"}>
                Update
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 25,
    backgroundColor: "white",
    height: Dimensions.get("window").height,
  },
  hike_detail_container: {
    backgroundColor: "#fcfaf9",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  button: {
    color: "white",
    marginTop: 20,
    fontWeight: "bold",
  },
});
export default HikeDetail;
