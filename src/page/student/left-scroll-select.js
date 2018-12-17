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
        backgroundColor:'#F5F5F5'
    },
    containerRight:{
        flex:3,
    },
    leftScrollTouchItem:{
       height:45,
    },
    leftScrollTouchItemText:{
        top:10,
        textAlign:'center'
    }
});

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


    _getGroups(id){
        let directoryId = id;

        if(id == undefined){
            let items = this.props.items;
            if(items.length == 0){
                return false;
            }
            // 取第一个为默认值
            directoryId = items[0]._id;
        }


        fetch(host+'/sis/directories/'+directoryId+'/get-children-groups', {
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
              this.setState({
                  groups:data
              });
            }else{
              alert(data.message);
            }
          }).catch(error => {
            console.error(error);
          });


    }

    componentWillMount(){
        this._getGroups();
    }

    componentWillUpdate(){
        // console.warn(this.props.items);
        // this._getGroups();
      
    }

    _onClickItem(id){

        this._getGroups(id);

        this.setState({
            selectItemId:id
        });
    }

    render(){

        let groups = this.state.groups;
        let body=[];
        for(i in groups){
            body.push(
                <Text key={i}>{groups[i].name}</Text>
            );
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
                    {body.map((currentValue,index,arr)=>currentValue)}
                </View>
            </View>
        );
    }
}
