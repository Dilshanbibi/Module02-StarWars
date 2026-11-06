
import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Reusable screen layout
function Screen({ title }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

// Three Star Wars screens
function PlanetsScreen() {
  return <Screen title="Planets" />;
}

function FilmsScreen() {
  return <Screen title="Films" />;
}

function SpaceshipsScreen() {
  return <Screen title="Spaceships" />;
}

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom tabs for iOS
function IosNavigation() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Tab.Navigator>
  );
}

// Drawer navigation for Android
function AndroidNavigation() {
  return (
    <Drawer.Navigator initialRouteName="Planets">
      <Drawer.Screen name="Planets" component={PlanetsScreen} />
      <Drawer.Screen name="Films" component={FilmsScreen} />
      <Drawer.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Drawer.Navigator>
  );
}

// Select navigation based on device platform
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {Platform.OS === 'ios' ? (
          <IosNavigation />
        ) : (
          <AndroidNavigation />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222222',
  },
});
