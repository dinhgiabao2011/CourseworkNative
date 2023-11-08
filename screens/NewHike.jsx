import React, { useState, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Database from "../Database";
import { useToast, Box } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import SelectDropdown from "react-native-select-dropdown";
import { Text, Input, Flex, TextArea, Button } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioGroup } from "react-native-radio-buttons-group";

const NewHike = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [parking_available, setParkingAvailable] = useState(true);
  const [length, setLength] = useState("");
  const [difficulty_level, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();
  const dropdownRef = useRef(null);
  const difficultyLevel = ["High", "Medium", "Low"];
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
    setDate(currentDate);
  };
  const showDatepicker = () => {
    setShow(true);
  };

  const handleCreateHike = () => {
    const newHike = {
      name,
      location,
      date: date.toLocaleDateString(),
      parking_available,
      length,
      difficulty_level,
      description,
    };

    if (
      !newHike.name ||
      !newHike.location ||
      !newHike.date ||
      !newHike.parking_available ||
      !newHike.length ||
      !newHike.difficulty_level
    ) {
      toast.show({
        title: "Please fill in all required information",
        status: "warning",
      });
      return;
    }
    Alert.alert(
      "New hike ?",
      `Hike name: ${name} \nLocation: ${location} \nDate: ${date} \nParking available: ${
        parking_available ? "Yes" : " No"
      }\nLength: ${length}\nLevel of difficulties: ${difficulty_level}\nDescription: ${description} `,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            Database.addNewHike(newHike);
            toast.show({
              description: "",
              duration: 1000,
              render: () => {
                return (
                  <Box bg="emerald.500" px="3" py="2" rounded="sm" mb={5}>
                    <Text fontWeight={"bold"} color={"white"}>
                      Hike was created
                    </Text>
                  </Box>
                );
              },
            });
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={Keyboard.dismiss} activeOpacity={1}>
      <ScrollView style={styles.layout}>
        <View style={styles.input}>
          <Text style={styles.label} fontSize="lg">
            Hike Name<Text style={styles.required}>*</Text>
          </Text>
          <Input
            size="xl"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.label} fontSize="lg">
            Location<Text style={styles.required}>*</Text>
          </Text>
          <Input
            size="xl"
            value={location}
            onChangeText={(text) => setLocation(text)}
          />
        </View>
        <View style={styles.input}>
          <Flex
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text style={styles.label} fontSize="lg">
              Date<Text style={styles.required}>*</Text>
            </Text>
            {!show ? (
              <View>
                <Text onPress={showDatepicker} fontSize={"lg"}>
                  {date.toLocaleDateString()}
                </Text>
              </View>
            ) : (
              <></>
            )}
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                onChange={handleDatePicker}
              />
            )}
          </Flex>
        </View>
        <View style={styles.input}>
          <Flex flexDirection={"row"} justifyContent={"space-between"}>
            <Text style={styles.label} fontSize="lg">
              Parking available
              <Text style={styles.required}>*</Text>
            </Text>
            <Flex>
              <RadioGroup
                radioButtons={radioButtons}
                onPress={(buttons) => setParkingAvailable(buttons)}
                selectedId={parking_available}
              />
            </Flex>
          </Flex>
        </View>
        <View style={styles.input}>
          <Flex flexDirection={"row"} justifyContent={"space-between"}>
            <Text style={styles.label} fontSize="lg">
              Length (km):
              <Text style={styles.required}>*</Text>
            </Text>
            <Input
              size="md"
              keyboardType="numeric"
              value={length}
              onChangeText={(text) => setLength(text)}
              width={200}
            />
          </Flex>
        </View>
        <View style={styles.input}>
          <Flex flexDirection={"row"} align={"center"}>
            <Text style={styles.label} fontSize="lg">
              Difficulty Level:
              <Text style={styles.required}>*</Text>
            </Text>
            <SelectDropdown
              ref={dropdownRef}
              data={difficultyLevel}
              buttonStyle={{ width: 220 }}
              onSelect={(selectedItem, index) => setDifficulty(selectedItem)}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Icon
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    size={15}
                  />
                );
              }}
              defaultButtonText={"Choose Options"}
            />
          </Flex>
        </View>
        <View style={styles.input}>
          <Text style={styles.label} fontSize="lg">
            Description
          </Text>
          <TextArea
            size="lg"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
        <Button
          onPress={() => {
            handleCreateHike();
          }}
        >
          Create
        </Button>
      </ScrollView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  layout: {
    height: Dimensions.get("window").height,
    backgroundColor: "white",
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  input: {
    marginVertical: 10,
  },
  required: {
    color: "red",
  },
});
export default NewHike;
