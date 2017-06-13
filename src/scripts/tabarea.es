import classNames from 'classnames'
import { connect } from 'react-redux'
import React, { Component, Children, PureComponent } from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { get } from 'lodash'
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

import mainview from 'components/main'
import settings from 'components/settings'
import characters from 'components/characters'

const {i18n, dbg, dispatch, config} = window

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
  findChildByKey = (children, key) => {
    return Children.map(children,
      (child) => child.key === key ? child : null).filter(Boolean)[0]
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
    doubleTabbed: get(state.config, 'dmm.tabarea.double', false),
    useGridMenu: get(state.config, 'dmm.tabarea.grid', navigator.maxTouchPoints !== 0),
    activeMainTab: get(state.ui, 'activeMainTab', 'mainView'),
  }),
  undefined,
  undefined,
  {pure: true}
)(class ControlledTabArea extends PureComponent {
  static propTypes = {
    doubleTabbed: PropTypes.bool.isRequired,
    useGridMenu: PropTypes.bool.isRequired,
    activeMainTab: PropTypes.string.isRequired,
  }
  dispatchTabChangeEvent = (tabInfo) =>
    dispatch({
      type: '@@TabSwitch',
      tabInfo,
    })
  selectTab = (key) => {
    if (key == null)
      return
    let tabInfo = {}
    const mainTabKeyUnion = this.props.doubleTabbed ? this.refs.mainTabKeyUnion : this.refs.tabKeyUnion
    const mainTabInstance = mainTabKeyUnion.getWrappedInstance()
    if (mainTabInstance.findChildByKey(mainTabInstance.props.children, key)) {
      tabInfo = {
        ...tabInfo,
        activeMainTab: key,
      }
    }
    this.dispatchTabChangeEvent(tabInfo)
  }
  handleSelectTab = (key) => {
    this.selectTab(key)
  }
  render() {
    const navClass = classNames({
      'grid-menu': this.props.useGridMenu,
    })
    return !this.props.doubleTabbed ? (
      <div>
        <Nav bsStyle="tabs" activeKey={this.props.activeMainTab} id="top-nav" className={navClass}
          onSelect={this.handleSelectTab}>
          <NavItem key='mainView' eventKey='mainView'>
            {mainview.displayName}
          </NavItem>
          <NavItem key='characters' eventKey='characters'>
            {characters.displayName}
          </NavItem>
          <NavItem key='settings' eventKey='settings'>
            {settings.displayName}
          </NavItem>
        </Nav>
        <TabContentsUnion ref='tabKeyUnion' activeTab={this.props.activeMainTab}>
          <div id={mainview.name} className="dmm-app-tabpane" key='mainView'>
            <mainview.reactClass />
          </div>
          <div id={characters.name} className="dmm-app-tabpane" key='characters'>
            <characters.reactClass />
          </div>
          <div id={settings.name} className="dmm-app-tabpane" key='settings'>
            <settings.reactClass />
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
            <NavItem key='characters' eventKey='characters'>
              {characters.displayName}
            </NavItem>
            <NavItem key='settings' eventKey='settings'>
              {settings.displayName}
            </NavItem>
          </Nav>
          <TabContentsUnion ref='tabKeyUnion'
            ref='mainTabKeyUnion'
            activeTab={this.props.activeMainTab}>
            <div id={mainview.name} className="dmm-app-tabpane" key='mainView'>
              <mainview.reactClass activeMainTab={this.props.activeMainTab} />
            </div>
            <div id={characters.name} className="dmm-app-tabpane" key='characters'>
              <characters.reactClass />
            </div>
            <div id={settings.name} className="dmm-app-tabpane" key='settings'>
              <settings.reactClass activeMainTab={this.props.activeMainTab}/>
            </div>
          </TabContentsUnion>
        </div>
      </div>
  )}
})
