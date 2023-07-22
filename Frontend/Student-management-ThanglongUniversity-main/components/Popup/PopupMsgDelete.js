import { View, Modal, TouchableOpacity, TextInput, StyleSheet, Text, Pressable, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useState } from 'react'
import GlobalStyle from '../../GlobalStyle';
import * as Icon from "phosphor-react-native";

const PopupMsgDelete = (props) => {
    const { showModal, title} = props; // Props passed from SamplePicScreen

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={showModal}
        >
                    <View style={styles.container}>

                        <View style={styles.wrapper}>
                            <Icon.XCircle color={GlobalStyle.themeColor.color} weight='fill' size={30}/>
                            <Text style={{ fontWeight:600,padding: 10,color:GlobalStyle.themeColor.color,fontSize: 18 }}>{title}</Text>
                    
                        </View>
                    </View>
           
        </Modal>
    )
}

export default PopupMsgDelete

const styles = StyleSheet.create({
    container: {
        top:"88%",
        height: '10%',
        justifyContent: 'center',
    },
    wrapper: {
        backgroundColor: '#FBD7DA',
        borderRadius: 8,
        padding: 8,
        marginLeft:10,
        marginRight:10,
        alignItems: 'center',
        flexDirection:"row"
    },
    inputStyle: {
        borderWidth: 1,
        borderColor: '#C6C6C6',
        borderRadius: 10,
        padding: 10,
        paddingVertical: '10%',
    },
    buttonStyle: {
        alignItems: 'center',
        borderRadius: 10,
        width: 120,
        paddingVertical: 10,
        justifyContent: 'center',
    },
})