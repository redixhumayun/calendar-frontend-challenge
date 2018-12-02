import React, { Component } from 'react'
import './TimeLineView.css'

export default class TimeLine extends Component {
  constructor() {
    super()
    this.state = {
      start: '09:00',
      duration: '12:00',
      timeArray: []
    }
  }

  render() {
    const { timeArray } = this.state
    return (
      <div className="timelineview">
        {
          timeArray.length > 0 ? (
            timeArray.map((time, index) => {
              return (
                <div className={'time'} key={index}>
                  {time}
                </div>
              )
            })
          ) : (null)
        }
      </div>
    )
  }

  createTimeArray() {
    const { start, duration } = this.state
    let current = +start.substr(0, 2) - 1
    let iterations = +duration.substr(0, 2)
    let times = new Array(iterations + 1).fill(0).map(() => {
      current += 1
      return current < 10 ? `0${current}:00` : `${current}:00`
    })
    this.convertTo12HourFormat(times)
  }

  convertTo12HourFormat(timeArray) {
    let newTimeArray = timeArray.map((time) => {
      time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)/) || [time]
      if (time.length > 1) {
        time = time.slice(1);  // Remove full string match value
        time[3] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join('')
    })
    this.setState({
      timeArray: newTimeArray
    })
  }

  componentDidMount() {
    this.createTimeArray()
  }
} 