/**
 * 学生主页
 */
"use strict";
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Picker,FlatList,Image,TouchableOpacity,Dimensions} from 'react-native';
import LeftScrollSelect from './left-scroll-select';
import {host,schoolId,sessionToken} from '../../util/constant';
import Navigation from '../common/navigation';

const iconUri = '../../image/icon';

// 获取真机的屏幕宽度
const screenWidth = Dimensions.get('window').width;

// 下拉框里的选项
const pullDownSelectMenuData = [
  {menu:'GROUP'},
  {menu:'TAGS'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupContainer:{
    flex:1,
  },
  containerTop:{
    flex:1
  },
  containerBottom:{
    flex:14,
  },
  navigationCenterBody:{
    flex:1,
  },
  navigationCenterBodyText:{
    textAlign:'center',
    top:10,
    color:'#242833',
    fontWeight:'bold'
  },
  navigationLeftBody:{
    flex:1
  },
  navigationRightIconTouch:{
    top:10,
    alignSelf:'center',
  },
  navigationRightIcon:{
    width:18,
    height:18,
  },
  mainContainer:{
    flex:1
  },


  pullDownSelectMenu:{
      flex:1,
  },
  pullDownSelectMenuTouch:{
      width:screenWidth/pullDownSelectMenuData.length
  },
  pullDownSelectMenuTouchText:{
      textAlign:'center',
      top:5,
      color:'#7E8494',
      fontWeight:'bold',
      fontSize:12
  },
  pullDownSelectBody:{
      flex:14,
      borderTopWidth:0.8,
      borderColor:'#D3D7E0'
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
      selectgroupId:null,
      students:[],
      pullDownSelectBodyStatus:{
        key:0,
        open:false
      }
    }
    // 存储首次获取的年份
    yearId = global.yearId;
    this.updateGroupFilter = this.updateGroupFilter.bind(this);
    this.updatePullDownSelectStatus = this.updatePullDownSelectStatus.bind(this);
  }

  // 获取所有目录
  async _getAllDirectories(){
    try {
      let response = await fetch(host+'/sis/directories', {
        method: "GET",
        headers: {
          'X-App-Id': schoolId,
          'X-Session-Token': sessionToken
        },
      });

      let data = JSON.parse(response._bodyInit);

      if(response.status == 200){
        // 存储首次获取的所有根目录
        directoryData = data;
        // 获取当前年份下的所有根目录
        this._getCurrentDirectories();
      }else{
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 获取当前选择年份的所有目录
  _getCurrentDirectories(){
    let directories=[];
      for(let directory of directoryData){
        // 筛选当前年份下的所有根目录
        if(directory.year == global.yearId){       
          directories.push(directory);
        }
    }
    if(directories.length > 0){
      this.setState({
        directories:directories,
      });
    }
  }

  // 获取学生
  async _getStudent(){
    try {
      let response = await fetch(host+'/sis/students', {
        method: "GET",
        headers: {
          'X-App-Id': schoolId,
          'X-Session-Token': sessionToken
        },
      });

      let data = JSON.parse(response._bodyInit);

      if(response.status == 200){
        this.setState({
          students:data
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 保存筛选group的数据
  updateGroupFilter(selectgroupId){
    this.setState({
      selectgroupId:selectgroupId
    });
  }

   // 下拉菜单点击事件
   _clickPullDownSelectMenu(key){
    // 开关状态
    let open;
    // 如果点击的菜单与state的不一致，则默认打开，否则根据自己的state取反
    if(this.state.pullDownSelectBodyStatus.key != key){
        open = true;
    }else{
        open = !this.state.pullDownSelectBodyStatus.open;
    }
    this.setState({
      pullDownSelectBodyStatus:{
          key:key,
          open:open
      }
    }); 
  }

  // 控制是否显示条件筛选面板
  updatePullDownSelectStatus(bool){
    this.setState({
        pullDownSelectBodyStatus:{
            key:this.state.pullDownSelectBodyStatus.key,
            open:bool
        }
    });
  }

  componentWillMount(){
    this._getAllDirectories();
    this._getStudent();
  }

  
  componentWillUpdate(){
    // 父组件更改年份时，触发更新
    if(yearId != global.yearId){
      this._getCurrentDirectories();
      // 存储最新的年份
      yearId = global.yearId;
    }
  }


  render() {

    let pullDownSelectBody;

    if(this.state.pullDownSelectBodyStatus.open){
      if(this.state.pullDownSelectBodyStatus.key == 0 ){
        pullDownSelectBody=(
          <View style={styles.groupContainer}>
            <LeftScrollSelect
                updatePullDownSelectStatus = {this.updatePullDownSelectStatus}
                updateGroupFilter = {this.updateGroupFilter} 
                items = {this.state.directories}
            />
          </View>
        );
      }else{
        pullDownSelectBody=(
          <Text>tag</Text>
        );
      }
    }else{
      pullDownSelectBody=(
        <View style={styles.mainContainer}>
          <FlatList
            data={this.state.students}
            keyExtractor={(item,index)=>item.firstName + item.lastName}
            renderItem={({item}) => <Text>{item.firstName + item.lastName}</Text>}
          />
        </View>
      );
    }


    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <Navigation 
            leftBody={(
              <View style={styles.navigationLeftBody}>
                {/* <Image source={}></Image> */}
              </View>
            )}
            centerBody={(       
              <View style={styles.navigationCenterBody}>
                <Text style={styles.navigationCenterBodyText}>Students</Text>
              </View>       
            )}
            rightBody={
              <View style={styles.navigationRightBody}>
                <TouchableOpacity style={styles.navigationRightIconTouch}>
                  <Image style={styles.navigationRightIcon} source={require(iconUri+'/search.png')} />
                </TouchableOpacity>
              </View>
            }
          />
        </View>
        <View style={styles.containerBottom}>
            <View style={styles.pullDownSelectMenu}>
                <FlatList
                  data={pullDownSelectMenuData}
                  horizontal={true}
                  keyExtractor={(item,index)=>item.menu}
                  renderItem={({item,index}) => {
                    return(
                      <TouchableOpacity key={index} style={styles.pullDownSelectMenuTouch} onPress={()=>this._clickPullDownSelectMenu(index)} >
                        <Text style={styles.pullDownSelectMenuTouchText}>{item.menu}</Text>
                      </TouchableOpacity>
                    );
                  }}
                />
            </View>
            <View style={styles.pullDownSelectBody}>
                {pullDownSelectBody}
            </View>

        </View>
      </View>
    );

  }
}

