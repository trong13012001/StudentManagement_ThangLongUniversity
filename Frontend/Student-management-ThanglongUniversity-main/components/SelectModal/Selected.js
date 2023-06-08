import React from "react";
import { Select, VStack, CheckIcon, Center, NativeBaseProvider } from "native-base";

const Selected = () => {
  let [service, setService] = React.useState("HK1N1");
  return <VStack alignItems="center" space={4}>
      <Select selectedValue={service} minWidth="200" variant="unstyled"
      _light={{
      bg: 'none',
      _hover: {
        bg: 'none'
      },
      _focus: {
        bg: 'none'
      }
    }} _dark={{
      bg:'none',
      _hover: {
        bg: 'none'
      },
      _focus: {
        bg: 'none'
      }
    }} onValueChange={itemValue => setService(itemValue)}>
        <Select.Item shadow={2} label="Học kỳ 1 Nhóm 1" value="HK1N1" />
        <Select.Item shadow={2} label="Học kỳ 1 nhóm 2" value="HK1N2" />
        <Select.Item shadow={2} label="Học kỳ 1 nhóm 3" value="HK1N3" />
        <Select.Item shadow={2} label="Học kỳ 2 nhóm 1" value="HK2N1" />
        <Select.Item shadow={2} label="Học kỳ 2 nhóm 2" value="HK2N2" />
        <Select.Item shadow={2} label="Học kỳ 2 nhóm 3" value="HK2N3" />
        <Select.Item shadow={2} label="Học kỳ 3 nhóm 1" value="HK3N1" />
        <Select.Item shadow={2} label="Học kỳ 3 nhóm 2" value="HK3N2" />
        <Select.Item shadow={2} label="Học kỳ 3 nhóm 3" value="HK3N3" />
      </Select>
    </VStack>;
};

    export default Selected
    