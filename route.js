/**
 * 路由页
 */
import React, {Component} from 'react';
import Index from './src/page/index';
import Student from './src/page/student/index';
import BottomBar from './src/page/bottom-bar';
import { createStackNavigator, createAppContainer,createSwitchNavigator } from "react-navigation";

// StackNavigator，允许返回
const MainStack = createStackNavigator({
    BottomBar: {
        screen: BottomBar,
    }
},{
    initialRouteName:'BottomBar',
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



