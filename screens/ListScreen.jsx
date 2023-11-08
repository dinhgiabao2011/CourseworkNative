import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
   TouchableOpacity,
   View,
   FlatList,
   Dimensions,
} from 'react-native';
import { Text, Flex, Button, Box } from 'native-base';
import Database from '../Database';
import { StyleSheet } from 'react-native';
import { useToast } from 'native-base';

const ListScreen = ({ navigation }) => {
   const isFocused = useIsFocused();
   const toast = useToast();
   const [listHike, setListHike] = useState([]);
   const [modalVisible, setModalVisible] = useState(false);
  
   useEffect(() => {
      Database.getListHike()
      .then((res) => setListHike(res))
      .catch((err) => console.log('Error fetching hike', err))
   }, [isFocused]);
  
   const renderListHike = ({ item }) => {
      return (
         <Flex
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'baseline'}
         >
            <TouchableOpacity
               onPress={() => navigation.navigate('Hike Detail', { hike: item })}
               style={styles.hike}
            >
               <View key={item.id}>
                  <View style={styles.content}>
                     <Flex
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        alignItems={'baseline'}
                     >
                        <Text
                           fontWeight={'bold'}
                           fontSize={'lg'}
                        >
                           {item.name}
                        </Text>
                     </Flex>
                  </View>
               </View>
            </TouchableOpacity>
            <Flex
               flexDirection={'row'}
               justifyContent={'space-between'}
               alignItems={'baseline'}
            >
               <Button>
                  <Text
                     fontSize={15}
                     color={'white'}
                     fontWeight={'bold'}
                  >
                     More
                  </Text>
               </Button>
               <Button
                  onPress={async () => {
                     await Database.deleteHike(item.id);
                     toast.show({
                        description: '',
                        duration: 3000,
                        render: () => {
                           return (
                              <Box
                                 bg='red.500'
                                 px='3'
                                 py='2'
                                 rounded='sm'
                                 mb={5}
                              >
                                 <Text
                                    fontWeight={'bold'}
                                    color={'white'}
                                 >
                                    Hike was Deleted
                                 </Text>
                              </Box>
                           );
                        },
                     });
                     setModalVisible(!modalVisible);
                     const data = await Database.getListHike();
                     setListHike(data);
                  }}
                  marginLeft={3}
                  backgroundColor={'#374b73'}
               >
                  <Text
                     fontSize={15}
                     color={'white'}
                     fontWeight={'bold'}
                  >
                     Delete
                  </Text>
               </Button>
            </Flex>
         </Flex>
        
      );
   };

   return (
      <View
         style={{
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
         }}
      >
        
         <Button
            onPress={async () => {
               await Database.deleteAllHikes();
               toast.show({
                  description: '',
                  duration: 3000,
                  render: () => {
                     return (
                        <Box
                           bg='red.500'
                           px='3'
                           py='2'
                           rounded='sm'
                           mb={5}
                        >
                           <Text
                              fontWeight={'bold'}
                              color={'white'}
                           >
                              All Hike Deleted
                           </Text>
                        </Box>
                     );
                  },
               });
               setModalVisible(!modalVisible);
               const data = await Database.getListHike();
               setListHike(data);
            }}
            style={styles.deleteBtn}
            backgroundColor={'#374b73'}
         >
            <Text
               fontSize={15}
               color={'white'}
               fontWeight={'bold'}
            >
               Delete All
            </Text>
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
      backgroundColor: 'white',
      height: Dimensions.get('window').height,
   },
   hike: {
      backgroundColor: '#fcfaf9',
      marginVertical: 10,
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.1,
   },
   content: {
      padding: 10,
   },
   deleteBtn:{
      marginTop: 50
   }
});
export default ListScreen;
