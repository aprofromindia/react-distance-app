// @flow

import React from 'react';
import { TextInput, ScrollView, StyleSheet } from 'react-native';

export default function GeoInput(props) {
  return (
    <ScrollView scrollEnabled={ false } style={ styles.scroll }>
      <TextInput keyboardType='numeric' style={ styles.input } {...props} ref={ props.inputRef } />
    </ScrollView>
    );
}

GeoInput.propTypes = {
  ...TextInput.propTypes
}

const styles = StyleSheet.create({
  input: {
    height: 40,
  },
  scroll: {
    flex: 1,
  }
});