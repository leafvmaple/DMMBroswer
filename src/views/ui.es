const initState = {
  activeMainTab: 'mainView',
  activePluginName: '',
  activeFleetId: 0,
};

export default function reducer(state = initState, { type, tabInfo }) {
  switch (type) {
    case '@@TabSwitch': {
      return {
        ...state,
        ...tabInfo,
      }; }
    default:
      return state;
  }
}
