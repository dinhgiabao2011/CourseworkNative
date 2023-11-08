import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListRoute from './routes/ListRoute';
import { useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import Database from './Database';
import HikeDetail from './components/Hike/HikeDetail';

const Stack = createStackNavigator();
export default function App() {
   useEffect(() => {
      Database.initDatabase();
      LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.']);
   }, []);

   return (
      <NativeBaseProvider>
         <NavigationContainer>
            <Stack.Navigator initialRouteName='New Hike'>
               <Stack.Screen
                  name='List Page'
                  component={ListRoute}
                  options={{ headerShown: false }}
               />
               <Stack.Screen
                  name='Hike Detail'
                  component={HikeDetail}
               />
            </Stack.Navigator>
         </NavigationContainer>
      </NativeBaseProvider>
   );
}
