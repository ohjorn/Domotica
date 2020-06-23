import React, {Component} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-community/async-storage';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from 'react-native-reanimated';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  enableCache: true,
  sync: {},
});

export default class AlarmScreen extends Component {
  constructor() {
    super();
    this.onMessageArrived = this.onMessageArrived.bind(this);
    this.onConnectionLost = this.onConnectionLost.bind(this);

    const client = new Paho.MQTT.Client(
      'onto.mywire.org',
      8080,
      'Client-' + Math.random() * 9999 + 1,
    );
    client.onMessageArrived = this.onMessageArrived;
    client.onConnectionLost = this.onConnectionLost;
    client.connect({
      onSuccess: this.onConnect,
      useSSL: false,
      onFailure: (e) => {
        console.log('Error: ', e);
      },
    });

    this.state = {
      isLoading: true,
      client,
      isConnected: false,
      ledStatus: false,
      buttonText: 'Aanzetten',
      people: '??/??',
    };
  }

  onConnect = () => {
    console.log('Connected');
    const {client} = this.state;
    client.subscribe('/app/to/alarm');
    this.setState({
      isConnected: true,
      error: '',
      isLoading: false,
    });
    this.sendMessage('alarm-info');
  };

  onMessageArrived(entry) {
    console.log('Data Received');
    var json = JSON.parse(entry.payloadString);
    if (json.ledStatus == 'on') {
      this.setState({
        ledStatus: true,
        buttonText: 'Uitzetten',
        people: json.people,
      });
    } else if (json.ledStatus == 'off') {
      this.setState({
        ledStatus: false,
        buttonText: 'Aanzetten',
        people: json.people,
      });
    }
  }

  sendMessage = (message) => {
    console.log('message send.');
    var message = new Paho.MQTT.Message(message);
    message.destinationName = '/app/from';

    if (this.state.isConnected) {
      this.state.client.send(message);
    } else {
      this.connect(this.state.client)
        .then(() => {
          this.state.client.send(message);
          this.setState({error: '', isConnected: true});
        })
        .catch((error) => {
          console.log(error);
          this.setState({error: error});
        });
    }
  };

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
      this.setState({error: 'Lost Connection', isConnected: false});
    }
  }

  render() {
    return (
      <View style={{height: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
        <View>
          
        </View>
        <View style={{alignItems: 'center'}}>
        {this.state.ledStatus ? (
            <MCIcons name="alarm-light" size={80} color="green" />
          ) : (
            <MCIcons name="alarm-light" size={80} color="red" />
          )}
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          
            <Text style={styles.status}>Status: </Text>
            {this.state.ledStatus ? (
              <Text style={styles.alarmOn}>Aan</Text>
            ) : (
              <Text style={styles.alarmOff}>Uit</Text>
            )}
          </View>
          {this.state.ledStatus ? (
            <Button
              title={this.state.buttonText}
              onPress={() => this.sendMessage('alarm-off')}
              color="red"
            />
          ) : (
            <Button
              title={this.state.buttonText}
              onPress={() => this.sendMessage('alarm-on')}
              color="green"
            />
          )}
          <Text style={{fontSize: 12, marginTop: 4, color: '#9e9e9e'}}>Handmatig het alarm overriden.</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text style= {{fontSize: 16, marginBottom: 40}}>Mensen aanwezig: </Text><Text style={{fontSize: 16, fontWeight: 'bold'}}>{this.state.people}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  status: {
    fontSize: 25,
    
  },
  alarmOn: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 5,
  },
  alarmOff: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 5,
  },
});
