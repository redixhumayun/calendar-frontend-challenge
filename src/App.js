import React, { Component } from 'react';
import Calendar from './Containers/Calendar'
import ErrorBoundary from './Containers/ErrorBoundary'

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
  { start: '12:15', end: '15:30' },
  { start: '15:11', end: '20:00' },
  { start: '20:30', end: '21:00' }
]

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Calendar appointments={appointmentData3} start={'09:00'} duration={'12:00'} />
      </ErrorBoundary>
    )
  }
}

export default App;
