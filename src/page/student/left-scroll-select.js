/**
 * 左侧滚动选项组件
 * 
 * 需要传入以下属性：
 * 
 * items(必须)
 * 类型：array
 * 格式：
 * 说明：遍历左侧滚动选项名字
 */
'use strict';
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,FlatList,TouchableOpacity,Modal} from 'react-native';
import PropTypes from 'prop-types';
import {host,schoolId,sessionToken} from '../../util/constant';

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row'
    },
    containerLeft:{
        flex:1,
        backgroundColor:'#F7F9FC'
    },
    containerRight:{
        flex:1.6,
    },
    leftScrollTouchItem:{
       height:45,
    },
    leftScrollTouchItemText:{
        top:10,
        textAlign:'center'
    },
    groupTouch:{
        marginLeft:30,
        marginTop:20,
        marginBottom:10,
    }
});

// 存储首次获取的目录id，用于判断与父组件年份选择的差异
let defaultDirectoryId;
export default class LeftScrollSelect extends Component{

    // 属性验证器
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object).isRequired
    }

    constructor(props){
        super(props);
        this.state = {
            selectItemId:0,
            groups:[]
        }
        this._getGroups = this._getGroups.bind(this);
    }

    // 根据目录id获取所有group
    async _getGroups(directoryId){

        try {
            let response = await fetch(
                host+'/sis/directories/'+directoryId+'/get-children-groups', {
                method: "GET",
                headers: {
                  'X-App-Id': schoolId,
                  'X-Session-Token': sessionToken
                },
              });

            let data = JSON.parse(response._bodyInit);

            if(response.status == 200){
                this.setState({
                    groups:data
                });
            }else{
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
        }

    }

     // 点击目录，获取对应的所有group
    _onClickItem(id){
        this._getGroups(id);

        this.setState({
            selectItemId:id
        });
    }

    // 点击group之后，保存筛选的group id
    _clickGroup(id){ 
        this.props.updateGroupFilter(id);
        // 隐藏筛选条件的面板
        this.props.updatePullDownSelectStatus(false);
    }

    componentWillMount(){
        let items = this.props.items;
        if(items.length > 0){
            // 用最新的第一个目录id去获取所有group
            this._getGroups(items[0]._id);
            // 存储首次获取的目录id，用于判断与父组件年份选择的差异
            defaultDirectoryId = items[0]._id;
        }
    }

    componentWillReceiveProps(nextProps){
        let items = nextProps.items;
        if(items.length > 0){
            // 更改年份
            if(defaultDirectoryId != items[0]._id){
                // 用最新的第一个目录id去获取所有group
                this._getGroups(items[0]._id);
                // 用最新的目录id覆盖旧值，以便下次再判断
                defaultDirectoryId = items[0]._id;
            }
            
        }
        
    }

   
    componentWillUpdate(){

    }


    render(){

        let group = this.state.groups;
        if(group.length > 0){
            group.unshift({_id:-1,name:'All Groups'});
        }
        

        return(
            <View style={styles.container}>
                <View style={styles.containerLeft}>
                    <FlatList
                        data={this.props.items}
                        keyExtractor={(item,index)=>item.name}
                        renderItem={({item,index}) =>{
                            return(
                                <TouchableOpacity key={index} onPress={()=>this._onClickItem(item._id)} style={styles.leftScrollTouchItem}>
                                    <Text style={styles.leftScrollTouchItemText}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
                <View style={styles.containerRight}>
                    <FlatList
                        data={group}
                        keyExtractor={(item,index)=>item.name}
                        renderItem={({item,index}) =>{
                            
                            return(
                                <TouchableOpacity key={index} style={styles.groupTouch} onPress={()=>this._clickGroup(item._id)}>
                                    <Text key={index}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </View>
        );
    }
}
