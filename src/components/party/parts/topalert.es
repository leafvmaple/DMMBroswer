import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import { Alert, OverlayTrigger, Tooltip } from 'react-bootstrap'

const {ROOT, i18n} = window
const __ = i18n.main.__.bind(i18n.main)

const getFontStyle = () => {
  if (window.isDarkTheme) {
    return {color: '#FFF'}
  } else {
    return {color: '#000'}
  }
}

export default connect(
  (state, {partyId}) => ({
    partyId: partyId,
  })
)(function TopAlert({partyId, isMini}) {
  return (
    <div style={{width: '100%'}}>
    {
      isMini ?
      <div style={{display: "flex", justifyContent: "space-around", width: '100%'}}>
        <span style={{flex: "none"}}>{'None'} </span>
        <span style={{flex: "none", marginLeft: 5}}>{__('Fighter Power')}: {'None'}</span>
        <span style={{flex: "none", marginLeft: 5}}>{__('LOS')}: {'None'}</span>
      </div>
      :
      <Alert style={getFontStyle()}>
        <div style={{display: "flex"}}>
          <span style={{flex: "1"}}>{'None'} </span>
          <span style={{flex: 1}}>{__('Total Lv')}. {'None'}</span>
          <span style={{flex: 1}}>
            <OverlayTrigger placement='bottom' overlay={
              <Tooltip id={`topalert-FP-fleet-${partyId}`}>
                <div>{__('Minimum FP')}: {'None'}</div>
                <div>{__('Maximum FP')}: {'None'}</div>
                <div>{__('Basic FP')}: {'None'}</div>
              </Tooltip>
            }>
              <span>{__('Fighter Power')}: {'None'}</span>
            </OverlayTrigger>
          </span>
          <span style={{flex: 1}}>
            <OverlayTrigger placement='bottom' overlay={
              <Tooltip id={`topalert-recon-fleet-${partyId}`} className='info-tooltip'>
                <div className='recon-title'>
                  <span>{__('Formula 33')}</span>
                </div>
                <div className='info-tooltip-entry'>
                  <span className='info-tooltip-item'>× 1</span>
                  <span>{'None'}</span>
                </div>
                <div className='info-tooltip-entry'>
                  <span className='info-tooltip-item'>{`× 3 (6-2 & 6-3)`}</span>
                  <span>{'None'}</span></div>
                <div className='info-tooltip-entry'>
                  <span className='info-tooltip-item'>{`× 4 (3-5 & 6-1)`}</span>
                  <span>{'None'}</span>
                </div>
                <div className='recon-title'>
                  <span>{__('Formula 2-5')}</span>
                </div>
                <div className='info-tooltip-entry'>
                  <span className='info-tooltip-item'>{__('Fall')}</span>
                  <span>{'None'}</span>
                </div>
                <div className='info-tooltip-entry'>
                  <span className='info-tooltip-item'>{__('Legacy')}</span>
                  <span>{'None'}</span>
                </div>
              </Tooltip>
            }>
              <span>{__('LOS')}: {'None'}</span>
            </OverlayTrigger>
          </span>
        </div>
      </Alert>
    }
    </div>
  )
})
