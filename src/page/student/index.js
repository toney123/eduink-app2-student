/**
 * 学生主页
 */
"use strict";
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Picker,FlatList,Image,TouchableOpacity,Dimensions,ScrollView } from 'react-native';
import LeftScrollSelect from './left-scroll-select';
import {host,schoolId,sessionToken} from '../../util/constant';
import Navigation from '../common/navigation';
import I18n from '../../language/i18n';

const iconUri = '../../image/icon';
const imageUri = '../../image/';

// 获取真机的屏幕宽度
const screenWidth = Dimensions.get('window').width;


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
  navigationLeftIconTouch:{
    top:10,
    alignSelf:'center',
  },
  navigationLeftIcon:{
    top:2,
    width:15,
    height:15,
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
  mainBody:{
    flex:1,
    flexDirection:'row',
    marginBottom:10,
  },
  mainBodyLeft:{
    flex:2
  },
  mainBodyLeftIamge:{
    width:40,
    height:40,
    borderRadius:40,
    marginLeft:20,
    marginTop:10
  },
  mainBodyCenter:{
    flex:6,
  },
  mainBodyCenterTop:{
    flex:1
  },
  mainBodyCenterBottom:{
    flex:1
  },
  mainBodyCenterClassName:{
    color:'#7E8494'
  },
  mainBodyCenterUserName:{
    marginTop:10,
  },
  mainBodyRight:{
    flex:1
  },
  mainBodyRightIcon:{
    marginTop:20,
    width:10,
    height:10
  },


  pullDownSelectMenu:{
      flex:1,
  },
  pullDownSelectMenuTouch:{
      width:screenWidth/2,
      flexDirection:'row'
  },
  pullDownSelectMenuTouchLeft:{
    flex:1.8
  },
  pullDownSelectMenuTouchRight:{
    flex:1
  },
  pullDownSelectMenuTouchText:{
      textAlign:'right',
      top:5,
      color:'#7E8494',
      fontWeight:'bold',
      fontSize:12,
      marginRight:15,
  },
  pullDownSelectMenuTouchIcon:{
    top:12,
  },
  pullDownSelectBody:{
      flex:14,
      borderTopWidth:0.8,
      borderColor:'#D3D7E0'
  },

  tagContainer:{
    flex:1
  },
  tagSelect:{
    flex:6
  },
  tagSubmit:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#F7F9FC'
  },
  tagTouch:{
    borderBottomWidth:1,
    borderColor:'#F1F1F1',
    height:50,
  },

  tagSubmitLeft:{
    flex:1
  },
  tagSubmitCenter:{
    flex:3
  },
  tagSubmitRight:{
    flex:1
  },
  tabSubmitTouch:{
    top:10,
    height:30,
    backgroundColor:'#85A5FF',
    borderRadius:20,
  },
  tabSubmitText:{
    top:5,
    color:'#FFF',
    fontWeight:'bold',
    textAlign:'center'
  },
  tagTouchList:{
    flex:1,
    flexDirection:'row'
  },
  tagTouchListLeft:{
    flex:8,
  },
  tagTouchListRight:{
    flex:1
  },
  tagTouchText:{
    left:30,
    top:12,
  },
  tagTouchIcon:{
    top:12,
    width:20,
    height:20,
  },
  studentListTip:{
    marginTop:20,
    textAlign:'center',
    color:'#606266'
  },
});


// 存储首次获取的所有根目录，以便更改年份时，直接筛选而不需要重新发请求
let directoryData = [];
// 存储首次获取的年份，用于判断与父组件年份选择的差异
let yearId;
// 选择的标签id
let selectTagIds = [];
// 选择的组id
let selectGroupId;
// 选择的组名
let selectGroupName;
// 当前选择的目录下的所有组
let currentDirectoryGroups=[];

export default class Index extends Component {

