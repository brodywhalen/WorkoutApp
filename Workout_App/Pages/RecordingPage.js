import { useEffect } from "react"
import { useCameraDevice, useCameraPermission } from "react-native-vision-camera"
import { Text } from "react-native"
const RecordingPage = () =>{
    const device = useCameraDevice('front');
    const {hasPermission, requestPermission} = useCameraPermission();

    useEffect(()=> {
        requestPermission()
    }, [requestPermission])

    if (!hasPermission) {
        return <Text>No permission</Text>;
    }
    if (device == null) {
        return <Text>No device</Text>;
    }

    return (<>
        <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
        
    </>)
}

export default RecordingPage