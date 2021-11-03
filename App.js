import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height, width: SCREEN_WIDTH } = Dimensions.get("window"); // 해당 핸드폰의 크기를 알려줌
const API_KEY = "638d325e3536c4f31ee70afe0830b65e";
const icons = {
  "Clouds": "cloudy",
  "Clear": "sunny",
  "Rain": "rainy"
}

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy:5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude }, 
      { useGoogleMaps: false }
    );
    setCity(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);
    };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>  
      <ScrollView  pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}> 
        {days.length === 0 ? (
        <View style={{...styles.day, alignItems: "center"}}>
          <ActivityIndicator color="white" size="large" />
        </View> 
        ) : ( 
          days.map((day, index) => (
          <View key={index} style={styles.day}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Ionicons name={icons[day.weather[0].main]} size={60} color="white" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
          </View>
          ))
        )}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  city: {
    flex: 1,
    justifyContent: "center", // 세로로 중앙
    alignItems: "center", // 가로로 중앙

  },
  cityName:{
    fontSize: 58,
    fontWeight: "500",
    color: "white"
  },
  weather:{
    
  },
  day:{
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20
  },
  temp:{
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
    color: "white"
  },
  description:{
    marginTop: -10,
    fontSize: 40,
    fontWeight: "500",
    color: "white"
  },
});
