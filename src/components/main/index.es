import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { get } from 'lodash'

const {i18n} = window
//const __ = i18n.main.__.bind(i18n.main)

export default {
  name: 'MainView',
  displayName: <span><FontAwesome name='home' />{' Overview'}</span>,
  reactClass: connect((state, props) => ({
    layout: get(state, 'config.dmm.layout', 'horizontal'),
    doubleTabbed: get(state, 'config.dmm.tabarea.double', false),
  }))(class reactClass extends Component {
    static propTypes = {
      layout: PropTypes.string.isRequired,
      doubleTabbed: PropTypes.bool.isRequired,
    }
    render() {
    }
  }
}
