/**
 * 启动页
 */
import React, {Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex:1
    }
});


export default class Index extends Component{

    constructor(){
        super();
        
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>123</Text>
            </View>
        );
    }
}