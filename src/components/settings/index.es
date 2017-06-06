import path from 'path-extra'
import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { NetworkConfig } from './parts'

const {i18n} = window
const __ = i18n.setting.__.bind(i18n.setting)

export default {
  name: 'SettingsView',
  displayName: <span><FontAwesome name='cog' />{__(" Settings")}</span>,
  reactClass: class reactClass extends React.Component {
    shouldComponentUpdate = (nextProps, nextState) => (false)
    render() {
      return (
        <Tabs bsStyle="pills" defaultActiveKey={0} animation={false} justified id="settings-view-tabs">
          <link rel="stylesheet" href={path.join(__dirname, 'assets', 'settings.css')} />
          <Tab eventKey={2} title={__("Proxy")} className='dmm-settings-Tab'>
            <NetworkConfig />
          </Tab>
        </Tabs>
      )
    }
  },
}
