import { connect } from 'react-redux'
import { Panel, OverlayTrigger, Tooltip, Label } from 'react-bootstrap'
import React, { Component } from 'react'
import { createSelector } from 'reselect'
import { get, map } from 'lodash'
import { configSelector, basicSelector } from 'scripts/utils/selectors'

export default connect(
  (state) => ({
  })
)(function TeitokuPanel({}) {
  const level = 5
  const nickname = '花骑士'
  const rankName = '大神'
  const rank = 35
  return (
    <Panel bsStyle="default" className="teitoku-panel">
    {
      level >= 0 ?
      <div>
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="teitoku-exp" className='info-tooltip'></Tooltip>}>
          <span>{`Lv. ${level}　`}
            <span className="nickname">{nickname}</span>
            <span id="user-rank">{`　[${rankName[rank]}]　`}</span>
          </span>
        </OverlayTrigger>
        <span>{'Ships: '}</span>
        <span className=''>{0} / {0}</span>
        <span style={{marginLeft: '1em'}}>{'Equip.: '}</span>
        <span className=''>{0} / {0}</span>
      </div>
    :
      <div>{`${'Garden [Not logged in]'}　${"Ships: "}：? / ?　${"Equip.: "}：? / ?`}</div>
    }
    </Panel>
  )
})
