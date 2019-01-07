/**
 * 学生信息
 */
"use strict";
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity,Image,Dimensions,ScrollView,TextInput,Button} from 'react-native';
import Navigation from '../common/navigation';
import ScrollableTabView,{DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {host,schoolId,sessionToken} from '../../util/constant';
import I18n from '../../language/i18n';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import DatePicker from 'react-native-datepicker';
import SYImagePicker from 'react-native-syan-image-picker';

const iconUri = '../../image/icon';
const imageUri = '../../image/';

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    containerTop:{
        flex:1
    },
    containerBottom:{
        flex:14,
    },
    contentTop:{
        flex:8
    },
    contentBottom:{
        flex:1,
        backgroundColor:'#F7F9FC',
        justifyContent:'center'
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
    structure:{
        flex:1,
        flexDirection:'row'
    },
    structureScroll:{
        height:'100%',
    },
    structureLeft:{
        flex:1
    },
    structureCenter:{
        flex:6,
    },
    structureRight:{
        flex:1
    },
    structureType:{
        flex:1,
        marginTop:20,
    },
    structureTypeName:{
        color:'#4A4A4A',
    },
    editTouch:{
        backgroundColor:'#85A5FF',
        borderRadius:20,
        width:'80%',
        height:35,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center'
    },
    editText:{
        color:'#FFF'
    }
});

// 存储结构里的每项数据
let structureData=[];

export default class Profile extends Component{

    constructor(){
        super();
        this.state = {
            // 学生资料的结构
            structure:[],
            // 选项类型
            selection:0,
            // 日期
            date:'',
            // 头像资源地址
            avatarUri:''
        }
    }


    componentWillMount(){
        // 获取学生profile 结构里的数据
        this._getStructureData();
    }

    // 获取学生的所有信息输入框类型和值
    async _getFullStructure(){
        try {
            let response = await fetch(host+'/sis/profile-definitions/Student/get-full-structure', {
              method: "GET",
              headers: {
                'X-App-Id': schoolId,
                'X-Session-Token': sessionToken
              },
            });
    
            let data = JSON.parse(response._bodyInit);

            if(response.status == 200){
              this.setState({
                structure:data.sections
              });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 获取学生信息的数据
    async _getStructureData(){
        // 获取父组件传来的学生id
       const studentId = this.props.navigation.getParam('id');
        let param = JSON.stringify({
            'user':studentId,
            'profileDefinition':'Student'
        });

       try {
            let response = await fetch(host+'/sis/user-profiles?q='+param, {
                method: "GET",
                headers: {
                    'X-App-Id': schoolId,
                    'X-Session-Token': sessionToken
                },
            });

            let data = JSON.parse(response._bodyInit);

            if(response.status == 200){
                // 存储profile 结构里的每项数据
                structureData = data;
                // 获取学生profile 结构
                this._getFullStructure();
                
            }
        } catch (error) {
            console.error(error);
        }
    }   

    // 图片上传
    _imageUpload(){
        SYImagePicker.showImagePicker(
            {imageCount: 1, isRecordSelected: true, isCrop: true, showCropCircle: true}, 
            (err, photos) => {
            console.warn(err, photos);
            if (!err) {
                // this.setState({
                //     photos
                // })
            }
        });
    }


    render(){

        let structureBody=[];
        let body;

        if(this.state.structure.length){
            for (const data of this.state.structure) {
                
                let insideBody=[];
                for (const item of data.items) {
                    // item._id 选项id
                    let valueBody;
                    if(item.type == 'Selection'){
                        let options=[];
                        for (const option of item.options) {
                            options.push(
                                <RadioButton key={option.value.en} value={option.value.en} >
                                    <Text>{option.value.en}</Text>
                                </RadioButton>
                            );
                        }

                        valueBody=(
                            <RadioGroup
                                color='#85A5FF'
                                style={{flexDirection:'row'}}
                                selectedIndex = {0}
                                // onSelect = {(index, value) => this.setState({selection:value})}
                            >
                                {options.map((value,index)=>value)}
                            </RadioGroup>
                        );
                    }else if(item.type == 'DateInput'){
                        valueBody=(
                            <DatePicker
                                style={{width: 200}}
                                date={this.state.date}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                showIcon={false}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateText:{
                                        alignSelf:'flex-start',
                                        marginLeft:5
                                    },
                                    placeholderText:{
                                        alignSelf:'flex-start',
                                        color:'#9B9B9B',
                                        marginLeft:5
                                    },
                                    dateInput:{
                                        borderColor:'#DFDFDF',
                                        borderRadius:5,
                                        height:30
                                    }
                                }}
                                onDateChange={(date) => {this.setState({date: date})}}
                            />
                        );
                    }else if(item.type == 'TextInput'){
                        valueBody=(
                            <TextInput style={{borderWidth:1,borderRadius:5,borderColor:'#DFDFDF',paddingTop:0,paddingBottom:0,marginTop:5}}></TextInput>
                        );
                    }else if(item.type == 'Upload'){
                        valueBody=(
                            <TouchableOpacity onPress={()=>this._imageUpload()} style={{borderWidth:1,borderColor:'#85A5FF',borderRadius:5,alignItems:'center',justifyContent:'center',marginTop:5,marginBottom:5,width:'20%'}}>
                                <Text style={{color:'#85A5FF'}}>upload</Text>
                            </TouchableOpacity>
                        );
                    }
                    insideBody.push(
                        <View key={item.name.en} style={styles.structureType}>
                            <Text style={styles.structureTypeName}>{item.name.en}</Text>
                            {valueBody}
                        </View>
                    );
                }
    
                structureBody.push(
                    <ScrollView style={styles.structureScroll} key={data._id} tabLabel={data.name.en} >
                        <View style={styles.structure}>
                            
                            <View style={styles.structureLeft}></View>
                            <View style={styles.structureCenter}>
                                {insideBody.map((value,index)=>value)}
                            </View>
                            <View style={styles.structureRight}></View>
                            
                        </View>
                    </ScrollView>
                );
            }

            body = (
                <ScrollableTabView
                    // 渲染成可滚动模式
                    renderTabBar={() => <ScrollableTabBar/>}
                    tabBarActiveTextColor='#85A5FF'
                    tabBarUnderlineStyle={{backgroundColor:'#85A5FF'}}  
                >
                    {structureBody.map((value,index)=>value)}
                </ScrollableTabView>
            );
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
                <View style={styles.containerBottom}>
                    <View style={styles.contentTop}>
                        {body}    
                    </View>        
                    <View style={styles.contentBottom}>
                        <TouchableOpacity style={styles.editTouch}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>   
                    </View>        
                    
                </View>
            </View>
        );
    }
}