import React, { Component } from 'react'
import CalendarView from '../Components/CalendarView'
import TimeLineView from '../Components/TimeLineView'
import './Calendar.css'

export default class Calendar extends Component {
  render() {
    const { appointments, start, duration } = this.props

    if (!appointments || !start || !duration) {
      throw new Error('Correct props not supplied!')
    }

    const computeAppointmentsPipe = pipe(this.createSeparateArrays, this.calculateDimensions, this.removeDuplicates, this.calculateLeftMargin)
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
   * Function to separate appointments array into separate arrays based on clashes.
   * Will return an array with duplicate appointments
   * @param {Array} appointments 
   * @return {Array}
   */
  createSeparateArrays(appointments) {
    let collectionsArray = []
    let tempArray = []
    for(let i = 0; i < appointments.length; i++) {
      tempArray.push(appointments[i])
      const result = this.getClashes(appointments, i, tempArray)
      collectionsArray.push(result)
      tempArray = []
    }
    return collectionsArray
  }

  /**
   * Function to calculate which appointments clash together. 
   * Takes each appointment and checks which appointments it clashes with
   * @param {Array} appointments 
   * @param {Number} index 
   * @param {Array} tempArray 
   * @return {Array}
   */
  getClashes(appointments, index, tempArray) {
    const appointmentsRef = appointments[index]
    const appointmentsRefMinsElapsed = this.convertToMinsElapsed(appointmentsRef.end)
    for(let i = index + 1; i < appointments.length; i++) {
      if (this.convertToMinsElapsed(appointments[i].start) < appointmentsRefMinsElapsed) {
        tempArray.push(appointments[i])
      }
    }
    return tempArray
  }

  /**
   * Function to iterate over collection of appointments and add metadata about dimensions and positioning of each div
   * Will not calculate left margin. Left margin will be calculated after removing duplicates
   * @param {Array} appointmentsCollection 
   * @return {Array}
   */
  calculateDimensions(appointmentsCollection) {
    appointmentsCollection.map((appointments) => {
      return appointments.map((appointment, i) => {
        //  Implies that this is a fresh block with no appointment having any clashes
        if (i === 0 && !appointment.computed) {
          this.computeEntireBlock(appointments)
        } else if (i === 0 && appointment.computed) {
        //  Implies that there is atleast one appointment that clashes. Calculate based on the clash
          this.computeBasedOnFirstAppointment(appointments)
        }
        return appointment
      })
    })
    return appointmentsCollection
  }

  /**
   * Function called when the first appointment in an array has not been computed previously
   * Implies that this new block has no clashes with any previous blocks
   * @param {Array} appointments 
   * @return {Array}
   */
  computeEntireBlock(appointments) {
    return appointments.map((appointment) => {
      if (!appointment.computed) {
        appointment.width = 600 / appointments.length
        appointment.height = this.convertToMinsElapsed(appointment.end) - this.convertToMinsElapsed(appointment.start)
        appointment.marginTop = this.convertToMinsElapsed(appointment.start)
        appointment.computed = true
        return appointment
      }
      return appointment
    })
  }

  /**
   * Function called when the first appointment in an array has been previously computed
   * Implies that this new block has clashes with a previous block
   * @param {Array} appointments 
   * @return {Array}
   */
  computeBasedOnFirstAppointment(appointments) {
    let blockWidth = 0 // use this variable to sum up witdth of all other appoinments in the block
    for(let i = 0; i < appointments.length; i++) {
      if (!appointments[i].computed) {
        appointments[i].width = 600 - blockWidth
        appointments[i].height = this.convertToMinsElapsed(appointments[i].end) - this.convertToMinsElapsed(appointments[i].start)
        appointments[i].marginTop = this.convertToMinsElapsed(appointments[i].start)
        appointments[i].computed = true
      }
      blockWidth += appointments[i].width
    }
    return appointments
  }

  /**
   * Function to remove any of the duplicated appointments that were calculated by getClashes
   * Removes duplicates by using a Set and checking against the Set for each new appointment object
   * @param {Array} appointmentsCollection
   * @return {Array}
   */
  removeDuplicates(appointmentsCollection) {
    const duplicateSet = new Set()
    return appointmentsCollection.map((appointments) => {
      return appointments.map((appointment) => {
        if (!duplicateSet.has(appointment)) {
          duplicateSet.add(appointment)
          return appointment
        } else {
          //  explicitly returning undefined to prevent any uncertainty around return value
          return undefined
        }
      }).filter(appointment => appointment) //  remove all undefined values for appointments
    }).filter(appointments => appointments.length > 0)  //  remove all appointments arrays that are empty now
  }

  /**
   * Function to calculate the left margin for each appointment div
   * Calculates left margin by using a blockWidth variable which is reset to 0 
   * when it reaches 600 or a 600 width appointment is encountered
   * @param {Array} appointmentsCollection
   * @return {Array} 
   */
  calculateLeftMargin(appointmentsCollection) {
    let blockWidth = 0
    return appointmentsCollection.map((appointments) => {
      return appointments.map((appointment) => {
        if (blockWidth >= 600 || appointment.width === 600) { //  blockWidth needs to be reset if these conditions are met
          blockWidth = 0
        }
        appointment.marginLeft = blockWidth
        blockWidth += appointment.width 
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