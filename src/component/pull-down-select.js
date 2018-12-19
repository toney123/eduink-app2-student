/**
 * 下拉框组件
 * 
 * 需要传入以下属性：
 * 
 * defaultBody(必须)  
 * 类型：react element
 * 说明：默认显示主体内容
 * 
 * items(必须) 
 * 类型：array  
 * 格式：[{menu:'菜单名',menuBody:react元素}]
 * 说明：遍历顶部菜单以及顶部菜单对应的主体内容
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,FlatList,TouchableOpacity,Modal} from 'react-native';
import PropTypes from 'prop-types';

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
        color:'#7E8494',
        fontWeight:'bold',
        fontSize:12
    },
    containerBottom:{
        flex:14,
        borderTopWidth:0.8,
        borderColor:'#D3D7E0'
    },
});


export default class PullDownSelect extends Component{

    // 属性验证器
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object).isRequired,
        defaultBody:PropTypes.element.isRequired
    }

    constructor(props){
        super(props);
        this.state = {
            menuBodyStatus:{
                key:0,
                open:false
            }
        }
        this.updateMenuStatus = this.updateMenuStatus.bind(this);
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

    // 控制是否显示
    updateMenuStatus(bool){
        this.setState({
            menuBodyStatus:{
                key:this.state.menuBodyStatus.key,
                open:bool
            }
        });
    }


    render(){

        // 获取父组件传入的数据
        const data = this.props.items;
        // 获取父组件传入的内容主体
        const body = this.props.defaultBody;

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
