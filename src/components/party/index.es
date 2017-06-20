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

function getStyle(state, disabled) {
  if (state >= 0 && state <= 5 && !disabled)
    return ['success', 'warning', 'danger', 'info', 'primary', 'default'][state]
  else
    return 'default'
}

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
)(({partyId, activePartyId, onClick, disabled}) =>
  <Button
    bsSize="small"
    bsStyle='default'
    onClick={onClick}
    disabled={disabled}
  >
    {defaultPartyNames[partyId]}
  </Button>
)

const PartyCharactersView = connect(
  (state, {partyId}) => ({
    partyId: partyId,
    characters: get(state.info.parties, ['1', partyId + 1]),
  })
)(({partyId, characters}) => 
  <div>
    <div className='party-name'>
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
  
  constructor(props) {
    super(props)
    this.nowTime = 0
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
                partyId={i}
                disabled={i + 1 > this.props.partyCount}
                onClick={e => this.handleClick(i)}
                activePartyId={this.props.activePartyId}
                />
            )
          }
          </ButtonGroup>
        </div>
        <div className="no-scroll">
          <div
            className={classNames("character-tab-content", {'character-tab-content-transition': this.props.enableTransition})}
            style={{transform: `translateX(-${this.props.activePartyId}00%)`}}>
          {
            times(4).map(i =>
              <div className="character-deck" key={i}>
                <PartyCharactersView partyId={i} />
              </div>
            )
          }
          </div>
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
