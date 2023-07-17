import React, { useState,useEffect } from "react";
import { View, Text, TouchableOpacity, Modal,Dimensions, TurboModuleRegistry,ScrollView } from "react-native";
import GlobalStyle from "../../GlobalStyle";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

let windowWidth = Dimensions.get("window").width;

const CustomPicker = ({onValueChange, items,termName,termID }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    setSelectedLabel(termName);
    onValueChange(termID)
  }, [termID,termName]);
  const handleValueChange = (itemValue, itemLabel) => {
    setSelectedLabel(itemLabel);
    onValueChange(itemValue);
    toggleModal();
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleModal}>
        <View>
          <Text allowFontScaling={false} style={{fontSize: (Platform.OS === 'ios' && windowWidth>400) ? 20 : 20*0.6,fontWeight:"600",color:GlobalStyle.themeColor.color}}>{selectedLabel}</Text>
        </View>
      </TouchableOpacity>
        <Modal animationType="slide" visible={modalVisible} transparent={true} onRequestClose={toggleModal}>
        
            <View style={{backgroundColor:"#00000050",flex:1}}>

            <View style={{ top: "60%",flex:0.4,backgroundColor:"white",borderRadius:16}}>
            <TouchableOpacity onPress={toggleModal} style={{marginLeft:"4%",top:"3%",marginBottom:"5%"}}><FontAwesome5 name='times' size={36} color={GlobalStyle.textColor.color}></FontAwesome5></TouchableOpacity>
            <ScrollView >
            {items.sort((a, b) => b.id - a.id).map((item) => (
            <TouchableOpacity key={item.id}  onPress={() => handleValueChange(item.termID, item.termName)}>
                
               
                <View style={{height: (Platform.OS === 'ios' && windowWidth > 400) ? 50 : 50 * (windowWidth / 428), justifyContent: "center", borderBottomColor: "black", borderBottomWidth: 0.5}}>
                    <Text style={{marginLeft: "5%",fontSize:16,color:GlobalStyle.textColor.color,fontWeight:"400"}}>{item.termName}</Text>
                </View>                            
            </TouchableOpacity>
          ))}</ScrollView>
          <View style={{height:50}}></View>
        </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomPicker;
