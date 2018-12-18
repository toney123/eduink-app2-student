/**
 * 路由页
 */
import React, {Component} from 'react';
import Index from './src/page/index';
import Student from './src/page/student/index';
import LeftSideMenu from './src/page/left-side-menu';
import { createStackNavigator, createAppContainer,createSwitchNavigator } from "react-navigation";

// StackNavigator，允许返回
const MainStack = createStackNavigator({
    LeftSideMenu: {
        screen: LeftSideMenu,
    }
},{
    initialRouteName:'LeftSideMenu',
    defaultNavigationOptions:()=>({
        header:null
    }) 
});


export default createAppContainer(
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



