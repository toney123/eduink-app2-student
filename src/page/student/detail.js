/**
 * 学生个人页
 */
"use strict";
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity,Image} from 'react-native';
import Navigation from '../common/navigation';
import {host,schoolId,sessionToken} from '../../util/constant';


const iconUri = '../../image/icon';
const imageUri = '../../image/';


const styles = StyleSheet.create({
    container:{
        flex:1
    },
    containerTop:{
        flex:1
    },
    containerCenter:{
        flex:7,
        borderBottomWidth:0.5,
        borderColor:'#D3D7E0',
    },
    containerBottom:{
        flex:6
    },
    navigationLeftBody:{
        flex:1
    },
    navigationLeftIconTouch:{
        top:10,
        alignSelf:'center',
    },
    navigationLeftBackIcon:{
        top:2,
        width:25,
        height:18
    },
    avatar:{
        flex:5,
        alignItems:'center',
    },
    avatarImage:{
        width:110,
        height:110,
        borderRadius:110
    },  
    name:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    nameText:{
        color:'#242833',
        fontWeight:'bold',
        fontSize:20
    },
    className:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    classNameText:{
        color:'#7E8494',
        fontWeight:'400',
        fontSize:18
    },
    tag:{
        flex:3,
        flexDirection:'row',
        flexWrap:'wrap',
        padding:15
    },
    tagBorder:{
        borderRadius:10,
        height:24,
        alignItems:'center',
        justifyContent:'center',
        paddingLeft:10,
        paddingRight:10,
        margin:5
    },
    tagText:{ 
        color:'#FFF',
    },
    list:{
        flex:0.3,
        flexDirection:'row',
        alignItems:'center',
    },
    listLeft:{
        flex:2,
        alignItems:'center'
    },
    listSignIcon:{
        width:30,
        height:25
    },
    listCenter:{
        flex:6,
    },
    listText:{
    
    },
    listRight:{
        flex:1
    },
    listNextIcon:{
        width:10,
        height:10
    },
    familyMember:{
        flex:1,
    },
    homework:{
        flex:1
    }
});


export default class Detail extends Component{

    constructor(){
        super();
    }

    componentWillMount(){

    }

    // 通过关键字转换对应的颜色样式
    _getTagColor(type){
        // 默认颜色
        let color = '#40A9FF';
        switch (type) {
            case 'success':
                color = '#13ce66';
                break;
            case 'primary':
                break;
            case 'info':
                break;
            case 'warning':
                color = '#FFB169';
                break;
            case 'danger':
                color= '#FF7875';
                break;
        }
        return color;
    }



    render(){

        let tagBody=[];

        let tags = this.props.navigation.getParam('tags');
        // 存在tag
        if(tags.length){
            for (const tag of tags) {
                tagBody.push(
                    <View key={tag._id} style={[styles.tagBorder,{backgroundColor:this._getTagColor(tag.type)}]}>
                        <Text style={styles.tagText}>{tag.name}</Text>
                    </View> 
                );
            }
        }


        return(
            <View style={styles.container}>
                <View style={styles.containerTop}>
                    <Navigation
                        leftBody={(
                            <View style={styles.navigationLeftBody}>
                                <TouchableOpacity style={styles.navigationLeftIconTouch} onPress={()=>this.props.navigation.goBack()}>
                                    <Image style={styles.navigationLeftBackIcon} source={require(iconUri+'/back.png')}></Image>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
                <View style={styles.containerCenter}>
                    <View style={styles.avatar}>
                        <Image style={styles.avatarImage} source={require(imageUri+'/avatar-default.jpg')}></Image>
                    </View>
                    <View style={styles.name}>
                        <Text style={styles.nameText}>{this.props.navigation.getParam('name')}</Text>
                    </View>
                    <View style={styles.className}>
                        <Text style={styles.classNameText}>{this.props.navigation.getParam('className')}</Text>    
                    </View>
                    <View style={styles.tag}>
                      {tagBody.map((value,index)=>value)} 
                           
                    </View>
                </View>
                <View style={styles.containerBottom}>
                    <TouchableOpacity style={styles.list} onPress={()=>this.props.navigation.navigate('Profile',)}>
                        <View style={styles.listLeft}>
                            <Image style={styles.listSignIcon} source={require(iconUri+'/profile.png')}></Image>
                        </View>
                        <View style={styles.listCenter}>
                            <Text style={styles.listText}>Profile</Text>
                        </View>
                        <View style={styles.listRight}>
                            <Image style={styles.listNextIcon} source={require(iconUri+'/next.png')}></Image>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.list}>
                        <View style={styles.listLeft}>
                            <Image style={styles.listSignIcon} source={require(iconUri+'/family-address.png')}></Image>
                        </View>
                        <View style={styles.listCenter}>
                            <Text style={styles.listText}>Family Member</Text>
                        </View>
                        <View style={styles.listRight}>
                            <Image style={styles.listNextIcon} source={require(iconUri+'/next.png')}></Image>
                        </View>    
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.list}>
                        <View style={styles.listLeft}>
                            <Image style={styles.listSignIcon} source={require(iconUri+'/homework.png')}></Image>
                        </View>
                        <View style={styles.listCenter}>
                            <Text style={styles.listText}>Homework</Text>
                        </View>
                        <View style={styles.listRight}>
                            <Image style={styles.listNextIcon} source={require(iconUri+'/next.png')}></Image>
                        </View>    
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}