/**
 * 全局底栏
 */
import React, {Component} from 'react';
import {View,Text,StyleSheet,Image} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Student from './student/index';

const styles = StyleSheet.create({
    container:{
        flex:1
    }
});


export default class BottomBar extends Component{

    constructor(props){
        super(props);
        this.state = {
            selectedTab:'student'
        }
    }



    render(){
        return (
            <View style={styles.container}>
                <TabNavigator
                    tabBarStyle={{backgroundColor:'#FFF'}}
                    // 底栏顶部样式
                    tabBarShadowStyle={{backgroundColor:'#A6B3C2'}}
                >
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'home'}
                        renderIcon={() => <Image style={{width:35,height:25}} source={require('../image/icon/home.png')} />}
                        renderSelectedIcon={() => <Image style={{width:35,height:25}} source={require('../image/icon/home-selected.png')} />}
                        onPress={()=>this.setState({selectedTab:'home'})}>
                        <Text>home</Text>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'student'}
                        renderIcon={() => <Image style={{width:35,height:28}} source={require('../image/icon/student.png')} />}
                        renderSelectedIcon={() => <Image style={{width:35,height:28}}  source={require('../image/icon/student-selected.png')} />}
                        onPress={()=>this.setState({selectedTab:'student'})}>
                        <Student/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'notice'}
                        renderIcon={() => <Image style={{width:35,height:28}} source={require('../image/icon/notice.png')} />}
                        renderSelectedIcon={() => <Image style={{width:35,height:28}}  source={require('../image/icon/notice-selected.png')} />}
                        onPress={()=>this.setState({selectedTab:'notice'})}>
                        <Text>notice</Text>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'more'}
                        renderIcon={() => <Image style={{width:35,height:28}} source={require('../image/icon/more.png')} />}
                        renderSelectedIcon={() => <Image style={{width:35,height:28}}  source={require('../image/icon/more-selected.png')} />}
                        onPress={()=>this.setState({selectedTab:'more'})}>
                        <Text>more</Text>
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        );
    }
}