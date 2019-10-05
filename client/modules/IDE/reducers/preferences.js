import * as ActionTypes from '../../../constants';

const initialState = {
  fontSize: 18,
  autosave: true,
  linewrap: true,
  lineNumbers: true,
  lintWarning: false,
  textOutput: false,
  gridOutput: false,
  soundOutput: false,
  theme: 'dark',
  autorefresh: false
};

const preferences = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_FONT_SIZE:
      return { ...state, fontSize: action.value };
    case ActionTypes.SET_AUTOSAVE:
      return { ...state, autosave: action.value };
    case ActionTypes.SET_LINEWRAP:
      return { ...state, linewrap: action.value };
    case ActionTypes.SET_LINT_WARNING:
      return { ...state, lintWarning: action.value };
    case ActionTypes.SET_TEXT_OUTPUT:
      return { ...state, textOutput: action.value };
    case ActionTypes.SET_GRID_OUTPUT:
      return { ...state, gridOutput: action.value };
    case ActionTypes.SET_SOUND_OUTPUT:
      return { ...state, soundOutput: action.value };
    case ActionTypes.SET_PREFERENCES:
      return action.preferences;
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.value };
    case ActionTypes.SET_AUTOREFRESH:
      console.log({ ...state, autorefresh: action.value })
      return { ...state, autorefresh: action.value };
    case ActionTypes.SET_LINE_NUMBERS:
      return { ...state, lineNumbers: action.value };
    default:
      return state;
  }
};

export default preferences;
