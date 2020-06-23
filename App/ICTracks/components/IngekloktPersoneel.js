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

export default class IngekloktPersoneel extends Component {
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
      refreshing: false,
    };
  }

  componentDidMount() {
    this.setState({isMounted: true})
  }

  onConnect = () => {
    console.log('Connected');
    const {client} = this.state;
    client.subscribe('/app/to/ingeklokt');
    this.setState({
      isConnected: true,
      error: '',
      isLoading: true,
    });
    this.sendMessage('ingeklokt');
  };

  onMessageArrived(entry) {
    console.log('Data: ');
    console.log(entry.payloadString);
    if(this.state.isMounted){
      this.setState({data: JSON.parse(entry.payloadString), isLoading: false});
    }
    this.setState({refreshing: false})
  }

  sendMessage = (msg) => {
    console.log('message send.');
    var message = new Paho.MQTT.Message(msg);
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

  onRefresh() {
    this.setState({refreshing: true,},() => {this.sendMessage('ingeklokt');});
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
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
          />
        )}
      </View>
    );
  }
}

var timeStruck = (epoch) => {
  var current = Date.now();
  var timeStruck = current - (epoch*1000);
  var time = new Date(timeStruck-3600000).toLocaleTimeString();
  return time;
}

const Item = ({item}) => {
  return (
    <TouchableOpacity>
      <ListItem
        key={item.client_id}
        title={item.name} //{item.results.name.first}
        titleStyle={{fontWeight: 'bold'}}
        leftIcon={<MCIcons name="account" size={36} color="dodgerblue" />}
        subtitle={new Date(item.clocked_in*1000).toLocaleDateString()+" "+new Date(item.clocked_in*1000).toLocaleTimeString()}
        rightSubtitle={timeStruck(item.clocked_in)}
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
