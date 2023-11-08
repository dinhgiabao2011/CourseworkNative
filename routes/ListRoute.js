import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListScreen from '../screens/ListScreen';
import NewHike from '../screens/NewHike';
import SearchScreen from '../screens/SearchScreen';

const ListRoute = () => {
   const Tab = createBottomTabNavigator();
   return (
      <Tab.Navigator>
          <Tab.Screen
            name='New Hike'
            component={NewHike} 
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Icon
                     name='plus'
                     color={color}
                     size={size}
                  />
               ),
               headerShown: false,
            }}
         />
         <Tab.Screen
            name='List'
            component={ListScreen}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Icon
                     name='list'
                     color={color}
                     size={size}
                  />
               ),
               headerShown: false,
            }}
         />
          <Tab.Screen
            name='Search'
            component={SearchScreen}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Icon
                     name='search'
                     color={color}
                     size={size}
                  />
               ),
               headerShown: false,
            }}
         />
      </Tab.Navigator>
   );
};

export default ListRoute;
