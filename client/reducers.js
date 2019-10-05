import { combineReducers } from 'redux';
import ide from './modules/IDE/reducers/ide'
import preferences from './modules/IDE/reducers/preferences'
import console from './modules/IDE/reducers/console'
import toast from './modules/IDE/reducers/toast'
import files from './modules/IDE/reducers/files'
import projects from './modules/IDE/reducers/projects'
import user from './modules/User/reducers'
import editorAccessibility from './modules/IDE/reducers/editorAccessibility'
import project from './modules/IDE/reducers/project'

const rootReducer = combineReducers({
  ide,
  console,
  preferences,
  files,
  projects,
  user,
  toast,
  editorAccessibility,
  project
})

export default rootReducer
