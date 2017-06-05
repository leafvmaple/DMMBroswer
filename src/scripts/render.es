import React from 'react'
import ReactDOM from 'react-dom'

import { store } from './createstore'
import ControlledTabArea from './tabarea'

ReactDOM.render(
  <Provider store={store}>
    <ControlledTabArea />
  </Provider>,
  $('dmm-nav-tabs')
)
