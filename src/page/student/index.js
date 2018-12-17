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
  groupContainerTop:{
    flex:1,
    flexDirection:'row',
  },
  groupContainerBottom:{
    flex:12,
    borderTopWidth:0.5,
    borderColor:'#D3D7E0'
  },
  groupYearLeft:{
    flex:1,
  },
  groupYearCenter:{
    flex:6,
    flexDirection:'row'
  },
  groupYearRight:{
    flex:1
  },
  groupYear:{
    flex:1,
  },
  groupYearText:{
    textAlign:'center',
    top:10,
  },
  groupYearSelect:{
    flex:1,
  },
  groupYearSelectPicker:{
    
  }
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
                  <View style={styles.groupContainerTop}>
                    <View style={styles.groupYearLeft}></View>
                    <View style={styles.groupYearCenter}>
                      <View style={styles.groupYear}>
                        <Text style={styles.groupYearText}>School Year</Text>
                      </View>
                      <View style={styles.groupYearSelect}>
                        <Picker
                            mode={'dropdown'}
                            style={styles.groupYearSelectPicker}
                            selectedValue = {this.state.selectYearId}
                            onValueChange = {(itemValue, itemIndex)=>this._changeYearSelect(itemValue)}
                          >
                            {this.state.years.map((currentValue,index,arr)=>currentValue)}
                        </Picker>
                      </View>
                        
                    </View>
                    <View style={styles.groupYearRight}></View>
                  </View>
                  <View style={styles.groupContainerBottom}>
                    <LeftScrollSelect 
                      items = {this.state.directories}
                    />
                  </View>
                </View>
              )
            },
            {menu:'TAGS',menuBody:(<Text>tag</Text>)},
        ]}
        />
      </View>
    );

  }
}

