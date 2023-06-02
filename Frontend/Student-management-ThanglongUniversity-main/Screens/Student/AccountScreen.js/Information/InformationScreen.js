import React, { useState, useEffect } from "react";

import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar, Button,FlatList
  } from "react-native"; 

const InformationScreen=()=>{
    return(
        <View style={{
            flex:1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
           <Text>Information Screen</Text>
        </View>
    )
}
export default InformationScreen