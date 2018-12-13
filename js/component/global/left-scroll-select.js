/**
 * 左侧滚动选项组件
 * 
 * 需要传入以下属性：
 * 
 * items(必须)
 * 类型：array
 * 格式：[name:选项名,itemBody:react元素]
 * 说明：遍历左侧滚动选项名字
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,FlatList,TouchableOpacity,Modal} from 'react-native';
import PropTypes from 'prop-types';

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
            selectItemKey:0,
        }
    }

    _onClickItem(key){
        this.setState({
            selectItemKey:key
        });
    }

    render(){

        // 获取父组件传入的左侧选项名
        const items = this.props.items;

        // 选项对应的内容
        let itemBody;
        for(i in items){
            // 取出对应item的内容
            if(this.state.selectItemKey == i){
                itemBody = items[i].itemBody;
            }
        }


        return(
            <View style={styles.container}>
                <View style={styles.containerLeft}>
                    <FlatList
                        data={items}
                        keyExtractor={(item,index)=>item.name}
                        renderItem={({item,index}) =>{
                            return(
                                <TouchableOpacity key={index} onPress={()=>this._onClickItem(index)} style={styles.leftScrollTouchItem}>
                                    <Text style={styles.leftScrollTouchItemText}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
                <View style={styles.containerRight}>
                    {itemBody}
                </View>
            </View>
        );
    }
}
