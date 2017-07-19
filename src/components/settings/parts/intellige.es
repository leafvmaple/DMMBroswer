import { FormControl, FormGroup, ControlLabel, Checkbox, Grid, Col, Button, Alert, Collapse } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import React from 'react'
import { get } from 'lodash'
import { battleClick } from 'lib/event'

const {config, i18n, toggleModal} = window
const __ = i18n.setting.__.bind(i18n.setting)
const {Component} = React

const basic = {
  battle: false,
}

const IntelligeConfig = connect(() => (
  (state, props) => {
    const ret = {
      state: get(state, 'config.intellige') || {}
    }
    for (const key of Object.keys(basic)) {
      if (ret.state[key] === undefined) {
        ret.state[key] = basic[key]
      }
    }
    ret.status = {
      fighting: get(state, 'battle.fighting') || false
    }
    return ret
  }
))(class IntelligeConfig extends Component {
  constructor(props) {
    super(props)
    this.state = Object.clone(props.state)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.status.fighting != this.props.status.fighting) {
      battleClick(this.state.battle && nextProps.status.fighting)
    }
  }
  handleSaveConfig = (e) => {
    const intellige = Object.clone(this.state)
    config.set('intellige', intellige)
    //toggleModal(__('Proxy setting'), __('Success! It will be available after a restart.'))
  }
  handleSetBattle = (e) => {
    const intelligeBattle = !this.state.battle
    this.setState({
      battle: intelligeBattle,
    })
    config.set('intellige.battle', intelligeBattle)
    battleClick(intelligeBattle && this.props.status.fighting)
  }
  render() {
    return (
      <form>
        <Grid>
          <Col xs={12}>
            <Checkbox checked={this.state.battle} onChange={this.handleSetBattle}>{__("Allow intellige battle")}</Checkbox>
          </Col>
        </Grid>
        <Grid>
          <Col xs={12}>
            <Button bsStyle="success" onClick={this.handleSaveConfig} style={{width: '100%'}}>{__('Save')}</Button>
          </Col>
        </Grid>
      </form>
    )
  }
})

export default IntelligeConfig
