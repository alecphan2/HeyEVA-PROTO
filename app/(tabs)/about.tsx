import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Switch } from 'react-native';

export default function AboutScreen() {
  const [isLightTheme, setIsLightTheme] = useState(false); // State to manage theme

  // Toggle theme function
  const toggleTheme = (value) => {
    setIsLightTheme(value);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isLightTheme ? '#fff' : '#172957' }, // Dynamic background color
      ]}
    >
      {/* Slider Button */}
      <View style={styles.topContainer}>
        <Switch
          value={isLightTheme}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }} // Custom track colors
          thumbColor={isLightTheme ? '#f5dd4b' : '#f4f3f4'} // Custom thumb color
        />
      </View>

      {/* Top content */}
      <View style={styles.topContainer}>
        <Text
          style={[
            styles.text,
            { color: isLightTheme ? '#000' : '#fff' }, // Dynamic text color
          ]}
        >
          About Shubh's Foreskin
        </Text>
      </View>

      {/* Middle content */}
      <View style={styles.middleContainer}>
        <View style={styles.row}>
          {/* First Image and Caption */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://teckes.com/wp-content/uploads/2024/05/IMG_1946-2-768x768.jpg',
              }}
              style={styles.image}
            />
            <Text
              style={[
                styles.caption,
                { color: isLightTheme ? '#000' : '#fff' }, // Dynamic text color
              ]}
            >
              Shoob
            </Text>
          </View>

          {/* Second Image and Caption */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://launch.tamu.edu/getattachment/e5f20a09-31cf-4b43-9bf1-28203c27d095/Journal-of-Law-and-Society-Headshots-(10).png?lang=en-US&ext=.png',
              }}
              style={styles.image}
            />
            <Text
              style={[
                styles.caption,
                { color: isLightTheme ? '#000' : '#fff' }, // Dynamic text color
              ]}
            >
              Nibarbary Coast
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  middleContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row', // Arrange images side-by-side
    justifyContent: 'space-around', // Space out the images evenly
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center', // Center-align images and captions
  },
  image: {
    width: 100, // Adjust image width
    height: 100, // Adjust image height
    marginBottom: 5, // Space between image and caption
    borderRadius: 10, // Optional: Rounded corners
  },
  text: {
    fontSize: 18,
    marginTop: 10,
  },
  caption: {
    fontSize: 14,
    textAlign: 'center',
  },
});
