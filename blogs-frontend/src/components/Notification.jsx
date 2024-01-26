// Notification.js
import React from 'react'

const Notification = ({ message }) => {
  console.log('Notification Component - Received message:', message)
  if (message === null) {
    return null
  }

  return (
    <div className={message.includes('Error')? 'error': 'success'}>
      {message}
    </div>
  )
}

export default Notification