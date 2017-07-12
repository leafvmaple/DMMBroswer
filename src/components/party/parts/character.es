import { connect } from 'react-redux'
import React, { Component } from 'react'
import { ProgressBar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createSelector } from 'reselect'
import { memoize } from 'lodash'
import FontAwesome from 'react-fontawesome'

import Slotitem from './slotitem'

const { i18n } = window
const __ = i18n.main.__.bind(i18n.main)

import { characterDataSelectorFactory } from 'scripts/utils/selectors'

const characterRowDataSelectorFactory = memoize((characterId) =>
  createSelector([
    characterDataSelectorFactory(characterId),
  ], (character) => ({
    character: character || {},
  }))
)
export const Character = connect(
  (state, {characterId}) =>
    characterRowDataSelectorFactory(characterId)(state)
)(class Character extends Component {
  static propTypes = {
    character: PropTypes.object,
  }

  render() {
    const {characterId, character} = this.props
    return (
      <div className="character-item">
        <div className="character-tile">
          <div className="character-basic-item">
            <div className="character-info">
              <div className="character-basic">
                <span className="character-lv">
                  Lv. {character.characterLevelNum || '??'}
                </span>
                <span className='character-type'>
                  {'None'}
                </span>
                <span className="character-country">
                  {'None'}
                </span>
              </div>
              <span className="character-name">
                {character.characterId}
              </span>
              <span className="character-exp">
                Next. {character.characterLevelExperience || 0}
              </span>
            </div>
            <div className="character-stat">
              <div className="div-row">
                <span className="character-hp">
                  {'100'} / {'100'}
                </span>
                <div className="status-cond">
                  <span className={"character-cond"}>
                    <FontAwesome name='star' />{'None'}
                  </span>
                </div>
              </div>
              <span className="hp-progress top-space">
                <ProgressBar now={100} />
              </span>
            </div>
          </div>
        </div>
        <div className="character-slot">
          <Slotitem characterId={characterId} />
        </div>
      </div>
    )
  }
})

export default Character
