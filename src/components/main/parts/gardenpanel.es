import { connect } from 'react-redux'
import { Panel, OverlayTrigger, Tooltip, Label } from 'react-bootstrap'
import React, { Component } from 'react'
import { createSelector } from 'reselect'
import { get, map } from 'lodash'
import { configSelector, basicSelector } from 'scripts/utils/selectors'

const { i18n } = window
const __ = i18n.main.__.bind(i18n.main)

export default connect(
  (state) => ({
    level: get(state.info.basic, 'levelId', 0),
    nickname: get(state.info.basic, 'nickname', ''),
    levelExperience: get(state.info.basic, 'levelExperience', 0),
    curCharacter: get(state.info.characters.count, '0', 0),
    maxCharacter: get(state.info.basic, 'maxCharacterBox', 0),
    curEquipment: Object.keys(state.info.equips).length,
    maxEquipment: get(state.info.basic, 'maxCharacterEquipmentBox', 0),
    battlePoint: get(state.info.basic, 'battlePoint', 0),
  })
)(function TeitokuPanel({level, nickname, levelExperience, curCharacter, maxCharacter, curEquipment, maxEquipment, battlePoint}) {
  return (
    <Panel bsStyle="default" className="teitoku-panel">
    {
      level >= 0 ?
      <div>
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="teitoku-exp" className='info-tooltip'></Tooltip>}>
          <span>{`Lv. ${level}　`}
            <span className="nickname">{`${nickname}　`}</span>
          </span>
        </OverlayTrigger>
        <span>{__('Flower: ')}</span>
        <span className=''>{curCharacter} / {maxCharacter}</span>
        <span style={{marginLeft: '1em'}}>{__('Equip.: ')}</span>
        <span className=''>{curEquipment} / {maxEquipment}</span>
      </div>
    :
      <div>{`${__('Garden [Not logged in]')}　${__("Flower: ")}：? / ?　${__("Equip.: ")}：? / ?`}</div>
    }
    </Panel>
  )
})
