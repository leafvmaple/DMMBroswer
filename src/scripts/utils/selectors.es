import { get, map, zip } from 'lodash'
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'

export const basicSelector = (state) => state.info.basic
export const configSelector = (state) => state.config
