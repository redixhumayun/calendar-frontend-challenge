import React from 'react'
import './TimeLineView.css'

export default function TimeLine (props) {
  const { timeLineCollection } = props
  return (
    <div className="timelineview">
      {
        timeLineCollection.map((time, index) => {
          return (
            <div className={'time'} key={index}>
              {time}
            </div>
          )
        })
      }
    </div>
  )
}