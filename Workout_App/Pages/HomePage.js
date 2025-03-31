import { View, Button, Text } from "react-native"
import { StyleSheet } from 'react-native';
import {useNavigate} from "react-router-native";


const HomePage = () => {

    const navigate = useNavigate();
    const styles = StyleSheet.create({
        title: {

          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32
        },
      });
    return(
        <>
        <View>
            <Text style={styles.title}> Hello! </Text>
            <Button title= "Record Excercise" onPress={()=> navigate('/Recording')} />
        </View>

        </>

    )
}

export default HomePage