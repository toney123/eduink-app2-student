/**
 * 学生主页
 */
"use strict";
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Picker,FlatList,Image,TouchableOpacity,Dimensions,ScrollView } from 'react-native';
import LeftScrollSelect from './left-scroll-select';
import {host,schoolId,sessionToken} from '../../util/constant';
import Navigation from '../common/navigation';

const iconUri = '../../image/icon';
const imageUri = '../../image/';

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
  }
});


// 存储首次获取的所有根目录，以便更改年份时，直接筛选而不需要重新发请求
let directoryData = [];
// 存储首次获取的年份，用于判断与父组件年份选择的差异
let yearId;
// 选择的tag id
let tagSelectedIds = [];
export default class Index extends Component {

  constructor(props){
    super(props);
    this.state = {
      directories:[],
      selectgroupId:null,
      students:[],
      tags:[],
      // 记录筛选面板是否要显示
      pullDownSelectBodyStatus:{
        key:0,
        open:false
      },
      // 记录选择的tag
      tagSelectedIds:tagSelectedIds
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
  async _getStudents(){
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

  _clickTag(tagId){
    const arrayIndex = tagSelectedIds.indexOf(tagId);
    // 如果数组不存在指定值，则存入
    if(arrayIndex == -1){
      tagSelectedIds.push(tagId);
    }else{
      // 删除指定元素
      tagSelectedIds.splice(arrayIndex,1);
    }
    this.setState({
      tagSelectedIds:tagSelectedIds
    });
  }


  // 确认筛选的tag
  _submitTag(){
    this.updatePullDownSelectStatus(false);
    // console.warn(tagSelectedIds);
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
    this._getStudents();
    this._getAllDirectories();
    this._getTags();
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
                  if(this.state.tagSelectedIds.indexOf(item._id) >= 0){
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
                    <Text style={styles.tabSubmitText}>Submit</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.tagSubmitRight}></View>
                
            </View>
          </View>
        );
      }
    }else{
      // 没有打开筛选条件的面板时显示的页面
      pullDownSelectBody=(
        <View style={styles.mainContainer}>
          <FlatList
            data={this.state.students}
            onRefresh={()=>{}}
            refreshing={false}
            keyExtractor={(item,index)=>item.firstName + item.lastName}
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

