import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, ActivityIndicator, TouchableHighlight, TouchableOpacity} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Item = ({item}) => {
  return (
    <TouchableOpacity>
      <ListItem
        title={item.name.first}
        titleStyle={{fontWeight: 'bold'}}
        leftIcon={<MCIcons name="account" size={36} color="dodgerblue" />}
        subtitle={item.name.last}
        rightTitle={item.registered.date}
        rightTitleStyle={{fontSize: 14}}
        chevron
        bottomDivider
      />
    </TouchableOpacity>
  );
};

const keyExtractor = (item, index) => index.toString();

export default PersoneelTotaalList = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://randomuser.me/api?results=200')
      .then((response) => response.json())
      .then((json) => setData(json.results))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList keyExtractor={keyExtractor} data={data} renderItem={Item} />
      )}
    </View>
  );
};
