import * as ActionTypes from '../../../constants';

const initialState = {
  isPlaying: false,
  isAccessibleOutputPlaying: false,
  modalIsVisible: false,
  sidebarIsExpanded: false,
  consoleIsExpanded: true,
  preferencesIsVisible: false,
  projectOptionsVisible: false,
  newFolderModalVisible: false,
  shareModalVisible: false,
  shareModalProjectId: 'abcd',
  shareModalProjectName: 'My Cute Sketch',
  shareModalProjectUsername: 'g5_user',
  sketchlistModalVisible: false,
  editorOptionsVisible: false,
  keyboardShortcutVisible: false,
  unsavedChanges: false,
  infiniteLoop: false,
  previewIsRefreshing: false,
  infiniteLoopMessage: '',
  justOpenedProject: false,
  previousPath: '/',
  errorType: undefined,
  runtimeErrorWarningVisible: true,
}

const ide = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.START_SKETCH:
      return { ...state, isPlaying: true }
    case ActionTypes.STOP_SKETCH:
      return { ...state, isPlaying: false }
    case ActionTypes.START_ACCESSIBLE_OUTPUT:
      return { ...state, isAccessibleOutputPlaying: true }
    case ActionTypes.STOP_ACCESSIBLE_OUTPUT:
      return { ...state, isAccessibleOutputPlaying: false }
    case ActionTypes.CONSOLE_EVENT:
      console.log(action)
      return { ...state, consoleEvent: action.event }
    case ActionTypes.SHOW_MODAL:
      return { ...state, modalIsVisible: true }
    case ActionTypes.HIDE_MODAL:
      return { ...state, modalIsVisible: false }
    case ActionTypes.COLLAPSE_SIDEBAR:
      return { ...state, sidebarIsExpanded: false }
    case ActionTypes.EXPAND_SIDEBAR:
      return { ...state, sidebarIsExpanded: true }
    case ActionTypes.COLLAPSE_CONSOLE:
      return { ...state, consoleIsExpanded: false }
    case ActionTypes.EXPAND_CONSOLE:
      return { ...state, consoleIsExpanded: true }
    case ActionTypes.OPEN_PREFERENCES:
      return { ...state, preferencesIsVisible: true }
    case ActionTypes.CLOSE_PREFERENCES:
      return { ...state, preferencesIsVisible: false }
    case ActionTypes.RESET_PROJECT:
      return initialState;
    case ActionTypes.OPEN_PROJECT_OPTIONS:
      return { ...state, projectOptionsVisible: true }
    case ActionTypes.CLOSE_PROJECT_OPTIONS:
      return { ...state, projectOptionsVisible: false }
    case ActionTypes.SHOW_NEW_FOLDER_MODAL:
      return { ...state, newFolderModalVisible: true }
    case ActionTypes.CLOSE_NEW_FOLDER_MODAL:
      return { ...state, newFolderModalVisible: false }
    case ActionTypes.SHOW_SHARE_MODAL:
      return {
        ...state,
        shareModalVisible: true,
        shareModalProjectId: action.payload.shareModalProjectId,
        shareModalProjectName: action.payload.shareModalProjectName,
        shareModalProjectUsername: action.payload.shareModalProjectUsername,
      }
    case ActionTypes.CLOSE_SHARE_MODAL:
      return { ...state, shareModalVisible: false }
    case ActionTypes.SHOW_EDITOR_OPTIONS:
      return { ...state, editorOptionsVisible: true }
    case ActionTypes.CLOSE_EDITOR_OPTIONS:
      return { ...state, editorOptionsVisible: false }
    case ActionTypes.SHOW_KEYBOARD_SHORTCUT_MODAL:
      return { ...state, keyboardShortcutVisible: true }
    case ActionTypes.CLOSE_KEYBOARD_SHORTCUT_MODAL:
      return { ...state, keyboardShortcutVisible: false }
    case ActionTypes.SET_UNSAVED_CHANGES:
      return { ...state, unsavedChanges: action.value }
    case ActionTypes.DETECT_INFINITE_LOOPS:
      return { ...state, infiniteLoop: true, infiniteLoopMessage: action.message }
    case ActionTypes.RESET_INFINITE_LOOPS:
      return { ...state, infiniteLoop: false, infiniteLoopMessage: '' }
    case ActionTypes.START_SKETCH_REFRESH:
      return { ...state, previewIsRefreshing: true }
    case ActionTypes.END_SKETCH_REFRESH:
      return { ...state, previewIsRefreshing: false }
    case ActionTypes.JUST_OPENED_PROJECT:
      return { ...state, justOpenedProject: true }
    case ActionTypes.RESET_JUST_OPENED_PROJECT:
      return { ...state, justOpenedProject: false }
    case ActionTypes.SET_PREVIOUS_PATH:
      return { ...state, previousPath: action.path }
    case ActionTypes.SHOW_ERROR_MODAL:
      return { ...state, errorType: action.modalType }
    case ActionTypes.HIDE_ERROR_MODAL:
      return { ...state, errorType: undefined }
    case ActionTypes.SHOW_HELP_MODAL:
      return { ...state, helpType: action.helpType }
    case ActionTypes.HIDE_HELP_MODAL:
      return { ...state, helpType: undefined }
    case ActionTypes.HIDE_RUNTIME_ERROR_WARNING:
      return { ...state, runtimeErrorWarningVisible: false }
    case ActionTypes.SHOW_RUNTIME_ERROR_WARNING:
      return { ...state, runtimeErrorWarningVisible: true }
    default:
      return state;
  }
}

export default ide
