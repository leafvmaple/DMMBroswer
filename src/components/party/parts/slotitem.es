import classNames from 'classnames'
import { connect } from 'react-redux'
import React from 'react'
import { createSelector } from 'reselect'
import { OverlayTrigger, Tooltip, Label } from 'react-bootstrap'
import { memoize } from 'lodash'

import { characterDataSelectorFactory, characterEquipDataSelectorFactory } from 'scripts/utils/selectors'

function getBackgroundStyle() {
  return window.isDarkTheme ?
  {backgroundColor: 'rgba(33, 33, 33, 0.7)'}
  :
  {backgroundColor: 'rgba(256, 256, 256, 0.7)'}
}

const slotitemsDataSelectorFactory = memoize((characterId) =>
  createSelector([
    characterDataSelectorFactory(characterId),
    characterEquipDataSelectorFactory(characterId),
  ], (character, equipsData) => ({
    maxSlotCount: character.maxEquipmentSlotCount,
    equipsData,
  }))
)

export default connect(
  (state, { characterId }) =>
    slotitemsDataSelectorFactory(characterId)(state)
)(function Slotitem({maxSlotCount, equipsData=[]}) {
  console.log(equipsData)
  return (
    <div className="slotitem">
    {equipsData &&
      equipsData.map((equipData, equipIdx) => {
        console.log(equipIdx)
        return (
          <div key={equipIdx} className="slotitem-container">
            <span>
              <span className="slotitem-onslot" style={getBackgroundStyle()} >
                {equipData.characterEquipmentLevelNum}
              </span>
            </span>
          </div>
        )
      })
    }
    </div>
  )
})
