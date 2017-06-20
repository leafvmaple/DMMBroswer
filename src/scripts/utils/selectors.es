import memoize from 'fast-memoize'
import { get, map, zip } from 'lodash'
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'

function deepCompareArray(currentVal, previousVal) {
  if (currentVal === previousVal)
    return true
  if (Array.isArray(currentVal) && Array.isArray(previousVal)
    && currentVal.length === previousVal.length) {
    return zip(currentVal, previousVal).every(([a, b]) => a === b)
  } else {
    return false
  }
}

export const createDeepCompareArraySelector = createSelectorCreator(
  defaultMemoize,
  deepCompareArray
)


function arrayResultWrapper(selector) {
  return createDeepCompareArraySelector(selector, (result) => result)
}

export const stateSelector = (state) => state

export const basicSelector = (state) => state.info.basic
export const charactersSelector = (state) => state.info.characters
export const configSelector = (state) => state.config

export const formSelectorFactory = memoize((formId) =>
  (state) => (state.info.parties || [])[formId]
)

export const partySelectorFactory = memoize((partyId) =>
  createSelector(formSelectorFactory(1), (form) => (form || [])[partyId + 1])
)

export const partyCharactersIdSelectorFactory = memoize((partyId) =>
  arrayResultWrapper(createSelector(partySelectorFactory(partyId), (party) => {
    if (party == null)
      return
    return party.map((character) => character.userCharacterId)
  }))
)

export const characterInPartySelectorFactory = memoize((charaterId) =>
  createSelector(charactersSelector, (charactersStatus) => charactersStatus[charaterId])
)

const characterDataSelectorFactory = memoize((characterId) =>
  createSelector([
    charactersSelector,
  ], (characters) => 
    characters && typeof characterId === 'number' && characterId
    ? characters[characterId]
    : undefined
  )
)

export const partyCharactersDataSelectorFactory = memoize((partyId) =>
  arrayResultWrapper(createSelector([
    stateSelector,
    partyCharactersIdSelectorFactory(partyId),
  ], (state, partyCharactersId) => 
    !partyCharactersId ? undefined :
    partyCharactersId.map((characterId) => characterDataSelectorFactory(characterId)(state))
  ))
)
