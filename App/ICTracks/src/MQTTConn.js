import React from 'react';
import init from 'react_native_mqtt'
import AsyncStorage from '@react-native-community/async-storage';

init({
    size: 10000,
    storageBackend: AsyncStorage,
    enableCache: true,
    sync: {},
  });
export default class MQTTConn {
  constructor() {
    const client = new Paho.MQTT.Client(
      '192.168.0.188',
      9001,
      'Client-' + Math.random() * 9999 + 1,
    );
    client.onMessageArrived = this.onMessageArrived;
    client.onConnectionLost = this.onConnectionLost;
    client.connect({
      onSuccess: this.onConnect,
      useSSL: false,
      onFailure: (e) => {
        return console.log('Error: ', e);
      },
    });

    this.state = {
      client,
      message,
      isConnected: false,
    };
  }

  onConnect() {
    this.setState({isConnected: true, error: ''});
    return console.log("Connected with Client")
  }

  subscribe(channel) {
    const {client} = this.state;
    client.subscribe(channel)
    return console.log("Subscribed to channel: "+channel)
  }

  onMessageArrived(entry) {
    return entry;
  }

  sendMessage(message, channel) {
    message = new Paho.MQTT.Message(message);
    message.destinationName = channel;

    if (this.state.isConnected) {
      this.state.client.send(message);
      return console.log("Message: "+message+". Sent in channel: "+channel)
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
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
      this.setState({error: 'Lost Connection', isConnected: false});
    }
  }
}
