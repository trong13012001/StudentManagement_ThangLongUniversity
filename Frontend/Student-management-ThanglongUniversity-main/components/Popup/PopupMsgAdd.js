import { View, Modal, TouchableOpacity, TextInput, StyleSheet, Text, Pressable, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useState } from 'react'
import GlobalStyle from '../../GlobalStyle';
import * as Icon from "phosphor-react-native";

const PopupMsgAdd = (props) => {
    const { showModal,title} = props; // Props passed from SamplePicScreen

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={showModal}
        >


                    <View style={styles.container}>

                        <View style={styles.wrapper}>
                            <Icon.CheckCircle color='green' size={30} weight='fill'/>
                            <Text style={{ fontWeight:"600",padding: 10,color:"#198754",fontSize: 18 }}>{title}</Text>
                        </View>
                    </View>
           
        </Modal>
    )
}

export default PopupMsgAdd

const styles = StyleSheet.create({
    container: {
        top:"88%",
        height: '10%',
        justifyContent: 'center',
    },
    wrapper: {
        backgroundColor: '#CFE7DD',
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