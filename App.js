import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AnimatedHamburger from './src/AnimatedHamburger';


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <AnimatedHamburger/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
