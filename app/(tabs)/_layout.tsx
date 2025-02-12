import {Stack, Tabs} from "expo-router";
import {Colors} from "@/constants/Colors";
import {HapticTab} from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import {Platform, useColorScheme} from "react-native";
import {IconSymbol} from "@/components/ui/IconSymbol";
import React from "react";

const HomeLayout: React.FC = () => {
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
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />
        </Tabs>
    )
}

export default HomeLayout