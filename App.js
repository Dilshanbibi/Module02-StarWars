
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

// Reusable component for fetching and displaying API data
function StarWarsList({ title, endpoint, labelField }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const response = await fetch(
          `https://swapi.dev/api/${endpoint}/`
        );

        if (!response.ok) {
          throw new Error('Unable to load Star Wars data');
        }

        const data = await response.json();

        if (active) {
          setItems(data.results);
        }
      } catch (err) {
        if (active) {
          setError('Failed to load data. Please try again.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [endpoint]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.title}>{title}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#333" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.itemText}>
                {item[labelField]}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

// Three screens using the reusable list component
function PlanetsScreen() {
  return (
    <StarWarsList
      title="Planets"
      endpoint="planets"
      labelField="name"
    />
  );
}

function FilmsScreen() {
  return (
    <StarWarsList
      title="Films"
      endpoint="films"
      labelField="title"
    />
  );
}

function SpaceshipsScreen() {
  return (
    <StarWarsList
      title="Spaceships"
      endpoint="starships"
      labelField="name"
    />
  );
}

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// iOS uses bottom tab navigation
function IosNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
      <Tab.Screen
        name="Spaceships"
        component={SpaceshipsScreen}
      />
    </Tab.Navigator>
  );
}

// Android uses drawer navigation
function AndroidNavigation() {
  return (
    <Drawer.Navigator initialRouteName="Planets">
      <Drawer.Screen name="Planets" component={PlanetsScreen} />
      <Drawer.Screen name="Films" component={FilmsScreen} />
      <Drawer.Screen
        name="Spaceships"
        component={SpaceshipsScreen}
      />
    </Drawer.Navigator>
  );
}

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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listItem: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 18,
    color: '#222222',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});
