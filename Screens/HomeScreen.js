import React, { Component } from "react";
import { View, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import db from "../config";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      students: [],
      presentStudents: [],
      absentStudents: [],
      submitable: true,
      missingData: 0,
    };
  }

  componentDidMount = async () => {
    var classRef = await db.ref("/").on("value", (data) => {
      var allStudents = [];
      var class_a = data.val();
      console.log(class_a);
      for (var i in class_a) {
        allStudents.push(class_a[i]);
      }
      allStudents.sort(function (a, b) {
        return a.roll_no - b.roll_no;
      });
      this.setState({
        students: allStudents,
      });
    });
  };

  updateAttendence(roll_no, status) {
    var id = "";
    if (roll_no <= 9) {
      id = "0" + roll_no;
    } else {
      id = roll_no;
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = dd + "-" + mm + "-" + yyyy;
    var ref_path = id;
    var class_ref = db.ref(ref_path);
    class_ref.update({
      [today]: status,
    });

    var presentStudents = this.state.presentStudents;
    var absentStudents = this.state.absentStudents;

    if (status === "present") {
      if (absentStudents.includes(roll_no)) {
        var targetLocation = absentStudents.indexOf(roll_no);
        absentStudents.splice(targetLocation, 1);
        presentStudents.push(roll_no);
      } else if (presentStudents.includes(roll_no) === false) {
        presentStudents.push(roll_no);
      }
    }

    if (status === "absent") {
      if (presentStudents.includes(roll_no)) {
        var targetLocation = presentStudents.indexOf(roll_no);
        presentStudents.splice(targetLocation, 1);
        absentStudents.push(roll_no);
      } else if (absentStudents.includes(roll_no) === false) {
        absentStudents.push(roll_no);
      }
    }

    this.setState({
      students: this.state.students,
      presentStudents: presentStudents,
      absentStudents: absentStudents,
      submitable: this.state.submitable,
      missingData: this.state.missingData,
    });
  }

  submitForm() {
    var totalSubmitted =
      this.state.presentStudents.length + this.state.absentStudents.length;
    var expectedSubmissions = this.state.students.length;

    if (totalSubmitted === expectedSubmissions) {
      this.props.navigation.navigate("SummaryScreen", {
        absentStudents: this.state.absentStudents.length,
        presentStudents: this.state.presentStudents.length,
        totalPercent: this.state.presentStudents.length / expectedSubmissions,
      });
    } else {
      this.setState({
        students: this.state.students,
        presentStudents: this.state.presentStudents,
        absentStudents: this.state.absentStudents,
        submitable: false,
        missingData: expectedSubmissions - totalSubmitted,
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Attendance</Text>
        </View>

        {this.state.students.map((chunk, index) => {
          return (
            <View style={styles.studentData}>
              <Text style={styles.studentDataText}>
                {this.state.students[index]["roll_no"]}.
                {this.state.students[index]["name"]}
              </Text>

              {this.state.presentStudents.includes(
                this.state.students[index]["roll_no"]
              ) ? (
                //If Present
                <TouchableOpacity
                  style={[
                    styles.attendanceButton,
                    { right: 100, backgroundColor: "#94fa78" },
                  ]}
                  onPress={() => {
                    this.updateAttendence(
                      this.state.students[index]["roll_no"],
                      "present"
                    );
                  }}
                >
                  <Text style={styles.attendanceButtonText}>Present</Text>
                </TouchableOpacity>
              ) : (
                //If Not Present
                <TouchableOpacity
                  style={[styles.attendanceButton, { right: 100 }]}
                  onPress={() => {
                    this.updateAttendence(
                      this.state.students[index]["roll_no"],
                      "present"
                    );
                  }}
                >
                  <Text style={styles.attendanceButtonText}>Present</Text>
                </TouchableOpacity>
              )}

              {this.state.absentStudents.includes(
                this.state.students[index]["roll_no"]
              ) ? (
                //If Absent
                <TouchableOpacity
                  style={[
                    styles.attendanceButton,
                    { right: 10, backgroundColor: "#ff7369" },
                  ]}
                  onPress={() => {
                    this.updateAttendence(
                      this.state.students[index]["roll_no"],
                      "absent"
                    );
                  }}
                >
                  <Text style={styles.attendanceButtonText}>Absent</Text>
                </TouchableOpacity>
              ) : (
                //If Not Absent
                <TouchableOpacity
                  style={[styles.attendanceButton, { right: 10 }]}
                  onPress={() => {
                    this.updateAttendence(
                      this.state.students[index]["roll_no"],
                      "absent"
                    );
                  }}
                >
                  <Text style={styles.attendanceButtonText}>Absent</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {this.state.submitable === false && (
          <Text style={styles.error}>
            ERROR!{"\n"}You Have Not Submitted Data For {this.state.missingData}
            Students!
          </Text>
        )}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            this.submitForm();
          }}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
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
  studentData: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
  },
  studentDataText: {
    fontSize: 20,
  },
  attendanceButton: {
    position: "absolute",
    alignItems: "center",
    backgroundColor: "#ababab",
    borderWidth: 3,
    width: 75,
    transform: [{ translateY: -3 }],
  },
  attendanceButtonText: {
    fontSize: 20,
  },
  submitButton: {
    width: "70%",
    height: 50,
    backgroundColor: "#fdff73",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
    alignSelf: "center",
  },
  submitText: {
    fontSize: 20,
  },
  error: {
    color: "#a30000",
    textAlign: "center",
    margin: 10,
    fontSize: 20,
  },
});
