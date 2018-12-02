import React, { Component } from 'react'
import CalendarView from '../Components/CalendarView'
import TimeLineView from '../Components/TimeLineView'
import './Calendar.css'

export default class Calendar extends Component {
  render() {
    const { appointments } = this.props
    const result = this.computeTimeClashes(appointments)
    const result2 = this.createSeparateArrays(result)
    const result3 = this.calculateDimensions(result2)
    return (
      <div className="container">
        <TimeLineView />
        <CalendarView appointmentCollection={result3} />
      </div>
    )
  }

  /**
   * This function will check the start of every object with the end of the prior object
   * Will update a clashes property within each object. 
   * @param {Array} appointments
   * @return {Array}
   */
  computeTimeClashes(appointments) {
    //  Create a deep copy of the array because mutating objects within the array will mutate
    //  the reference to the original prop
    const appointmentsCopy = appointments.map((appointment) => {
      return Object.assign({}, {...appointment})
    })

    //  Check if the current appointment starts before the previous one ends
    //  Create / update the clashes property accordingly
    for(let i = 1; i < appointmentsCopy.length; i++) {
      if (this.convertToMinsElapsed(appointmentsCopy[i].start) < this.convertToMinsElapsed(appointmentsCopy[i-1].end) ) {
        appointmentsCopy[i].clashes = 1
        appointmentsCopy[i-1].clashes = 1
      } else if(!appointmentsCopy[i].clashes && !appointments[i-1].clashes) {
        appointmentsCopy[i].clashes = 0
        appointmentsCopy[i-1].clashes = 0
      }
    }
    return appointmentsCopy
  }

  /**
   * This function will separate the appointments array of objects into 
   * multiple arrays of continuous appointment blocks. Any appointments that all have a clash in a sequence are separated. 
   * Standalone appointments with 0 clashes will be in a separate array
   * @param {Array} appointments 
   * @return {Array}
   */
  createSeparateArrays(appointments) {
    let collectionArr = []
    let tempArr = []
    appointments.map((appointment) => {
      if(appointment.clashes === 0) {
        collectionArr.push(tempArr)
        tempArr = []
        tempArr.push(appointment)
        collectionArr.push(tempArr)
        tempArr = []
      } else if(appointment.clashes === 1) {
        tempArr.push(appointment)
      }
    })
    collectionArr.push(tempArr)
    return collectionArr.filter(arr => arr.length > 0)
  }

  /**
   * Function to iterate over collection of appointments and add metadata about dimensions and positioning of each div
   * @param {Array} appointmentsCollection 
   * @return {Array}
   */
  calculateDimensions(appointmentsCollection) {
    return appointmentsCollection.map(appointments => {
      return appointments.map((appointment, index) => {
        appointment.width = 600 / appointments.length
        appointment.height = this.convertToMinsElapsed(appointment.end) - this.convertToMinsElapsed(appointment.start)
        appointment.marginLeft = appointment.width * index
        appointment.marginTop = this.convertToMinsElapsed(appointment.start)
        return appointment
      })
    })
  }

  /**
   * Converts 24-hour time format to number of minutes elapsed since 09:00
   * @param {String} time 
   * @return {Number}
   */
  convertToMinsElapsed(time) {
    const referenceTime = 9 * 60
    time = time.match(/^([01]\d|2[0-3])(:)([0-5]\d)/) || [time]
    if (time.length > 1) {
      time = time.slice(1);  // Remove full string match value
      let minsElapsed = +time[0] * 60 + (+time[2]) - referenceTime // Coerce string to numbers and calculate
      return minsElapsed
    }
  }
}