import React, { Component } from 'react'
import CalendarView from '../Components/CalendarView'
import TimeLineView from '../Components/TimeLineView'
import './Calendar.css'

export default class Calendar extends Component {
  render() {
    const { appointments, start, duration } = this.props

    const computeAppointmentsPipe = pipe(this.computeTimeClashes, this.createSeparateArrays, this.calculateDimensions)
    const computeTimeLinePipe = pipe(this.createTimeArray, this.convertTo12HourFormat)

    //  Passing in the this namespace to allow for binding to correct context
    const appointmentCollection = computeAppointmentsPipe(appointments, this) 
    const timeLineCollection = computeTimeLinePipe({start, duration}, this)
    
    return (
      <div className="container">
        <TimeLineView timeLineCollection={timeLineCollection} />
        <CalendarView appointmentCollection={appointmentCollection} />
      </div>
    )
  }

  /**
   * TODO: This function is unnecessary. Leaving it in for reference
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
      }
    }
    return appointmentsCopy.map(appointment => {
      if (!appointment.clashes) {
        appointment.clashes = 0
      }
      return appointment
    })
  }

  /**
   * Separates the appointments into separate arrays based on those that clash together and those that don't
   * @param {Array} appointments
   * @return {Array} 
   */
  createSeparateArrays(appointments) {
    let collectionsArray = []
    let tempArray = []
    tempArray.push(appointments[0])
    for(let i = 1; i < appointments.length; i++) {
      if (this.convertToMinsElapsed(appointments[i].start) < this.convertToMinsElapsed(appointments[i-1].end)) {
        tempArray.push(appointments[i])
      } else {
        collectionsArray.push(tempArray)
        tempArray = []
        tempArray.push(appointments[i])
      }
    }

    //  If any remaining appointments are left in the tempArray, push it into collectionsArray
    //  Solves edge case where last appointment clashes
    if (tempArray.length > 0) {
      collectionsArray.push(tempArray)
    }
    return collectionsArray
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

  /**
   * Function to create an array containing the different hours required for display
   * @param {String} start 
   * @param {String} duration
   * @return {Array}
   */
  createTimeArray({start, duration}) {
    let current = +start.substr(0, 2) - 1
    let iterations = +duration.substr(0, 2)
    return new Array(iterations + 1).fill(0).map(() => {
      current += 1
      return current < 10 ? `0${current}:00` : `${current}:00`
    })
  }

  /**
   * Function to convert all the times in an array from 24-hour to 12-hour format
   * @param {Array} timeArray
   * @return {Array} 
   */
  convertTo12HourFormat(timeArray) {
    return timeArray.map((time) => {
      time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)/) || [time]
      if (time.length > 1) {
        time = time.slice(1);  // Remove full string match value
        time[3] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join('')
    })
  }
}

/**
 * A utility function defined to allow easy piping of function and results 
 * Need to hack the binding of this variable since its defined within a React class
 * @param {Function} fns 
 * @return {Array}
 */
const pipe = (...fns) => (result, that) => {
  let list = [...fns]
  while(list.length > 0) {
    result = list.shift().apply(that, [result])
  }
  return result
}