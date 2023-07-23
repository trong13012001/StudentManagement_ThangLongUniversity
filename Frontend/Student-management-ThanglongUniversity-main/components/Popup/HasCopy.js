import { View, Modal, TouchableOpacity, TextInput, StyleSheet, Text, Pressable, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useState } from 'react'
import GlobalStyle from '../../GlobalStyle';
import * as Icon from "phosphor-react-native";

const HasCopy = (props) => {
    const { showModal,title} = props; // Props passed from SamplePicScreen

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={showModal}
        >


                    <View style={styles.container}>

                        <View style={styles.wrapper}>
                            <Text style={{ fontWeight:"600",padding: 10,color:GlobalStyle.textColor.color,fontSize: 18 }}>{title}</Text>
                        </View>
                    </View>
           
        </Modal>
    )
}

export default HasCopy

const styles = StyleSheet.create({
    container: {
        top:"80%",
        height: '10%',
        justifyContent: 'center',
        alignItems:"center" 
   },
    wrapper: {
        backgroundColor: '#DfDfDf',
        borderRadius: 8,
        alignItems: 'center',
        width:120,
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
        paddingVertical: 10,
        justifyContent: 'center',
    },
})