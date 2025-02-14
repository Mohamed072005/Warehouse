import {Stack, Tabs} from "expo-router";
import {Colors} from "@/constants/Colors";
import {HapticTab} from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import {Platform, SafeAreaView, useColorScheme} from "react-native";
import {IconSymbol} from "@/components/ui/IconSymbol";
import React from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TabsLayout: React.FC = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[useColorScheme() ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="product"
                options={{
                    title: 'Products',
                    tabBarIcon: ({color}) => <MaterialCommunityIcons name="package-variant" size={24} color={color}/>,
                    href: '/product',
                    tabBarHideOnSubRoutes: true,
                }}
            />
            <Tabs.Screen
                name="scanner"
                options={{
                    title: 'Scanner',
                    tabBarIcon: ({color}) => <MaterialCommunityIcons name="barcode-scan" size={24} color={color}/>,
                }}/>
        </Tabs>
    )
}

export default TabsLayout