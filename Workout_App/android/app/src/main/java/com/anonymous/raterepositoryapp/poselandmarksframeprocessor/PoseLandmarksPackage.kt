// PoseLandmarksPackage.kt
package com.anonymous.raterepositoryapp.poselandmarksframeprocessor

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

// copied in from chat gpt

import com.anonymous.raterepositoryapp.poselandmarksframeprocessor.PoseLandmarksPackage
import com.anonymous.raterepositoryapp.poselandmarksframeprocessor.PoseLandmarksFrameProcessorPluginPackage


class PoseLandmarksPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(PoseLandmarks(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}