import { FormControl, FormGroup, ControlLabel, Checkbox, Grid, Col, Button, Alert, Collapse } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import React from 'react'
import { get } from 'lodash'
import { ipcMain } from 'electron'
import { battleClick } from 'lib/event'

const {config, i18n, toggleModal} = window
const __ = i18n.setting.__.bind(i18n.setting)
const {Component} = React

const basic = {
  battle: false,
}

const IntelligeConfig = connect(() => (
  (state, props) => {
  	const ret = get(state, 'config.intellige') || {}
    for (const key of Object.keys(basic)) {
      if (ret[key] === undefined) {
        ret[key] = basic[key]
      }
    }
    return ret
  }
))(class IntelligeConfig extends Component {
  constructor(props) {
    super(props)
    this.state = Object.clone(props)
    //battleClick(this.state.battle)
  }
  handleSaveConfig = (e) => {
    const intellige = Object.clone(this.state)
    config.set('intellige', intellige)
    //toggleModal(__('Proxy setting'), __('Success! It will be available after a restart.'))
  }
  handleSetBattle = (e) => {
    this.setState({
      battle: !this.state.battle,
    })
    config.set('intellige.battle', !this.state.battle)
    battleClick(!this.state.battle)
    //ipcMain.send('MouseClick', !this.state.battle)
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