  constructor(props){
    super(props);
    this.state = {
      // 暂存目录数据
      directories:[],
      // 存储选择的group id
      selectGroupId:selectGroupId,
      // 存储获取的学生数据
      students:[],
      // 存储获得的所有tag来用于显示
      tags:[],
      // 记录筛选面板是否要显示
      pullDownSelectBodyStatus:{
        key:0,
        open:false
      },
      // 记录选择的tag
      selectTagIds:selectTagIds,
      // 选择的组名
      selectGroupName:selectGroupName,
    }
    // 存储首次获取的年份
    yearId = global.yearId;
    this.updateGroupFilter = this.updateGroupFilter.bind(this);
    this.updatePullDownSelectStatus = this.updatePullDownSelectStatus.bind(this);
    this.storeCurrentDirectoryGroups = this.storeCurrentDirectoryGroups.bind(this);
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
  async _getStudents(){
    let url='?pageSize=50';
    let params={};

    // 选择当前目录下的所有组
    if(selectGroupId == -1){
      let groupIds=[];
      currentDirectoryGroups.map((value,index,arr)=>{
        // 剔除
        if(value._id != -1){
          groupIds.push(value._id);
        }
      });
       params["_class"]={
        "$in":groupIds
      };
    }
    
    // 存在选择的group id
    if(selectGroupId!=undefined && selectGroupId!= -1){
      params["_class"]={
        "$in":[selectGroupId]
      };
    }
    
    // 存在选择的tag id
    if(selectTagIds.length){
      params["tags"]={
        "$all":selectTagIds
      }
    }

    // 如果有查询参数，则拼接
    if(Object.keys(params).length){
      url = url +'&q='+ JSON.stringify(params);
    }

  
    try {
      let response = await fetch(host+'/sis/students'+url, {
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

  // 获取所有tag
  async _getTags(){
    try {
      let response = await fetch(host+'/sis/user-tags', {
        method: "GET",
        headers: {
          'X-App-Id': schoolId,
          'X-Session-Token': sessionToken
        },
      });

      let data = JSON.parse(response._bodyInit);

      if(response.status == 200){
        this.setState({
          tags:data
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 保存筛选group的数据
  updateGroupFilter(id,name){
    // 用于在选项栏中显示选中的组名
    selectGroupName = name;
    // 用于筛选学生
    selectGroupId = id;
    this._getStudents();
  }

  // 存储当前选择目录下的所有组
  storeCurrentDirectoryGroups(data){
    currentDirectoryGroups = data;
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

  // 选择tag，用于筛选学生列表
  _clickTag(tagId){
    const arrayIndex = selectTagIds.indexOf(tagId);
    // 如果数组不存在指定值，则存入
    if(arrayIndex == -1){
      selectTagIds.push(tagId);
    }else{
      // 删除指定元素
      selectTagIds.splice(arrayIndex,1);
    }
    
    this.setState({
      selectTagIds:selectTagIds
    });
    this._getStudents();
  }


  // 确认筛选的tag，此处只是隐藏筛选tag面板
  _submitTag(){
    this.updatePullDownSelectStatus(false);
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
    // 获取学生列表
    this._getStudents();
    // 获取所有目录
    this._getAllDirectories();
    // 获取所有tag
    this._getTags();
  }

  
  componentWillUpdate(){
    // 父组件更改年份时，触发更新
    if(yearId != global.yearId){
      // 更改年份后，恢复选项栏中默认的组名
      selectGroupName = undefined;
      // 刷新目录
      this._getCurrentDirectories();
      // 刷新学生列表
      this._getStudents();
      // 存储最新的年份
      yearId = global.yearId;
    }
  }

  componentWillUnmount(){
    
  }



  render() {

    let pullDownSelectBody;
    // 默认组名
    let menuGroupName = I18n.t('student.group');
    // 如有选择的组名，则显示
    if(selectGroupName != undefined){
      menuGroupName = selectGroupName;
    }

    // 选项栏打开
    if(this.state.pullDownSelectBodyStatus.open){
      // 第一个选项面板
      if(this.state.pullDownSelectBodyStatus.key == 0 ){
        pullDownSelectBody=(
          <View style={styles.groupContainer}>
            <LeftScrollSelect
                updatePullDownSelectStatus = {this.updatePullDownSelectStatus}
                updateGroupFilter = {this.updateGroupFilter} 
                items = {this.state.directories}
                storeCurrentDirectoryGroups = {this.storeCurrentDirectoryGroups}
            />
          </View>
        );
      }else{
        pullDownSelectBody=(
          <View style={styles.tagContainer}>
            <View style={styles.tagSelect}>
              <FlatList
                data={this.state.tags}
                // 触发更新
                extraData={this.state}
                keyExtractor={(item,index)=>item.name}
                renderItem={({item}) =>{
                  let tagText;
                  // 存在选中值
                  if(this.state.selectTagIds.indexOf(item._id) >= 0){
                    tagText=(
                      <View style={styles.tagTouchList}>
                        <View style={styles.tagTouchListLeft}>
                          <Text style={styles.tagTouchText}>{item.name}</Text>
                        </View>
                        <View style={styles.tagTouchListRight}>
                          <Image style={styles.tagTouchIcon} source={require(iconUri+'/check-selected.png')}></Image>
                        </View>
                      </View>
                    );
                  }else{
                    tagText=(
                      <View style={styles.tagTouchList}>
                        <View style={styles.tagTouchListLeft}>
                          <Text style={styles.tagTouchText}>{item.name}</Text>
                        </View>
                        <View style={styles.tagTouchListRight}>
                          <Image style={styles.tagTouchIcon} source={require(iconUri+'/check.png')}></Image>
                        </View>
                      </View>
                    );
                  }
                  return(
                    <TouchableOpacity style={styles.tagTouch} onPress={()=>this._clickTag(item._id)}>
                      {tagText}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
            <View style={styles.tagSubmit}>
                <View style={styles.tagSubmitLeft}></View>
                <View style={styles.tagSubmitCenter}>
                  <TouchableOpacity style={styles.tabSubmitTouch} onPress={()=>this._submitTag()}>
                    <Text style={styles.tabSubmitText}>{I18n.t('student.submit')}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.tagSubmitRight}></View>
                
            </View>
          </View>
        );
      }
    }else{
      // 没有打开筛选条件的面板时显示的页面

      let studentListBody;
      // 存在数据
      if(this.state.students.length){
        studentListBody = (
          <FlatList
            data={this.state.students}
            onRefresh={()=>{}}
            refreshing={false}
            keyExtractor={(item,index)=>item._id.toString()}
            renderItem={({item,index}) => {
              return(
                <TouchableOpacity style={styles.mainBody}>
                  <View style={styles.mainBodyLeft}>
                    <Image style={styles.mainBodyLeftIamge} source={require(imageUri+'/avatar-default.jpg')}></Image>
                  </View>
                  <View style={styles.mainBodyCenter}>
                    <View style={styles.mainBodyCenterTop}>
                      <Text style={styles.mainBodyCenterUserName}>{item.firstName +' '+item.lastName}</Text>
                    </View>
                    <View style={styles.mainBodyCenterBottom}>
                      <Text style={styles.mainBodyCenterClassName}>class</Text>
                    </View>
                    
                  </View>
                  <View style={styles.mainBodyRight}>
                    <Image style={styles.mainBodyRightIcon} source={require(iconUri+'/next.png')}></Image>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        );
      }else{
        studentListBody=(
          <Text style={styles.studentListTip}>{I18n.t('student.noData')}</Text>
        );
      }
      
      pullDownSelectBody=(
        <View style={styles.mainContainer}>
          {studentListBody}
        </View>
      );
    }


    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <Navigation 
            leftBody={(
              <View style={styles.navigationLeftBody}>
                <TouchableOpacity style={styles.navigationLeftIconTouch} onPress={()=>this.props.updateSideMenuStatus()}>
                  <Image style={styles.navigationLeftIcon} source={require(iconUri+'/menu.png')}></Image>
                </TouchableOpacity>
              </View>
            )}
            centerBody={(       
              <View style={styles.navigationCenterBody}>
                <Text style={styles.navigationCenterBodyText}>{I18n.t('student.students')}</Text>
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
                // 下拉框里的选项
                data={[
                  {menu:menuGroupName},
                  {menu:I18n.t('student.tags')},
                ]}
                horizontal={true}
                keyExtractor={(item,index)=>item.menu}
                renderItem={({item,index}) => {
                  // 默认箭头向下，表示还没打开筛选面板
                  let icon = require(iconUri+'/down.png');
                  if(this.state.pullDownSelectBodyStatus.key == index){
                    if(this.state.pullDownSelectBodyStatus.open){
                      icon = require(iconUri+'/up.png');
                    }
                  }

                  return(
                    <TouchableOpacity key={index} style={styles.pullDownSelectMenuTouch} onPress={()=>this._clickPullDownSelectMenu(index)} >
                      <View style={styles.pullDownSelectMenuTouchLeft}>
                        <Text style={styles.pullDownSelectMenuTouchText}>{item.menu}</Text>
                      </View>
                      <View style={styles.pullDownSelectMenuTouchRight}>
                        <Image style={styles.pullDownSelectMenuTouchIcon} source={icon}></Image>
                      </View>
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

