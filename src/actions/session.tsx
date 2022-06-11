export const site_version = () => {};
export const setSDK = ({sdk, connection, address, blockchain}: any) => (
  dispatch: any
) => {
  dispatch({type: 'SET_SDK', payload: {sdk, address, connection, blockchain}});
};

export const setTab = (tab: any) => (dispatch: any) => {
  dispatch({type: 'SET_TAB', payload: tab});
};

export const setPortalContinuation = (portal_continuation: any) => (
  dispatch: any
) => {
  dispatch({type: 'SET_PORTAL_CONTINUATION', payload: portal_continuation});
};

export const setShowOptions = (showOptions: any) => (dispatch: any) => {
  dispatch({type: 'SET_SHOW_OPTIONS', payload: showOptions});
};
