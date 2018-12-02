import React from 'react'
import './CalendarView.css'

export default function CalendarView(props) {
  const { appointmentCollection } = props
    return (
      <div className="calendar">
        {
          appointmentCollection.map((appointments) => {
            return appointments.map((appointment, index) => {
              return (
                <div 
                className="appointment"
                key={index}
                style={{
                  width: appointment.width,
                  height: appointment.height,
                  marginLeft: appointment.marginLeft,
                  marginTop: appointment.marginTop
                }}>
                  <text>Start Time: {appointment.start}</text>
                  <text>End Time: {appointment.end}</text>
                </div>
              )
            })
          })
        }
      </div>
    )
}