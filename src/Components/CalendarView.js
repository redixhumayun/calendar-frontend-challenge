import React, { Component } from 'react'
import './CalendarView.css'

export default class CalendarView extends Component {
  render() {
    const { appointmentCollection } = this.props
    return (
      <div className="calendar">
        {
          appointmentCollection.map((appointments) => {
            return appointments.map((appointment, index) => {
              console.log(appointment)
              return (
                <div 
                className="appointment"
                key={index}
                style={{
                  width: appointment.width,
                  height: appointment.height,
                  marginLeft: appointment.marginLeft,
                  marginTop: appointment.marginTop,
                  backgroundColor: 'blue'
                }}>
                </div>
              )
            })
          })
        }
      </div>
    )
  }
}