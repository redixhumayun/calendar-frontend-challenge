import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor() {
    super()
    this.state = {
      hasError: false,
      errorMsg: null
    }
  }

  componentDidCatch(error) {
    this.setState({
      hasError: true, 
      errorMsg: error.message
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1>{this.state.errorMsg}</h1>
      )
    }
    
    return this.props.children
  }
}