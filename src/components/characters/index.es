import { join } from 'path-extra'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Panel, Button, ButtonGroup, Alert } from 'react-bootstrap'
import { Tabs, Tab } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { get, memoize, times } from 'lodash'
import { createSelector } from 'reselect'
import { Characters } from './parts'

const {i18n} = window
const __ = i18n.setting.__.bind(i18n.setting)

/*const charactersViewSwitchButtonDataSelectorFactory = memoize((Id) =>
  createSelector([
    fleetNameSelectorFactory(fleetId),
    fleetStateSelectorFactory(fleetId),
  ], (fleetName, fleetState) => ({
    fleetState,
    fleetName,
  }))
)
const charactersViewSwitchButton = connect(
  (state, {fleetId}) =>
    charactersViewSwitchButtonDataSelectorFactory(fleetId)(state)
)(({fleetId, activeFleetId, fleetName, fleetState, onClick, disabled}) =>
  <Button
    bsSize="small"
    bsStyle={getStyle(fleetState, disabled)}
    onClick={onClick}
    disabled={disabled}
    className={fleetId == activeFleetId ? 'active' : ''}
  >
    {fleetName || defaultFleetNames[fleetId]}
  </Button>
)*/

const FleetShipView = connect(
  (state, {fleetId}) => {
    
  }
)(({fleetId, shipsId}) =>
  <div>
    <div className='fleet-name'>
      <TopAlert
        fleetId={fleetId}
        isMini={false}
      />
    </div>
    <div className="ship-details">
    {
      (shipsId || []).map((shipId, i) =>
        <ShipRow
          key={shipId}
          shipId={shipId}
          />
      )
    }
    </div>
  </div>
)

const charactersView = connect((state, props) => ({
  enableTransition: get(state, 'config.dmm.transition.enable', true),
  charactersCount: get(state, 'info.characters.length', 4),
  activeCharacterId: get(state, 'ui.activeCharacterId', 0),
})
)(class charactersView extends Component {
  static propTypes = {
    enableTransition: PropTypes.bool.isRequired,
    charactersCount: PropTypes.number.isRequired,
    activeCharacterId: PropTypes.number.isRequired,
  }
  
  handleClick = (idx) => {
    if (idx != this.props.activeCharacterId) {
      dispatch({
        type: '@@TabSwitch',
        tabInfo: {
          activeCharacterId: idx,
        },
      })
    }
  }
  
  changeMainView = () => {
    dispatch({
      type: '@@TabSwitch',
      tabInfo: {
        activeMainTab: 'mainView',
      },
    })
  }
  
  render() {
    return (
      <Panel onDoubleClick={this.changeMainView}>
      <link rel="stylesheet" href={join(__dirname, 'assets', 'characters.css')} />
        <div className="div-row">
          <ButtonGroup className='plane-button'>
          </ButtonGroup>
        </div>
      </Panel>
    )
  }
})

export default {
  name: 'CharactersView',
  displayName: <span><FontAwesome name='cog' />{__(" Characters")}</span>,
  reactClass: charactersView,
}
