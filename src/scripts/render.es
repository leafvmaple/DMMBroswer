import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { store } from './createstore'
import ControlledTabArea from './tabarea'

const {EXROOT, $} = window

ReactDOM.render(
  <Provider store={store}>
    <ControlledTabArea />
  </Provider>,
  $('dmm-nav-tabs')
)
