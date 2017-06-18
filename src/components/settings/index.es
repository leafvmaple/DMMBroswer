import path from 'path-extra'
import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { IntelligeConfig, NetworkConfig, Others } from './parts'

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
          <link rel="stylesheet" href={path.join(global.ROOT, 'assets', 'css', 'settings.css')} />
          <Tab eventKey={1} title={__("Intellige")} className='dmm-settings-Tab'>
            <IntelligeConfig />
          </Tab>
          <Tab eventKey={2} title={__("Proxy")} className='dmm-settings-Tab'>
            <NetworkConfig />
          </Tab>
          <Tab eventKey={-1} title={__("About")} className='dmm-settings-Tab'>
            <Others />
          </Tab>
        </Tabs>
      )
    }
  },
}
