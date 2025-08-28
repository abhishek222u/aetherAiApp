import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const Tab = createBottomTabNavigator();

// Dashboard Screen Component
const DashboardScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState("New");
  const [queriesData, setQueriesData] = useState({
    New: [],
    Pending: [],
    Completed: [],
  });

  const { userId } = useContext(UserContext);


  // const queriesData = {
  //   New: [
  //     { id: 'MG2001', title: 'Medicine Query #MG2001', subtitle: 'Medicine prescription uploaded', time: '5 min ago' },
  //     { id: 'MG2002', title: 'Medicine Query #MG2002', subtitle: 'Prescription missing details', time: '15 min ago' },
  //   ],
  //   Pending: [
  //     { id: 'MG3001', title: 'Medicine Query #MG3001', subtitle: 'Waiting for confirmation', time: '1 hr ago' },
  //     { id: 'MG3002', title: 'Medicine Query #MG3002', subtitle: 'Prescription uploaded', time: '2 hr ago' },
  //   ],
  //   Completed: [
  //     { id: 'MG4001', title: 'Medicine Query #MG4001', subtitle: 'Offer sent & accepted', time: 'Yesterday' },
  //     { id: 'MG4002', title: 'Medicine Query #MG4002', subtitle: 'Closed successfully', time: '2 days ago' },
  //   ],
  // };

  const queries = queriesData[activeFilter];

  const getNewQueriesData = async () => {
    try {
      // const response = await axios.get('http://74.225.157.233:9000/api/v1/agent/requests-from-cache/a8eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', {
      const response = await axios.get('http://74.225.157.233:9000/api/v1/agent/requests-from-cache/' + userId, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const newQueries = response.data.requests.map((item) => ({
        id: item.id,
        request_id: item.request_id,
        title: 'Medicine Query #MG2001',
        subtitle: 'Medicine prescription uploaded',
        time: '5 min ago',
        image: item.document_link,
      }));

      setQueriesData((prev) => ({
        ...prev,
        New: newQueries,
      }));
    } catch (error) {
      console.log(error, 'error')
    }
  }

  useEffect(() => {
    getNewQueriesData();
    fetchAgentData();

    const interval = setInterval(() => {
      getNewQueriesData();
      fetchAgentData();

    }, 30000);

    // cleanup on unmount
    return () => clearInterval(interval);
  }, []);


  const fetchAgentData = async () => {
    try {
      const response = await axios.get(
        // "http://74.225.157.233:9000/api/v1/agent/assigned-agent/e4fae93d-a67a-4d52-a396-4f4681b27c9d",
        "http://74.225.157.233:9000/api/v1/agent/assigned-agent/" + item.request_id,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
      const agentObj = {
        id: response.data.assigned_agent_id,
        title: "Assigned Agent",
        subtitle: "Agent assigned successfully",
        time: "Just now",
      };

      setQueriesData((prev) => ({
        ...prev,
        Completed: [agentObj],
      }));

    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.agentIcon}>
            <Image
              source={require('../../assets/images/userDImg.png')}
              style={styles.bellIcon}
            />
          </View>
          <Text style={styles.headerTitle}>Agent Dashboard</Text>
        </View>
        <View style={styles.notificationContainer}>
          <Image
            source={require('../../assets/images/bell.png')}
            style={styles.bellIcon}
          />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>9</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>New Queries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Responded</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {["New", "Pending", "Completed"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                activeFilter === tab && styles.activeFilterTab,
                tab === "Completed" && {
                  borderTopRightRadius: scale(10),
                  borderBottomRightRadius: scale(10),
                },
                tab === "New" && {
                  borderTopLeftRadius: scale(10),
                  borderBottomLeftRadius: scale(10),
                }
              ]}
              onPress={() => setActiveFilter(tab)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === tab && styles.activeFilterText
              ]}>
                {tab} ({queriesData[tab].length})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Query List */}
        <View style={styles.queryList}>
          {queries.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Data Not Found</Text>
            </View>
          ) : (queries.map((query, index) => (
            <View key={index} style={styles.queryCard}>
              <View style={styles.queryLeft}>
                <View style={styles.prescriptionIcon}>
                  <Image
                    src={query?.image || "https://chatbotai02.blob.core.windows.net/healthcare/7a733987-dd30-4c4b-82f1-f27e68a4f7d8_ea85fff4-87cc-4df5-a0d1-498be5c814cc.jpg"}
                    style={{ width: moderateScale(40), height: moderateScale(40), borderRadius: 8 }}
                    resizeMode="cover"
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  <View style={styles.queryInfo}>
                    <View style={styles.column}>
                      <Text style={styles.queryTitle}>{query.title}</Text>
                      <Text style={styles.querySubtitle}>{query.subtitle}</Text>
                    </View>
                    <Text style={styles.statusText}>{query.time}</Text>
                  </View>
                  <View style={styles.queryRight}>
                    {activeFilter === "New" && (
                      <>
                        <TouchableOpacity style={styles.AwaitOfferButton}>
                          <Text style={styles.AwaitingOfferText}>Awaiting Offer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sendOfferButton} onPress={() => navigation.navigate('Offer', { query })}>
                          <Text style={styles.sendOfferText}>Send Offer</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {activeFilter === "Pending" && (
                      <TouchableOpacity style={styles.AwaitOfferButton}>
                        <Text style={styles.AwaitingOfferText}>In Progress</Text>
                      </TouchableOpacity>
                    )}
                    {activeFilter === "Completed" && (
                      <TouchableOpacity style={styles.sendOfferButton} onPress={() => navigation.navigate('GenerateInvoice', { query })}>
                        <Text style={styles.sendOfferText}>Create Invoice</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Analytics Screen (placeholder)
const AnalyticsScreen = () => (
  <View style={styles.placeholderContainer}>
    <Icon name="analytics" size={moderateScale(48)} color="#666" />
    <Text style={styles.placeholderText}>Analytics</Text>
  </View>
);

// Profile Screen (placeholder)
const ProfileScreen = () => (
  <View style={styles.placeholderContainer}>
    <Icon name="person" size={moderateScale(48)} color="#666" />
    <Text style={styles.placeholderText}>Profile</Text>
  </View>
);

const DashboardTabs = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Analytics') {
            iconName = 'analytics';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.greenColor,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} navigation={navigation} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(18),
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentIcon: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(16),
    // backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontWeight: '600',
    color: Colors.greenColor,
  },
  notificationContainer: {
    position: 'relative',
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
  },
  notificationBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: '#ff6b6b',
    borderRadius: scale(12),
    minWidth: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  notificationText: {
    color: '#ffffff',
    fontSize: moderateScale(10),
    fontWeight: '700',
  },

  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    // backgroundColor: '#f9fafb'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(15),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(15),
    marginHorizontal: scale(5),
    borderRadius: scale(12),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: moderateScale(32),
    fontWeight: '700',
    color: Colors.greenColor,
    marginBottom: verticalScale(5),
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: '#4B5563',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(20),
    borderTopLeftRadius: scale(10),
    borderBottomLeftRadius: scale(10),
  },
  filterTab: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    backgroundColor: '#ffffff',
  },
  activeFilterTab: {
    backgroundColor: Colors.greenColor,
    borderTopLeftRadius: scale(10),
    borderBottomLeftRadius: scale(10),
  },
  filterText: {
    fontSize: moderateScale(12),
    color: '#4B5563',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  queryList: {
    marginBottom: verticalScale(20),
  },
  queryCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: scale(16),
    marginBottom: verticalScale(12),
    borderRadius: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  queryLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  prescriptionIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(8),
    // backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  queryInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    // backgroundColor: 'red'
  },
  column: {
    flexDirection: 'column',
  },
  queryTitle: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  querySubtitle: {
    fontSize: moderateScale(11),
    color: '#4B5563',
    marginBottom: verticalScale(4),
  },
  queryTime: {
    fontSize: moderateScale(10),
    color: '#4B5563',
  },
  queryRight: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  statusText: {
    fontSize: moderateScale(10),
    color: '#4B5563',
    marginBottom: verticalScale(8),
  },
  AwaitOfferButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(16),
  },
  sendOfferButton: {
    backgroundColor: Colors.greenColor,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(16),
  },
  sendOfferText: {
    color: '#ffffff',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  AwaitingOfferText: {
    color: '#4B5563',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  tabBar: {
    height: verticalScale(65),
    paddingBottom: verticalScale(5),
    paddingTop: verticalScale(5),
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  tabLabel: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  placeholderText: {
    fontSize: moderateScale(18),
    color: '#666',
    marginTop: verticalScale(12),
  },
  noDataContainer: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  noDataText: {
    fontSize: moderateScale(14),
    color: "#999",
    fontWeight: "600",
  },
});

export default DashboardTabs;