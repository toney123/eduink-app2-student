import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Picker} from 'react-native';
import PullDownSelect from '../../component/pull-down-select';
import LeftScrollSelect from './left-scroll-select';
import {host,schoolId,sessionToken} from '../../util/constant';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});



export default class Index extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectYearId:0,
      years:[],
      directories:[],
    }
  }

  componentWillMount(){
    fetch(host+'/sis/years', {
      method: "GET",
      headers: {
        'X-App-Id': schoolId,
        'X-Session-Token': sessionToken
      },
      // body: JSON.stringify({
      //   firstParam: "yourValue",
      //   secondParam: "yourOtherValue"
      // })
    }).then(response => {
      let data = JSON.parse(response._bodyInit);
      if(response.status == 200){
        let currentYearId;
        let years=[];
        for(i in data){
          years.push(
            <Picker.Item key={i} label={data[i].name} value={data[i]._id} />
          );
          // 找出后端记录的当前年份
          if(data[i].isCurrent == true){
            currentYearId = data[i]._id;
          }
        }

        // 更新年份选择
        this._changeYearSelect(currentYearId);

        this.setState({
          selectYearId:currentYearId,
          years:years
        });

      
      }else{
        alert(data.message);
      }
    }).catch(error => {
      console.error(error);
    });
  }

  
  componentWillUpdate(){
    
  }

  // 更改年份时触发的事件
  _changeYearSelect(selectYearId){
    // 刷新年份选择
    this.setState({
      selectYearId:selectYearId,
    });

    fetch(host+'/sis/directories', {
      method: "GET",
      headers: {
        'X-App-Id': schoolId,
        'X-Session-Token': sessionToken
      },
      // body: JSON.stringify({
      //   firstParam: "yourValue",
      //   secondParam: "yourOtherValue"
      // })
    }).then(response => {
      let data = JSON.parse(response._bodyInit);
      let directories=[];
      if(response.status == 200){
        for(i in data){
          // 筛选年份
          if(data[i].year == selectYearId){
            directories.push(data[i]);
          }
        }      
        // 刷新获取的学校目录数据
        this.setState({
          directories:directories,
        });
      }else{
        alert(data.message);
      }
    }).catch(error => {
      console.error(error);
    });

  }


  render() {

    return (
      <View style={styles.container}>
        <PullDownSelect
          defaultBody = {(
            <Text>body</Text>
          )}
          items = {[
            {
              menu:'Group',
              menuBody:(
                <View style={{flex:1}}>
                  <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1}}></View>
                    <View style={{flex:6,flexDirection:'row'}}>
                      <View style={{flex:1}}>
                        <Text>School Year</Text>
                      </View>
                      <View style={{flex:4}}>
                        <Picker
                          style={{height:18}}
                          selectedValue = {this.state.selectYearId}
                          onValueChange = {(itemValue, itemIndex)=>this._changeYearSelect(itemValue)}
                        >
                          {this.state.years.map((currentValue,index,arr)=>currentValue)}
                        </Picker>
                      </View>
                    </View>
                    <View style={{flex:1}}></View>
                  </View>
                  <View style={{flex:12}}>
                    <LeftScrollSelect 
                      items = {this.state.directories}
                    />
                  </View>
                </View>
              )
            },
            {menu:'Tag',menuBody:(<Text>tag</Text>)},
        ]}
        />
      </View>
    );

  }
}

