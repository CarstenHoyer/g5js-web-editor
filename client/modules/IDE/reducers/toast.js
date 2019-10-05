import * as ActionTypes from '../../../constants';

const initialState = {
  isVisible: false,
  text: ''
};

const toast = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_TOAST:
      return { ...state, isVisible: true };
    case ActionTypes.HIDE_TOAST:
      return { ...state, isVisible: false };
    case ActionTypes.SET_TOAST_TEXT:
      return { ...state, text: action.text };
    default:
      return state;
  }
};

export default toast;
