import { join } from 'path-extra'
import { connect } from 'react-redux'
import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Panel, Button, ButtonGroup, Alert } from 'react-bootstrap'
import { Tabs, Tab } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { get, memoize, times } from 'lodash'
import { createSelector } from 'reselect'

import { TopAlert, Characters } from './parts'

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

const defaultPartyNames = ['I', 'II', 'III', 'IV']

const PartyViewSwitchButton = connect(
  (state, {partyId}) => ({
    partyId: partyId,
    //shipViewSwitchButtonDataSelectorFactory(partyId)(state)
  })
)(({partyId}) =>
  <Button
    bsSize="small"
  >
    {defaultPartyNames[partyId]}
  </Button>
)

const PartyCharactersView = connect(
  (state, {partyId}) => ({
    partyId: partyId,
  })
)(({partyId}) =>
  <div>
    <div className='fleet-name'>
      <TopAlert
        partyId={partyId}
        isMini={false}
      />
    </div>
  </div>
)

const PartyView = connect((state, props) => ({
  enableTransition: get(state, 'config.dmm.transition.enable', true),
  partyCount: get(state, 'info.characters.length', 4),
  activePartyId: get(state, 'ui.activePartyId', 0),
})
)(class PartyView extends Component {
  static propTypes = {
    enableTransition: PropTypes.bool.isRequired,
    partyCount: PropTypes.number.isRequired,
    activePartyId: PropTypes.number.isRequired,
  }
  
  handleClick = (idx) => {
    if (idx != this.props.activePartyId) {
      dispatch({
        type: '@@TabSwitch',
        tabInfo: {
          activePartyId: idx,
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
      <link rel="stylesheet" href={join(__dirname, 'assets', 'party.css')} />
        <div className="div-row">
          <ButtonGroup className="party-name-button">
          {
            times(4).map(i =>
              <PartyViewSwitchButton
                key={i}
                fleetId={i}
                disabled={i + 1 > this.props.partyCount}
                onClick={e => this.handleClick(i)}
                activePartyId={this.props.activePartyId}
                />
            )
          }
          </ButtonGroup>
        </div>
      </Panel>
    )
  }
})

export default {
  name: 'PartyView',
  displayName: <span><FontAwesome name='cog' />{__(" Party")}</span>,
  reactClass: PartyView,
}
