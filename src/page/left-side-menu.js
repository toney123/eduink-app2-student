/**
 * 全局左侧栏
 */
import React, {Component} from 'react';
import {StyleSheet,Text,View,ScrollView,TouchableOpacity,Image} from 'react-native';
import SideMenu from 'react-native-side-menu';
import Student from './student/index';
import Dashboard from './dashboard';
import Directory from './directory';
import Group from './group';

const iconUri = '../image/icon';

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFF'
    },
    menuContainer:{
        flex:1,
    },
    menuContainerTop:{
        flex:1,
        backgroundColor:'#85A5FF'
    },
    menuContainerBottom:{
        flex:2,
    },
    menuListTop:{
        flex:7
    },
    menuListCenter:{
        flex:1,
    },
    menuListBottom:{
        flex:1
    },
    scrollMenu:{
        top:30,
        flex:1
    },
    scrollMenuTouch:{
        marginBottom:20,
        flexDirection:'row'
    },
    scrollMenuTouchIcon:{
        left:10,
        width:25,
        height:25
    },
    scrollMenuTouchText:{
        marginLeft:20,
        marginTop:3,
        color:'#8890A6'
    },
    myTouch:{
        marginTop:6,
        marginLeft:10,
        flexDirection:'row'
    },
    myTouchIcon:{
        width:25,
        height:25
    },
    myTouchText:{
        marginLeft:10,
        color:'#8890A6'
    }
});


export default class LeftSideMenu extends Component{

    constructor(){
        super();
        this.state = {
            page:Dashboard
        }
    }

    // 切换页面
    _switchPage(pageName){
        this.setState({
            page:pageName
        });
    }


    render(){

        const Page = this.state.page;

        return(
            <SideMenu menu={(
                <View style={styles.menuContainer}>
                    <View style={styles.menuContainerTop}></View>
                    <View style={styles.menuContainerBottom}>
                        <View style={styles.menuListTop}>
                            <ScrollView style={styles.scrollMenu}>
                                <TouchableOpacity style={styles.scrollMenuTouch} onPress={()=>this._switchPage(Dashboard)}>
                                    <Image style={styles.scrollMenuTouchIcon} source={require(iconUri+'/dashboard.png')}></Image>
                                    <Text style={styles.scrollMenuTouchText}>Dashboard</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollMenuTouch} onPress={()=>this._switchPage(Student)}>
                                    <Image style={styles.scrollMenuTouchIcon} source={require(iconUri+'/student.png')}></Image>
                                    <Text style={styles.scrollMenuTouchText}>Students</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollMenuTouch} onPress={()=>this._switchPage(Directory)}>
                                    <Image style={styles.scrollMenuTouchIcon} source={require(iconUri+'/directory.png')}></Image>
                                    <Text style={styles.scrollMenuTouchText}>Directories</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollMenuTouch} onPress={()=>this._switchPage(Group)}>
                                    <Image style={styles.scrollMenuTouchIcon} source={require(iconUri+'/group.png')}></Image>
                                    <Text style={styles.scrollMenuTouchText}>Groups</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                        <View style={styles.menuListCenter}></View>
                        <View style={styles.menuListBottom}>
                            <TouchableOpacity style={styles.myTouch}>
                                <Image style={styles.myTouchIcon} source={require(iconUri+'/my.png')}></Image>
                                <Text style={styles.myTouchText}>Toney</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}>
                <View style={styles.container}>
                    <Page />
                </View>
            </SideMenu>
        );
    }
}