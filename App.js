
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  Pressable,
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

// Reusable component for each Star Wars screen
function StarWarsList({ title, endpoint, labelField }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search input and modal state
  const [searchText, setSearchText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch Star Wars data from the API
  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const response = await fetch(
          `https://swapi.dev/api/${endpoint}/`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        if (active) {
          setItems(data.results);
        }
      } catch (err) {
        if (active) {
          setError('Unable to load Star Wars data.');
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

  // Display the entered text in a modal
  function handleSearch() {
    setSubmittedText(searchText);
    setModalVisible(true);
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.title}>{title}</Text>

      {/* Search input at the top of the screen */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${title}...`}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <Button title="Search" onPress={handleSearch} />
      </View>

      {/* Existing API list */}
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

      {/* Modal displays the submitted search text */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search Result</Text>

            <Text style={styles.modalText}>
              You entered: {submittedText}
            </Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Three screens from the previous assignments
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

// iOS bottom tab navigation
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

// Android drawer navigation
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

// Main application
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
