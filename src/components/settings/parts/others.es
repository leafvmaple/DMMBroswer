import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Col, Row } from 'react-bootstrap'
import Divider from './divider'
const {ROOT, DMM_VERSION, CONST, i18n, config} = window
const __ = i18n.setting.__.bind(i18n.setting)

const Others = connect(state => ({
  
}))(class others extends Component {
  render() {
    return (
      <div id='dmm-others'>
        <Grid>
          <Row>
            <Col xs={6}>
              <Divider text={`${__("Current version")}: ${DMM_VERSION}`} />
            </Col>
          </Row>
        </Grid>
        <Grid>
          <Col xs={12}>
            <p>{__("dmm-description %s", process.versions.electron)}</p>
            <p>GitHub：<a href='https://github.com/leafvmaple/DMMBroswer'> https://github.com/leafvmaple/DMMBroswer </a></p>
          </Col>
        </Grid>
      </div>
  	)
  }
})

export default Others