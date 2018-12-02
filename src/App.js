import React, { Component } from 'react';
import './App.css';
import Calendar from './Containers/Calendar'

const appointmentData = [
  { start: '09:45', end: '11:15' },
  { start: '18:10', end: '19:00' },
  { start: '18:30', end: '19:30' },
  { start: '19:05', end: '20:05' }
]

class App extends Component {
  render() {
    return <Calendar appointments={appointmentData} />
  }
}

export default App;
