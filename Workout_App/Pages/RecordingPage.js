import { useEffect, useRef, useState } from "react"
import { useCameraDevice, useCameraPermission } from "react-native-vision-camera"
import { Camera, useSkiaFrameProcessor } from "react-native-vision-camera"
import { VisionCameraProxy } from 'react-native-vision-camera';
import { Button, NativeEventEmitter, Text, View, NativeModules, Platform } from "react-native"
import { StyleSheet } from "react-native"
// import { useSharedValue } from "react-native-worklets-core"
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native";


// Pose Landmarks

const {poseLandmarks} = NativeModules
const PoseLandmarksEmitter = new NativeEventEmitter(poseLandmarks);

// intialize the frame processor plugin poseLandmakrs.
const poseLandMarkPlugin = VisionCameraProxy.initFrameProcessorPlugin('poseLandmarks', {},);

// create a worlet function


function poseLandmarks2 (frame){
    'worklet';
    if(poseLandMarkPlugin == null){
        throw new Error('Failed to load Frame Processor Plugin!');
    }
    return poseLandMarkPlugin.call(frame)
}


const RecordingPage = () =>{

     const landmarks = useSharedValue({})

    const device = useCameraDevice('back');
    const {hasPermission, requestPermission} = useCameraPermission();
    const cameraRef = useRef(null)
    const [isRecording, setIsRecording] = useState(false)
    const [hasInitialized, setHasInitialized] = useState(false);
    const [isActive, setIsActive] = useState(false)

    useEffect(()=> {
        console.log('UseEffect 1')
        requestPermission()
        console.log(device)
    }, [requestPermission])

    useEffect(() => {
        // Set up the event listener to listen for hand landmarks detection results

        console.log('UseEffect 1')
        const subscription = PoseLandmarksEmitter.addListener(
        'onPoseLandmarksDetected',
        event => {
          // Update the landmarks shared value to paint them on the screen
          landmarks.value = event.landmarks;
            /*
            The event contains values for landmarks and hand.
            These values are defined in the HandLandmarkerResultProcessor class
            found in the HandLandmarks.swift file.
          */
          console.log("onHandLandmarksDetected: ", event);
            /*
            This is where you can handle converting the data into commands
            for further processing.


          */
        },);

         return () => {
            subscription.remove()
         }

    }, []);
    console.log('before processor')
    // Camera Logic
    const frameProcessor = useSkiaFrameProcessor((frame) => {
        'worklet';
        

        poseLandmarks2(frame)
        frame.render()
        // console.log('we skia here')
        if (landmarks.value[0]) {
            console.log(landmarks.value[0])
            const hand = landmarks.value[0];
            const frameWidth = frame.width;
            const frameHeight = frame.height;

            // console.log()
      
        //     // Draw lines connecting landmarks
        //     for (const [from, to] of lines) {
        //       frame.drawLine(
        //         hand[from].x * Number(frameWidth),
        //         hand[from].y * Number(frameHeight),
        //         hand[to].x * Number(frameWidth),
        //         hand[to].y * Number(frameHeight),
        //         linePaint,
        //       );
        //     }
      
        //     // Draw circles on landmarks
        //     for (const mark of hand) {
        //       frame.drawCircle(
        //         mark.x * Number(frameWidth),
        //         mark.y * Number(frameHeight),
        //         6,
        //         paint,
        //       );
        //     }
          }


    },[])
    

    const startRecord = async () => {
        if(cameraRef.current) {
            setIsRecording(true)
            try {
                const video = await cameraRef.current.startRecording({
                    fileType: 'mp4',
                    flash: 'off',
                    onRecordingFinished: (video) => {
                        console.log('Videos saved to: ', video.path)
                        setIsRecording(false)
                    },
                    onRecordingError: (error) => {
                        console.log('Recording Error: ', error)
                        setIsRecording(false)
                    }
                })
            } catch (error) {
                console.error(error);
                setIsRecording(false)
            }
        }

    }
    const endRecord = async () => {
        cameraRef.current.stopRecording()
    }



    if (!hasPermission) {
        return <Text>No permission either</Text>;
    }
    if (device == null) {
        return <Text>No device</Text>;
    } 

    const pixelFormat = Platform.OS === 'ios' ? 'rgb' : 'yuv';

    return (
    <>  
    <SafeAreaView style={StyleSheet.absoluteFill}>
        <Camera 
            style={styles.display} 
            ref={cameraRef}
            device={device} 
            video={true} 
            isActive={true}  
            frameProcessor={frameProcessor}
            pixelFormat={pixelFormat}
            onInitialized={() => {
                setHasInitialized(true)
                if(hasInitialized){
                    time = setTimeout(()=> setIsActive(true), 150)
                }
            }}
        />
    </SafeAreaView>
        <View style = {styles.recordButton}>
            <Button
                
                title= {isRecording ? 'Stop Recording' : 'Start Recording'}
                onPress={isRecording ? endRecord : startRecord}
            />
        </View>
        
    </>)
}

const styles = StyleSheet.create({
    recordButton: {
        zIndex: 1,
        // justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center'
    },
    display: {
        ...StyleSheet.absoluteFill
    },
    view: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-end'
        
    }
})
export default RecordingPage