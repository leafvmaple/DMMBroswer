import {combineReducers} from 'redux'
import reduceReducers from 'reduce-reducers'
import { get, pick } from 'lodash'

import {reducer as basic} from './basic'
import {reducer as teams} from './teams'

export const reducer = reduceReducers(
  (state, action) => {
    return state
  },
  combineReducers({
    basic,
    teams,
  }),
)
