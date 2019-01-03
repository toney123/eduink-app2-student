/**
 * 全局配置页
 */
"use strict";
import React, {Component} from 'react';
import Index from './src/page/index';
import LeftSideMenu from './src/page/left-side-menu';
import { createStackNavigator, createAppContainer,createSwitchNavigator } from "react-navigation";
import RNLanguages from 'react-native-languages';
import I18n from './src/language/i18n';
import Detail from './src/page/student/detail';
import Profile from './src/page/student/profile';

// StackNavigator，允许返回
const MainStack = createStackNavigator({
    LeftSideMenu: {
        screen: LeftSideMenu,
    },
    Detail:{
        screen:Detail
    },
    Profile:{
        screen:Profile
    }
},{
    initialRouteName:'LeftSideMenu',
    defaultNavigationOptions:()=>({
        header:null
    }) 
});


const AppContainer = createAppContainer(
    // SwitchNavigator单页，忽略返回
    createSwitchNavigator({
        Main:{
            screen:MainStack
        },
        Index:{
            screen:Index
        }},
        {
            initialRouteName:'Main'   
        }
    )
);


export default class Config extends Component{

    constructor(){
        super();
    }


    // componentWillMount(){
    //     // RNLanguages.addEventListener('change', this._onLanguagesChange);
    // }

    // componentWillUnmount(){
    //     // RNLanguages.removeEventListener('change', this._onLanguagesChange);
    // }

    // _onLanguagesChange = ({ language }) => {
    //     I18n.locale = language;
    // };


    render(){
        return(
            <AppContainer/>
        );
    }
}



