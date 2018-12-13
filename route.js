import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import PullDownSelect from './src/component/pull-down-select';
import LeftScrollSelect from './src/component/left-scroll-select';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const leftScrollSelectItems = [
  {name:'item1',itemBody:(<Text>item1</Text>)},
  {name:'item2',itemBody:(<Text>item2</Text>)},
  {name:'item3',itemBody:(<Text>item3</Text>)},
  {name:'item4',itemBody:(<Text>item4</Text>)},
];

const pullDownSelectData = [
    {
      menu:'menu1',
      menuBody:(
        <LeftScrollSelect 
          items = {leftScrollSelectItems}
        />
      )
    },
    {menu:'menu2',menuBody:(<Text>menu2</Text>)},
    {menu:'menu3',menuBody:(<Text>menu3</Text>)},
    {menu:'menu4',menuBody:(<Text>menu4</Text>)},
];

const pullDownSelectBody = (
    <Text>body</Text>
  );


export default class Route extends Component {
  render() {

    return (
      <View style={styles.container}>
        <PullDownSelect
          defaultBody = {pullDownSelectBody}
          items = {pullDownSelectData}
        />
      </View>
    );

  }
}

