import React from 'react'
import PropTypes from 'prop-types'

export default class Divider extends React.Component{
  static propTypes = {
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    onClick: PropTypes.func,
  }
  onClick = (e) => {
    if (this.props.onClick)
      this.props.onClick(e)
  }
  render() {
    return (
      <div className="divider" style={{cursor: 'default'}} onClick={this.onClick}>
        <h5>{this.props.text}</h5>
        <hr />
      </div>)
  }
}
