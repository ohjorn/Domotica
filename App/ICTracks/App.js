import 'react-native-gesture-handler';
import {
  NavigationContainer,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useState, useEffect, Component} from 'react';
import ConnectionChecker from './components/ConnectionChecker';
import {createStackNavigator} from '@react-navigation/stack';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {SearchBar} from 'react-native-elements';

import IngekloktPersoneel from './components/IngekloktPersoneel';
import AllPeople from './components/AllPeople';
import AlarmScreenComponent from './components/AlarmScreen';
import Clock from 'react-live-clock';

function ConnectionScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ConnectionChecker />
      <Text>Klik op de Connectie om het te herladen...</Text>
    </View>
  );
}

function PeopleScreen({navigation}) {
  return (
    <View>
      <View style={{height: '90%', justifyContent: 'center'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <View>
            <TouchableHighlight
              onPress={() => navigation.navigate('LeerlingenAanwezig')}>
              <View style={styles.touchableButton}>
                <MCIcons name="account-check" size={80} color="white" />
                <Text style={{fontSize: 18, color: 'white'}}>Aanwezig</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight
              onPress={() => navigation.navigate('Klas')}>
              <View style={styles.touchableButton}>
                <MCIcons name="account-group" size={100} color="white" />
                <Text style={{color: 'white', fontSize: 18}}>Klas</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </View>
  );
}

function AlarmScreen() {
  return (
      <AlarmScreenComponent />
  );
}

function PeopleStack({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="PeopleScreen"
        component={PeopleScreen}></Stack.Screen>
      <Stack.Screen
        options={{headerTitle: 'Aanwezigen'}}
        name="LeerlingenAanwezig"
        component={LeerlingenAanwezig}></Stack.Screen>
      <Stack.Screen
        options={{headerTitle: 'Klas'}}
        name="Klas"
        component={Klas}></Stack.Screen>
    </Stack.Navigator>
  );
}

function LeerlingenAanwezig({navigation}) {
  return (
    <View>
      <IngekloktPersoneel />
    </View>
  );
}

function Klas({navigation}) {
  return (
    <View>
      <AllPeople />
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.setState({isLoading: false});
  }

  render() {
    return (
      <NavigationContainer>
        {this.state.isLoading ? (
          <ActivityIndicator />
        ) : (
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;

                if (route.name === 'Verbinding') {
                  iconName = focused
                    ? 'signal-cellular-3'
                    : 'signal-cellular-outline';
                } else if (route.name == 'Alarm') {
                  iconName = focused ? 'alarm-light' : 'alarm-light-outline';
                } else if (route.name == 'Leerlingen') {
                  iconName = focused
                    ? 'account-group'
                    : 'account-group-outline';
                }

                return <MCIcons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: 'dodgerblue',
              inactiveTintColor: 'gray',
            }}>
            <Tab.Screen name="Verbinding" component={ConnectionScreen} />
            <Tab.Screen name="Leerlingen" component={PeopleStack} />
            <Tab.Screen name="Alarm" component={AlarmScreen} />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  touchableButton: {
    backgroundColor: 'dodgerblue',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: 'green',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 22,
  },
});
