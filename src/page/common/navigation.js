/**
 * 顶部导航
 * 
 * 需要传入以下属性：
 * 
 * leftBody(可选)
 * 类型：react 元素
 * 说明：自定义左边内容
 * 
 * centerBody(可选)
 * 类型：react 元素
 * 说明：自定义中间内容
 * 
 * rightBody(可选)
 * 类型：react 元素
 * 说明：自定义右边内容
 * 
 */
"use strict";
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Picker,FlatList,StatusBar} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row'
    },
    containerLeft:{
        flex:1
    },
    containerCenter:{
        flex:3,
    },
    containerRight:{
        flex:1
    }
});

export default class Navigation extends Component{

    // 验证属性
    static propTypes = {
        leftBody:PropTypes.element,
        centerBody:PropTypes.element,
        rightBody:PropTypes.element,
    }


    render(){
        return(
            <View style={styles.container}>
                <StatusBar
                    backgroundColor='#FFF'
                    barStyle='dark-content'
                    animated = {true}
                />
                <View style={styles.containerLeft}>
                    {this.props.leftBody}
                </View>
                <View style={styles.containerCenter}>
                    {this.props.centerBody}
                </View>
                <View style={styles.containerRight}>
                    {this.props.rightBody}
                </View>
            </View>
        );
    }
}