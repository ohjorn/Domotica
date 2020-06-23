import React, {Component} from 'react';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-community/async-storage';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import {ListItem} from 'react-native-elements';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  enableCache: true,
  sync: {},
});

export default class AllPeople extends Component {
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
      message: [''],
      data: [],
      isLoading: true,
      client,
      messageToSend: '',
      isConnected: false,
      isMounted: false,
    };
  }
  
  componentDidMount() {
    this.setState({isMounted: true})
  }

  onConnect = () => {
    console.log('Connected');
    const {client} = this.state;
    client.subscribe('/app/to/allpeople');
    this.setState({
      isConnected: true,
      error: '',
      isLoading: true,
      messageToSend: 'allpeople',
    });
    this.sendMessage();
  };

  onMessageArrived(entry) {
    console.log("Data: ")
    if(this.state.isMounted){
      this.setState({data: JSON.parse(entry.payloadString), isLoading: false});
    }
  }

  sendMessage = () => {
    console.log('message send.');
    var message = new Paho.MQTT.Message(this.state.messageToSend);
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
      <View style={styles.container}>
        {this.state.isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            keyExtractor={(item, index) => item.client_id.toString()}
            data={this.state.data}
            renderItem={Item}
          />
        )}
      </View>
    );
  }
}

const Item = ({item}) => {
  return (
    <TouchableOpacity>
      <ListItem
        title={item.name} //{item.results.name.first}
        titleStyle={{fontWeight: 'bold'}}
        leftIcon={<MCIcons name="account" size={36} color="dodgerblue" />}
        subtitle={"ID: "+item.client_id}
        bottomDivider
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
  },
});
