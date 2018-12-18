/**
 * 目录
 */
import React, {Component} from 'react';
import {StyleSheet,Text,View,ScrollView,TouchableOpacity,Image} from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex:1
    }
});

export default class Directory extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Directory</Text>
            </View>
        );
    }
}