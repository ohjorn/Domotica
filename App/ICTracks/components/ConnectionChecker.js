import React, {useEffect, useState, Component} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import init from 'react_native_mqtt';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  enableCache: true,
  sync: {},
});

export default class ConnectionChecker extends Component{
  constructor() {
    super();
    this.onConnectionLost = this.onConnectionLost.bind(this);

    const client = new Paho.MQTT.Client(
      'onto.mywire.org',
      8080,
      'Client-' + Math.random() * 9999 + 1,
    );
    client.onConnectionLost = this.onConnectionLost;
    client.connect({
      onSuccess: this.onConnect,
      useSSL: false,
      timeout: 1,
      onFailure: (e) => {
        this.setState({error: e, isConnected: false, isLoading: false});
      },
    });

    this.state = {
      isConnected: false,
      isLoading: true,
      client,
    };
  }

  onConnect = () => {
    console.log('Connected');
    const {client} = this.state;
    client.subscribe('app/to');
    this.setState({
      isConnected: true,
      isLoading: false,
      error: '',
      messageToSend: 'status',
    });
  };

  

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
      this.setState({error: 'Lost Connection', isConnected: false, isLoading: false});
    }
  }

  updateConnectionStatus = () => {
    this.setState({
      isLoading: true,
      isConnected: false,
    })
    const client = new Paho.MQTT.Client(
      'onto.mywire.org',
      8080,
      'Client-' + Math.random() * 9999 + 1,
    );
    client.onConnectionLost = this.onConnectionLost;
    client.connect({
      onSuccess: this.onConnect,
      useSSL: false,
      timeout: 1,
      onFailure: (e) => {
        console.log('Error: ', e);
        this.setState({error: e, isConnected: false, isLoading: false});
      },
    });
  }
 
  render(){
    return (<View onTouchEnd={this.updateConnectionStatus}>
      {this.state.isLoading ? (
        <ActivityIndicator />
      ) : (
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: 'dodgerblue',
            marginBottom: 20,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 22,
              }}>
              Connectie:{' '}
            </Text>
            {this.state.isConnected ? (<Text style={{fontSize: 22, color: 'green'}}>Verbonden!</Text>) : (<Text style={{fontSize: 22, color: 'red'}}>Geen verbinding...</Text>)}
            
          </View>
        </View>
      )}
    </View>)
  } 
};
