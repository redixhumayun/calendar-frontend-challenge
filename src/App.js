import React, { Component } from 'react';
import './App.css';
import Calendar from './Containers/Calendar'

const appointmentData = [
  { start: '09:45', end: '11:15' },
  { start: '18:10', end: '19:00' },
  { start: '18:30', end: '19:30' },
  { start: '19:05', end: '20:05' },
]

const appointmentData2 = [
  { start: '09:45', end: '11:15' },
  { start: '11:00', end: '12:00' },
  { start: '18:10', end: '19:00' },
  { start: '18:30', end: '19:30' },
  { start: '19:05', end: '20:05' },
  { start: '20:30', end: '21:00' }
]

const appointmentData3 = [
  { start: '09:45', end: '11:15' },
  { start: '11:00', end: '12:00' },
  { start: '11:01', end: '13:15' },
  { start: '13:11', end: '15:30' },
  { start: '16:50', end: '20:00' },
  { start: '20:30', end: '21:00' }
]

class App extends Component {
  render() {
    return <Calendar appointments={appointmentData} start={'09:00'} duration={'12:00'} />
  }
}

export default App;
