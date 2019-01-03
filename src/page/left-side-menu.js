/**
 * 全局左侧栏
 */
"use strict";
import React, {Component} from 'react';
import {StyleSheet,Text,View,ScrollView,TouchableOpacity,Image,Picker} from 'react-native';
import SideMenu from 'react-native-side-menu';
import Student from './student/index';
import Dashboard from './dashboard';
import Directory from './directory';
import Group from './group';
import {host,schoolId,sessionToken} from '../util/constant';
import I18n from '../language/i18n';

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
    menuYearTop:{
        flex:2
    },
    menuYearCenter:{
        flex:1,
    },
    menuYearBottom:{
        flex:1
    },
    menuContainerBottom:{
        flex:2,
    },
    menuListTop:{
        flex:2
    },
    menuListCenter:{
        flex:1,
    },
    menuListBottom:{
        flex:1
    },
    menuMyTop:{
        flex:1
    },
    menuMyBottom:{
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
    transformTouch:{
        marginTop:6,
        marginLeft:10,
        flexDirection:'row'
    },
    transformTouchIcon:{
        width:25,
        height:25
    },
    transformTouchText:{
        marginLeft:10,
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
    },
    menuYearPicker:{
        color:'#FFF'
    }
});

// 全局变量
global.yearId;

export default class LeftSideMenu extends Component{

    constructor(){
        super();
        this.state = {
            page:Student,
            years:[],
            yearId:null,
            sideMenuStatus:false,
            language:'en',
            languageName:'English'
        }
        this.updateSideMenuStatus = this.updateSideMenuStatus.bind(this);
    }

    // 切换页面
    _switchPage(pageName){
        this.setState({
            page:pageName
        });
        this.updateSideMenuStatus();
    }

    // 因打开左侧栏后，右边点任意处会关闭，手动点按钮关闭无效，则需矫正
    _correctSideMenuStatus(isOpen){
        this.setState({
            sideMenuStatus:isOpen
        });
    }

    // 更新左侧栏状态
    updateSideMenuStatus(){
        this.setState({
            sideMenuStatus:!this.state.sideMenuStatus
        });
    }

    async _getAllYears(){

       try {
            let response = await fetch(host+'/sis/years', {
                method: "GET",
                headers: {
                'X-App-Id': schoolId,
                'X-Session-Token': sessionToken
                },
            });
            let data = JSON.parse(response._bodyInit);

            if(response.status == 200){
                let yearId;
                let years=[];
                for(let i in data){
                    years.push(
                        <Picker.Item key={i} label={data[i].name} value={data[i]._id} />
                    );
                    // 找当前年份
                    if(data[i].isCurrent == true){
                        yearId = data[i]._id;
                    }
                }

                // 更新全局
                global.yearId = yearId;

                this.setState({
                    years:years,
                    yearId:yearId
                });

            }else{
                alert(data.message);
            }
       } catch (error) {
           console.error(error);
       } 
    
    }

    // 切换年份
    _switchYear(yearId){ 
        // 更新全局变量
        global.yearId = yearId;    

        this.setState({
            yearId:yearId
        });
        this.updateSideMenuStatus();
    }

    // 转换语言
    _translate(){
        let language;
        let languageName;
        if(this.state.language == 'en'){
            language = 'zh';
            languageName = '中文';
        }else{
            language = 'en';
            languageName = 'English';
        }
        this.setState({
            language:language,
            languageName:languageName
        });
    }

    componentWillMount(){
        this._getAllYears();
    }

    componentDidUpdate(){
        
    }


    render(){

        // 切换语言
        I18n.locale = this.state.language;

        const Page = this.state.page;

        return(
            <SideMenu 
                isOpen={this.state.sideMenuStatus}
                onChange={(isOpen)=>this._correctSideMenuStatus(isOpen)}
                menu={(
                <View style={styles.menuContainer}>
                    <View style={styles.menuContainerTop}>
                        <View style={styles.menuYearTop}></View>
                        <View style={styles.menuYearCenter}></View>
                        <View style={styles.menuYearBottom}>
                            <Picker
                                selectedValue={this.state.yearId}
                                style={styles.menuYearPicker}
                                onValueChange={(itemValue, itemIndex) => this._switchYear(itemValue) }
                                >
                                {this.state.years}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.menuContainerBottom}>
                        <View style={styles.menuListTop}>
                            <ScrollView style={styles.scrollMenu}>
                                <TouchableOpacity style={styles.scrollMenuTouch} onPress={()=>this._switchPage(Dashboard)}>
                                    <Image style={styles.scrollMenuTouchIcon} source={require(iconUri+'/dashboard.png')}></Image>
                                    <Text style={styles.scrollMenuTouchText}>{I18n.t('leftSideMenu.dashboard')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollMenuTouch} onPress={()=>this._switchPage(Student)}>
                                    <Image style={styles.scrollMenuTouchIcon} source={require(iconUri+'/student.png')}></Image>
                                    <Text style={styles.scrollMenuTouchText}>{I18n.t('leftSideMenu.students')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollMenuTouch} onPress={()=>this._switchPage(Directory)}>
                                    <Image style={styles.scrollMenuTouchIcon} source={require(iconUri+'/directory.png')}></Image>
                                    <Text style={styles.scrollMenuTouchText}>{I18n.t('leftSideMenu.directories')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollMenuTouch} onPress={()=>this._switchPage(Group)}>
                                    <Image style={styles.scrollMenuTouchIcon} source={require(iconUri+'/group.png')}></Image>
                                    <Text style={styles.scrollMenuTouchText}>{I18n.t('leftSideMenu.groups')}</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                        <View style={styles.menuListCenter}></View>
                        <View style={styles.menuListBottom}>
                            <View style={styles.menuMyTop}>
                                <TouchableOpacity style={styles.myTouch}>
                                    <Image style={styles.myTouchIcon} source={require(iconUri+'/my.png')}></Image>
                                    <Text style={styles.myTouchText}>Toney</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.menuMyBottom}>
                                <TouchableOpacity style={styles.transformTouch} onPress={()=>this._translate()}>
                                    <Image style={styles.transformTouchIcon} source={require(iconUri+'/translate.png')}></Image>
                                    <Text style={styles.transformTouchText}>{this.state.languageName}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}>
                <View style={styles.container}>
                    <Page 
                        navigation = {this.props.navigation}
                        updateSideMenuStatus={this.updateSideMenuStatus} 
                    />
                </View>
            </SideMenu>
        );
    }
}