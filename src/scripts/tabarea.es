import classNames from 'classnames'
import { connect } from 'react-redux'
import React, { Component, Children, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

import mainview from 'components/main'

const TabContentsUnion = connect(
  (state) => ({
    enableTransition: get(state.config, 'dmm.transition.enable', true),
  }),
  undefined,
  undefined,
  {pure: true, withRef: true}
)(class tabContentsUnion extends Component {
  static propTypes = {
    enableTransition: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    activeTab: PropTypes.string.isRequired,
  }
  activeKey = () => {
    return this.props.activeTab || (this.props.children[0] || {}).key
  }
  prevKey = () => {
    return this.prevTab || (this.props.children[0] || {}).key
  }
  render() {
    let onTheLeft = true
    const activeKey = this.activeKey()
    const prevKey = this.prevKey()
    return (
      <div className='dmm-tab-contents'>
      {
        Children.map(this.props.children, (child, index) => {
          if (child.key === activeKey)
            onTheLeft = false
          const positionLeft = child.key === activeKey ?  '0%'
            : onTheLeft ? '-100%' : '100%'
          const tabClassName = classNames("dmm-tab-child-positioner", {
            'dmm-tab-child-positioner-transition': (child.key === activeKey || child.key === prevKey) && this.props.enableTransition,
            'transparent': child.key !== activeKey,
          })
          return (
            <div className='dmm-tab-child-sizer'>
              <div className={tabClassName}
                style={{transform: `translateX(${positionLeft})`}}>
                {child}
              </div>
            </div>
          )
        })
      }
      </div>
    )
  }
})

export default connect(
  (state) => ({
    plugins: state.plugins,
    doubleTabbed: get(state.config, 'dmm.tabarea.double', false),
    useGridMenu: get(state.config, 'dmm.tabarea.grid', navigator.maxTouchPoints !== 0),
    activeMainTab: get(state.ui, 'activeMainTab', 'mainView'),
    activePluginName: get(state.ui, 'activePluginName', ''),
  }),
  undefined,
  undefined,
  {pure: true}
)(class ControlledTabArea extends PureComponent {
  render() {
    return !this.props.doubleTabbed ? (
      <div>
        <Nav bsStyle="tabs" activeKey={this.props.activeMainTab} id="top-nav" className="main">
          <NavItem key='mainView' eventKey='mainView'>
            {mainview.displayName}
          </NavItem>
        </Nav>
        <TabContentsUnion ref='tabKeyUnion' activeTab={this.props.activeMainTab}>
          <div id={mainview.name} className="poi-app-tabpane" key='mainView'>
            <mainview.reactClass />
          </div>
        </TabContentsUnion>
      </div>
      ) : (
      <div className='dmm-tabs-container'>
        <div className="no-scroll">
          <Nav bsStyle="tabs" activeKey={this.props.activeMainTab} onSelect={this.handleSelectTab} id='split-main-nav'>
            <NavItem key='mainView' eventKey='mainView'>
              {mainview.displayName}
            </NavItem>
          </Nav>
          <TabContentsUnion ref='tabKeyUnion'
            ref='mainTabKeyUnion'
            activeTab={this.props.activeMainTab}>
            <div id={mainview.name} className="dmm-app-tabpane" key='mainView'>
              <mainview.reactClass activeMainTab={this.props.activeMainTab} />
            </div>
          </TabContentsUnion>
        </div>
      </div>
  )}
})
