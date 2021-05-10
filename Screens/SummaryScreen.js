import React, { Component } from "react";
import { View, Button, Text, StyleSheet } from "react-native";

export default class SummaryScreen extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Summary</Text>
        </View>

        <View>
          <View style={styles.stats}>
            <Text style={styles.statText}>Today You Had...</Text>

            <Text style={styles.numberText}>
              {this.props.navigation.getParam("presentStudents")}
            </Text>

            <Text style={styles.statText}>Present Students</Text>
          </View>

          <View style={styles.stats}>
            <Text style={styles.statText}>You Also Had...</Text>

            <Text style={styles.numberText}>
              {this.props.navigation.getParam("absentStudents")}
            </Text>

            <Text style={styles.statText}>Absent Students</Text>
          </View>

          <View style={styles.stats}>
            <Text style={styles.statText}>This means</Text>

            <Text style={styles.numberText}>
              {(this.props.navigation.getParam("totalPercent") * 100).toFixed(
                2
              )}
              %
            </Text>

            <Text style={styles.statText}>Of Your Students Were Here!</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffd06b",
    height: "100%",
  },
  header: {
    width: "100%",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  headerText: {
    color: "white",
    fontSize: 30,
    marginTop: "7%",
  },
  stats: {
    alignItems: "center",
    textAlign: "center",
    display: "flex",

    margin: 10,
  },
  statText: {
    fontSize: 24,
  },
  numberText: {
    fontSize: 32,
  },
});
