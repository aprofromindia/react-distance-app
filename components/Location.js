// @flow

import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Keyboard, Alert } from 'react-native';
import GeoInput from './GeoInput';

const pattern = /^([+-]?\d?\d\.?\d*),\s?([+-]?[0-1]?\d?\d\.?\d*)$/;

export default class Location extends PureComponent {

    state = {
        geoCoordinate1: '',
        geoCoordinate2: '',
        distance: 0,
        coordinateSet: new Set(), // list view todo
    }

    setGeoCoordinate1 = coord => this.setState({
        geoCoordinate1: coord
    });

    setGeoCoordinate2 = coord => this.setState({
        geoCoordinate2: coord
    });

    submitGeo1 = () => {
        if (this.validateInput(this.state.geoCoordinate1)) {
            this.setState({
                coordinateSet: new Set([...this.state.coordinateSet, this.state.geoCoordinate1]),
            })
            this.geoInput2.focus();
        } else {
            this.geoInput1.focus();
        }
    }

    submitGeo2 = () => {
        if (this.validateInput(this.state.geoCoordinate2)) {
            Keyboard.dismiss();
            this.setState({
                coordinateSet: new Set([...this.state.coordinateSet, this.state.geoCoordinate2]),
            });
            this.getDistance();
        }
    }

    validateInput = coord => {
        if (!pattern.test(coord)) {
            Alert.alert('Input error',
                'Please enter a valid lat, long (34.551, -100.11)',
                [{
                    text: 'Ok'
                }],
                {
                    cancelable: false
                }
            );
            return false;
        }
        return true;
    }

    getDistance = () => {
        const coord1 = this.getLatLong(this.state.geoCoordinate1);
        const coord2 = this.getLatLong(this.state.geoCoordinate2);
        const distance = this.calcDistance(coord1.lat, coord1.long, coord2.lat, coord2.long);
        this.setState({
            distance: distance.toFixed(2),
        });
    };

    getLatLong = coordString => {
        const match = coordString.split(',');
        const lat = Number(match[0]);
        const long = Number(match[1]);
        return {
            lat,
            long
        };
    }

    calcDistance = (lat1, long1, lat2, long2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(long2 - long1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    deg2rad = deg => deg * (Math.PI / 180);

    render() {
        return (
            <View style={ styles.container }>
              <GeoInput placeholder='20.553, 60.12 (Latitude, Longitude)' onChangeText={ this.setGeoCoordinate1 } value={ this.state.geoCoordinate1 } onSubmitEditing={ this.submitGeo1 } autoFocus={ true }
                accessible={ true } inputRef={ geoInput1 => this.geoInput1 = geoInput1 } />
              <GeoInput placeholder='34.551, 100.11 (Latitude, Longitude)' onChangeText={ this.setGeoCoordinate2 } value={ this.state.geoCoordinate2 } onSubmitEditing={ this.submitGeo2 } accessible={ true }
                inputRef={ geoInput2 => this.geoInput2 = geoInput2 } />
              <TouchableOpacity onPress={ this.submitGeo2 } style={ styles.button }>
                <Text>Calculate distance</Text>
              </TouchableOpacity>
              <View style={ styles.labelContainer } accessible={ true }>
                <Text style={ styles.label }>
                  { this.state.distance } kms.
                </Text>
              </View>
            </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        top: 40,
        flex: 1,
        margin: 5
    },
    button: {
        alignItems: 'center',
        height: 40,
        padding: 10,
        backgroundColor: 'powderblue',
    },
    labelContainer: {
        flex: 5,
        justifyContent: 'center',
    },
    label: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
