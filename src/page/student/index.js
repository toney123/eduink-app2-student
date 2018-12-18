/**
 * 学生主页
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Picker,FlatList} from 'react-native';
import PullDownSelect from '../../component/pull-down-select';
import LeftScrollSelect from './left-scroll-select';
import {host,schoolId,sessionToken} from '../../util/constant';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupContainer:{
    flex:1,
  },
});

// 存储首次获取的所有根目录，以便更改年份时，直接筛选而不需要重新发请求
let directoryData = [];
// 存储首次获取的年份，用于判断与父组件年份选择的差异
let yearId;

export default class Index extends Component {

  constructor(props){
    super(props);
    this.state = {
      directories:[],
    }
    // 存储首次获取的年份
    yearId = global.yearId;
  }

  componentWillMount(){
    fetch(host+'/sis/directories', {
      method: "GET",
      headers: {
        'X-App-Id': schoolId,
        'X-Session-Token': sessionToken
      },
    }).then(response => {
      let data = JSON.parse(response._bodyInit);

      if(response.status == 200){
        // 存储首次获取的所有根目录
        directoryData = data;
        // 获取当前年份下的所有根目录
        this._getDirectory();
      }else{
        alert(data.message);
      }
    }).catch(error => {
      console.error(error);
    });
  }

  
  componentWillUpdate(){
    // 父组件更改年份时，触发更新
    if(yearId != global.yearId){
      this._getDirectory();
      // 存储最新的年份
      yearId = global.yearId;
    }
  }


  // 获取目录
  _getDirectory(){
    let directories=[];
      for(directory of directoryData){
        // 筛选当前年份下的所有根目录
        if(directory.year == global.yearId){       
          directories.push(directory);
        }
    }
    this.setState({
      directories:directories,
    });
  }



  render() {

    return (
      <View style={styles.container}>
        <PullDownSelect
          defaultBody = {(
            <View style={{flex:1}}>
              <FlatList
                data={[{key: 'a'}, {key: 'b'}]}
                renderItem={({item}) => <Text>{item.key}</Text>}
              />
            </View>
          )}
          items = {[
            {
              menu:'GROUPS',
              menuBody:(
                <View style={styles.groupContainer}>
                  <LeftScrollSelect 
                      items = {this.state.directories}
                  />
                </View>
              )
            },
            {
              menu:'TAGS',
              menuBody:(
                <Text>tag</Text>
              )
            },
          ]}
        />
      </View>
    );

  }
}

