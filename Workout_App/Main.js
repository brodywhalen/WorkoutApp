import {Route, Routes, Navigate} from 'react-router-native';
import HomePage from './Pages/HomePage';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import RecordingPage from './Pages/RecordingPage';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });


const Main = () => {
    return(
        <View style={styles.container}>
            <Routes>
                <Route path = "/" element ={<HomePage/>}></Route>
                <Route path='Recording' element={<RecordingPage/>}></Route>
                <Route path = "*" element = {<Navigate to = "/" replace />}/>
            </Routes>
        </View>
    )
}


export default Main;