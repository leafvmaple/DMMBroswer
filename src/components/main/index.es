import path from 'path-extra'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { get } from 'lodash'

import { GardenPanel } from './parts'

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
      return (
        <div className='main-panel-content'>
          <link rel="stylesheet" href={path.join(__dirname, 'assets', 'main.css')} />
        {
          (this.props.layout == 'horizontal' || this.props.doubleTabbed) ?
            <div className="panel-col main-area-horizontal">
              <div className="panel-col teitoku-panel-area">
                <GardenPanel />
              </div>
            </div>
          :
            <div className="panel-row main-area-vertical">
              <div className="panel-col left-area" style={{width: "60%"}}>
                <div className="panel-col teitoku-panel-area">
                  <GardenPanel />
                </div>
              </div>
            </div>
          }
        </div>
      )
    }
  })
}
