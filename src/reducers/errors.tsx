const INITIAL_STATE = {
  errors: {},
};

export default function errors(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    default:
      return state;
  }
}
