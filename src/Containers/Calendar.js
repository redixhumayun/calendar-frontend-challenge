import React, { Component } from 'react'
import CalendarView from '../Components/CalendarView'
import TimeLineView from '../Components/TimeLineView'
import './Calendar.css'

export default class Calendar extends Component {
  render() {
    const { appointments } = this.props
    const result = this.computeTimeClashes()
    console.log(result)
    return (
      <div className="container">
        <TimeLineView />
        <CalendarView appointments={appointments} />
      </div>
    )
  }

  computeTimeClashes() {
    const timeArray = this.createTimeArray()
    const { appointments } = this.props   
    console.log(appointments)
    // const appointmentsCopy = Object.assign({}, {...appointments}) 
    // for(let i = 1; i < appointmentsCopy.length; i++) {
    //   if (this.convertToMins(appointmentsCopy[i].start) < this.convertToMins(appointmentsCopy[i-1].end) ) {
    //     appointmentsCopy[i].clashes = 1
    //     appointmentsCopy[i-1].clashes = 1
    //   }
    // }
    // console.log(appointmentsCopy)
    // return appointmentsCopy
  }

  convertToMins(time) {
    const referenceTime = 9 * 60
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)/) || [time]
    if (time.length > 1) {
      time = time.slice(1);  // Remove full string match value
      let minsElapsed = +time[0] * 60 + (+time[2]) - referenceTime
      return minsElapsed
    }
  }

  /**
   * 
   * @param {Array} appointments 
   */
  getMinutesArray(appointments) {
    return appointments.reduce((acc, curr) => {
      const mins = this.minutesElapsed(curr)
      acc.push(...mins)
      return acc
    }, [])
  }

  /**
   * Find minutes elapsed since 09:00
   * @param {Object} appointmentObj
   * @return {Array}
   */
  minutesElapsed(appointmentObj) {
    const referenceTime = 9 * 60
    return Object.keys(appointmentObj).reduce((acc, key) => {
      let time = appointmentObj[key].toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)/) || [appointmentObj[key]]
      if (time.length > 1) {
        time = time.slice(1)
        let minsElapsed = +time[0] * 60 + (+time[2]) - referenceTime
        acc.push(minsElapsed)
      }
      return acc
    }, [])
  }

  createTimeArray() {
    const start = '09:00'
    const duration = '12:00'
    let current = +start.substr(0, 2) - 1
    let iterations = +duration.substr(0, 2)
    return new Array(iterations + 1).fill(0).map(() => {
      current += 1
      return current < 10 ? `0${current}:00` : `${current}:00`
    })
  }
}