/**
 * 下拉框组件
 * 
 * 需要传入以下属性：
 * 
 * pullDownSelectBody  
 * 类型：组件
 * 说明：默认显示主体内容
 * 
 * pullDownSelectData
 * 类型：数组  
 * 格式：[{menu:'菜单名',menuBody:'组件'}]
 * 说明：遍历顶部菜单以及顶部菜单对应的主体内容
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,FlatList,TouchableOpacity,Modal} from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    containerTop:{
        flex:1,
        flexDirection:'row'
    },
    menuTouch:{
        flex:1,
    },
    menuTouchText:{
        textAlign:'center',
        top:5,
    },
    containerBottom:{
        flex:18,
    },
});


export default class PullDownSelect extends Component{

    constructor(props){
        super(props);
        this.state = {
            menuBodyStatus:{
                key:0,
                open:false
            }
        }
    }

    // 菜单点击事件
    _onClickMenu(key){
        // 开关状态
        let open;
        // 如果点击的菜单与state的不一致，则默认打开，否则根据自己的state取反
        if(this.state.menuBodyStatus.key != key){
            open = true;
        }else{
            open = !this.state.menuBodyStatus.open;
        }
        this.setState({
            menuBodyStatus:{
                key:key,
                open:open
            }
        });
    }


    render(){

        // 获取父组件传入的数据
        const data = this.props.pullDownSelectData;
        // 获取父组件传入的内容主体
        const body = this.props.pullDownSelectBody;

        // 菜单内容部分
        let menuBody;
        // 菜单
        let menu = [];

        for(i in data){
            // 存入父组件的菜单部分的数据
            menu.push(
                <Text style={styles.menuTouchText}>{data[i].menu}</Text>
            );
            // 找出当前与state相同的数据
            if(this.state.menuBodyStatus.key == i){
                // 再看其状态是否显示内容部分
                if(this.state.menuBodyStatus.open){
                    // 显示对应菜单的内容
                    menuBody = data[i].menuBody;
                }else{
                    // 无点击，则显示默认的内容
                    menuBody = body;
                }
            }
        }

        return(
            <View style={styles.container}>
                <View style={styles.containerTop}>
                    {menu.map((currentValue,index,arr)=>{
                        return(
                            <TouchableOpacity key={index} style={styles.menuTouch} onPress={()=>this._onClickMenu(index)} >
                                {currentValue}
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={styles.containerBottom}>
                    {menuBody}
                </View>
            </View>
        );
    }
}