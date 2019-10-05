import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SplitPane from 'react-split-pane';
import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';
import PreviewFrame from '../components/PreviewFrame';
import Toolbar from '../components/Toolbar';
import Preferences from '../components/Preferences';
import NewFileModal from '../components/NewFileModal';
import NewFolderModal from '../components/NewFolderModal';
import ShareModal from '../components/ShareModal';
import KeyboardShortcutModal from '../components/KeyboardShortcutModal';
import ErrorModal from '../components/ErrorModal';
import HTTPSModal from '../components/HTTPSModal';
import Nav from '../../../components/Nav';
import Console from '../components/Console';
import Toast from '../components/Toast';
import * as FileActions from '../actions/files';
import * as IDEActions from '../actions/ide';
import * as ProjectActions from '../actions/project';
import * as EditorAccessibilityActions from '../actions/editorAccessibility';
import * as PreferencesActions from '../actions/preferences';
import * as UserActions from '../../User/actions';
import * as ToastActions from '../actions/toast';
import * as ConsoleActions from '../actions/console';
import { getHTMLFile } from '../reducers/files';
import Overlay from '../../App/components/Overlay';
import SketchList from '../components/SketchList';
import Searchbar from '../components/Searchbar';
import AssetList from '../components/AssetList';
import About from '../components/About';
import Feedback from '../components/Feedback';

class IDEView extends React.Component {
  constructor(props) {
    super(props);
    this.handleGlobalKeydown = this.handleGlobalKeydown.bind(this);
    this.warnIfUnsavedChanges = this.warnIfUnsavedChanges.bind(this);

    this.state = {
      consoleSize: props.ide.consoleIsExpanded ? 150 : 29,
      sidebarSize: props.ide.sidebarIsExpanded ? 160 : 20
    };
  }

  componentDidMount() {
    const {
      clearPersistedState,
      stopSketch,
      match,
      project,
      getProject,
      // router,
      // route,
      preferences
    } = this.props
    // If page doesn't reload after Sign In then we need
    // to force cleared state to be cleared
    clearPersistedState()

    stopSketch();
    if (match.params.project_id) {
      const id = match.params.project_id;
      if (id !== project.id) {
        getProject(id)
      }
    }

    this.isMac = navigator.userAgent.toLowerCase().indexOf('mac') !== -1;
    document.addEventListener('keydown', this.handleGlobalKeydown, false);

    // router.setRouteLeaveHook(route, (r) => this.warnIfUnsavedChanges(r));

    window.onbeforeunload = () => this.warnIfUnsavedChanges();

    document.body.className = preferences.theme;
    // this.autosaveInterval = null;
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { location, setPreviousPath, ide } = this.props

    if (nextProps.location !== location) {
      setPreviousPath(location.pathname);
    }

    if (ide.consoleIsExpanded !== nextProps.ide.consoleIsExpanded) {
      this.setState({ consoleSize: nextProps.ide.consoleIsExpanded ? 150 : 29 });
    }

    if (ide.sidebarIsExpanded !== nextProps.ide.sidebarIsExpanded) {
      this.setState({ sidebarSize: nextProps.ide.sidebarIsExpanded ? 160 : 20 });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate(nextProps) {
    const { getProject, match, preferences } = this.props
    const { params } = match
    if (nextProps.match.params.project_id && !params.project_id) {
      if (nextProps.match.params.project_id !== nextProps.project.id) {
        getProject(nextProps.match.params.project_id);
      }
    }

    if (nextProps.preferences.theme !== preferences.theme) {
      document.body.className = nextProps.preferences.theme;
    }
  }

  // componentDidUpdate(prevProps) {
  //   const {
  //     project,
  //     preferences,
  //     ide,
  //     selectedFile,
  //     autosaveProject,
  //     // route,
  //     // router
  //   } = this.props
  //   if (this.isUserOwner() && project.id) {
  //     if (preferences.autosave && ide.unsavedChanges && !ide.justOpenedProject) {
  //       if (
  //         selectedFile.name === prevProps.selectedFile.name
  //         && selectedFile.content !== prevProps.selectedFile.content) {
  //         if (this.autosaveInterval) {
  //           clearTimeout(this.autosaveInterval);
  //         }
  //         console.log('will save project in 20 seconds');
  //         this.autosaveInterval = setTimeout(autosaveProject, 20000);
  //       }
  //     } else if (this.autosaveInterval && !preferences.autosave) {
  //       clearTimeout(this.autosaveInterval);
  //       this.autosaveInterval = null;
  //     }
  //   } else if (this.autosaveInterval) {
  //     clearTimeout(this.autosaveInterval);
  //     this.autosaveInterval = null;
  //   }

  //   // if (route.path !== prevProps.route.path) {
  //   // router.setRouteLeaveHook(route, (r) => this.warnIfUnsavedChanges(r));
  //   // }
  // }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleGlobalKeydown, false);
    // clearTimeout(this.autosaveInterval);
    // this.autosaveInterval = null;
  }

  isUserOwner() {
    const { project, user } = this.props
    return project.owner && project.owner.id === user.id;
  }

  handleGlobalKeydown(e) {
    const {
      // user,
      // project,
      // saveProject,
      // cloneProject,
      // showErrorModal,
      stopSketch,
      startSketch,
      // setAllAccessibleOutput
    } = this.props
    // 83 === s
    // if (e.keyCode === 83 && ((e.metaKey && this.isMac) || (e.ctrlKey && !this.isMac))) {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   if (this.isUserOwner() || (user.authenticated && !project.owner)) {
    //     saveProject(this.cmController.getContent());
    //   } else if (user.authenticated) {
    //     cloneProject();
    //   } else {
    //     showErrorModal('forceAuthentication');
    //   }
    // 13 === enter
    if (e.keyCode === 13 && e.shiftKey && ((e.metaKey && this.isMac) || (e.ctrlKey && !this.isMac))) {
      e.preventDefault();
      e.stopPropagation();
      stopSketch();
    } else if (e.keyCode === 13 && ((e.metaKey && this.isMac) || (e.ctrlKey && !this.isMac))) {
      e.preventDefault();
      e.stopPropagation();
      startSketch();
      // 50 === 2
    }
    // else if (e.keyCode === 50 && ((e.metaKey && this.isMac) || (e.ctrlKey && !this.isMac)) && e.shiftKey) {
    //   e.preventDefault();
    //   setAllAccessibleOutput(false);
    //   // 49 === 1
    // } else if (e.keyCode === 49 && ((e.metaKey && this.isMac) || (e.ctrlKey && !this.isMac)) && e.shiftKey) {
    //   e.preventDefault();
    //   setAllAccessibleOutput(true);
    // }
  }

  warnIfUnsavedChanges(route) { // eslint-disable-line
    const {
      persistState,
      location,
      ide,
      setUnsavedChanges
    } = this.props
    if (route && (route.action === 'PUSH' && (route.pathname === '/login' || route.pathname === '/signup'))) {
      // don't warn
      persistState();
      window.onbeforeunload = null;
    } else if (route && (location.pathname === '/login' || location.pathname === '/signup')) {
      // don't warn
      persistState();
      window.onbeforeunload = null;
    } else if (ide.unsavedChanges) {
      if (!window.confirm('Are you sure you want to leave this page? You have unsaved changes.')) {
        return false;
      }
      setUnsavedChanges(false);
      return true;
    }
  }

  render() {
    const {
      project,
      toast,
      ide,
      closePreferences,
      preferences,
      setFontSize,
      setLineNumbers,
      // setAutosave,
      setLinewrap,
      setLintWarning,
      setTextOutput,
      setGridOutput,
      setSoundOutput,
      setTheme,
      files,
      setSelectedFile,
      newFile,
      deleteFile,
      updateFileName,
      openProjectOptions,
      closeProjectOptions,
      newFolder,
      user,
      console: csl,
      editorAccessibility,
      updateLintMessage,
      clearLintMessage,
      selectedFile,
      updateFileContent,
      showEditorOptions,
      closeEditorOptions,
      showKeyboardShortcutModal,
      setUnsavedChanges,
      startRefreshSketch,
      stopSketch,
      expandSidebar,
      collapseSidebar,
      clearConsole,
      showRuntimeErrorWarning,
      hideRuntimeErrorWarning,
      expandConsole,
      collapseConsole,
      dispatchConsoleEvent,
      htmlFile,
      endSketchRefresh,
      setBlobUrl,
      closeNewFileModal,
      createFile,
      closeNewFolderModal,
      createFolder,
      match,
      location,
      closeShareModal,
      closeKeyboardShortcutModal,
      hideErrorModal,
      hideHelpModal
    } = this.props

    const {
      sidebarSize,
      consoleSize
    } = this.state

    return (
      <div className="ide">
        <Helmet>
          <title>
G5.js Web Editor |
            {' '}
            {project.name}
          </title>
        </Helmet>
        {toast.isVisible && <Toast />}
        <Nav
          warnIfUnsavedChanges={this.warnIfUnsavedChanges}
          cmController={this.cmController}
        />
        <Toolbar />
        {ide.preferencesIsVisible
          && (
            <Overlay
              title="Settings"
              ariaLabel="settings"
              closeOverlay={closePreferences}
            >
              <Preferences
                fontSize={preferences.fontSize}
                setFontSize={setFontSize}
                // autosave={preferences.autosave}
                linewrap={preferences.linewrap}
                lineNumbers={preferences.lineNumbers}
                setLineNumbers={setLineNumbers}
                // setAutosave={setAutosave}
                setLinewrap={setLinewrap}
                lintWarning={preferences.lintWarning}
                setLintWarning={setLintWarning}
                textOutput={preferences.textOutput}
                gridOutput={preferences.gridOutput}
                soundOutput={preferences.soundOutput}
                setTextOutput={setTextOutput}
                setGridOutput={setGridOutput}
                setSoundOutput={setSoundOutput}
                theme={preferences.theme}
                setTheme={setTheme}
              />
            </Overlay>
          )}
        <div className="editor-preview-container">
          <SplitPane
            split="vertical"
            size={sidebarSize}
            onChange={(size) => this.setState({ sidebarSize: size })}
            onDragFinished={this._handleSidebarPaneOnDragFinished}
            allowResize={ide.sidebarIsExpanded}
            minSize={20}
          >
            <Sidebar
              files={files}
              setSelectedFile={setSelectedFile}
              newFile={newFile}
              isExpanded={ide.sidebarIsExpanded}
              deleteFile={deleteFile}
              updateFileName={updateFileName}
              projectOptionsVisible={ide.projectOptionsVisible}
              openProjectOptions={openProjectOptions}
              closeProjectOptions={closeProjectOptions}
              newFolder={newFolder}
              user={user}
              owner={project.owner}
            />
            <SplitPane
              split="vertical"
              defaultSize="50%"
              onChange={() => { this.overlay.style.display = 'block'; }}
              onDragFinished={() => { this.overlay.style.display = 'none'; }}
              resizerStyle={{
                borderLeftWidth: '2px', borderRightWidth: '2px', width: '2px', margin: '0px 0px'
              }}
            >
              <SplitPane
                split="horizontal"
                primary="second"
                size={consoleSize}
                minSize={29}
                onChange={(size) => this.setState({ consoleSize: size })}
                allowResize={ide.consoleIsExpanded}
                className="editor-preview-subpanel"
              >
                <Editor
                  lintWarning={preferences.lintWarning}
                  linewrap={preferences.linewrap}
                  lintMessages={editorAccessibility.lintMessages}
                  updateLintMessage={updateLintMessage}
                  clearLintMessage={clearLintMessage}
                  file={selectedFile}
                  updateFileContent={updateFileContent}
                  fontSize={preferences.fontSize}
                  lineNumbers={preferences.lineNumbers}
                  files={files}
                  editorOptionsVisible={ide.editorOptionsVisible}
                  showEditorOptions={showEditorOptions}
                  closeEditorOptions={closeEditorOptions}
                  showKeyboardShortcutModal={showKeyboardShortcutModal}
                  setUnsavedChanges={setUnsavedChanges}
                  isPlaying={ide.isPlaying}
                  theme={preferences.theme}
                  startRefreshSketch={startRefreshSketch}
                  stopSketch={stopSketch}
                  autorefresh={preferences.autorefresh}
                  unsavedChanges={ide.unsavedChanges}
                  projectSavedTime={project.updatedAt}
                  isExpanded={ide.sidebarIsExpanded}
                  expandSidebar={expandSidebar}
                  collapseSidebar={collapseSidebar}
                  isUserOwner={this.isUserOwner()}
                  clearConsole={clearConsole}
                  consoleEvents={csl}
                  showRuntimeErrorWarning={showRuntimeErrorWarning}
                  hideRuntimeErrorWarning={hideRuntimeErrorWarning}
                  runtimeErrorWarningVisible={ide.runtimeErrorWarningVisible}
                  provideController={(ctl) => { this.cmController = ctl; }}
                />
                <Console
                  fontSize={preferences.fontSize}
                  consoleEvents={csl}
                  isExpanded={ide.consoleIsExpanded}
                  expandConsole={expandConsole}
                  collapseConsole={collapseConsole}
                  clearConsole={clearConsole}
                  dispatchConsoleEvent={dispatchConsoleEvent}
                  theme={preferences.theme}
                />
              </SplitPane>
              <div className="preview-frame-holder">
                <header className="preview-frame__header">
                  <h2 className="preview-frame__title">Preview</h2>
                </header>
                <div className="preview-frame__content">
                  <div className="preview-frame-overlay" ref={(element) => { this.overlay = element; }}>
                  </div>
                  <div>
                    {(
                      (
                        (preferences.textOutput
                            || preferences.gridOutput
                            || preferences.soundOutput
                        )
                            && ide.isPlaying
                      )
                        || ide.isAccessibleOutputPlaying
                    )}
                  </div>
                  <PreviewFrame
                    htmlFile={htmlFile}
                    files={files}
                    content={selectedFile.content}
                    isPlaying={ide.isPlaying}
                    isAccessibleOutputPlaying={ide.isAccessibleOutputPlaying}
                    textOutput={preferences.textOutput}
                    gridOutput={preferences.gridOutput}
                    soundOutput={preferences.soundOutput}
                    setTextOutput={setTextOutput}
                    setGridOutput={setGridOutput}
                    setSoundOutput={setSoundOutput}
                    dispatchConsoleEvent={dispatchConsoleEvent}
                    autorefresh={preferences.autorefresh}
                    previewIsRefreshing={ide.previewIsRefreshing}
                    endSketchRefresh={endSketchRefresh}
                    stopSketch={stopSketch}
                    setBlobUrl={setBlobUrl}
                    expandConsole={expandConsole}
                    clearConsole={clearConsole}
                    cmController={this.cmController}
                  />
                </div>
              </div>
            </SplitPane>
          </SplitPane>
        </div>
        { ide.modalIsVisible
          && (
            <NewFileModal
              canUploadMedia={user.authenticated}
              closeModal={closeNewFileModal}
              createFile={createFile}
            />
          )}
        { ide.newFolderModalVisible
          && (
            <NewFolderModal
              closeModal={closeNewFolderModal}
              createFolder={createFolder}
            />
          )}
        { location.pathname.match(/sketches$/)
          && (
            <Overlay
              ariaLabel="project list"
              title="Open a Sketch"
              previousPath={ide.previousPath}
            >
              <Searchbar />
              <SketchList
                username={match.params.username}
                user={user}
              />
            </Overlay>
          )}
        { location.pathname.match(/assets$/)
          && (
            <Overlay
              title="Assets"
              ariaLabel="asset list"
              previousPath={ide.previousPath}
            >
              <AssetList
                username={match.params.username}
                user={user}
              />
            </Overlay>
          )}
        { location.pathname === '/about'
          && (
            <Overlay
              previousPath={ide.previousPath}
              title="Welcome"
              ariaLabel="about"
            >
              <About previousPath={ide.previousPath} />
            </Overlay>
          )}
        { location.pathname === '/feedback'
          && (
            <Overlay
              previousPath={ide.previousPath}
              title="Submit Feedback"
              ariaLabel="submit-feedback"
            >
              <Feedback previousPath={ide.previousPath} />
            </Overlay>
          )}
        { ide.shareModalVisible
          && (
            <Overlay
              title="Share This Sketch"
              ariaLabel="share"
              closeOverlay={closeShareModal}
            >
              <ShareModal
                projectId={ide.shareModalProjectId}
                projectName={ide.shareModalProjectName}
                ownerUsername={ide.shareModalProjectUsername}
              />
            </Overlay>
          )}
        { ide.keyboardShortcutVisible
          && (
            <Overlay
              title="Keyboard Shortcuts"
              ariaLabel="keyboard shortcuts"
              closeOverlay={closeKeyboardShortcutModal}
            >
              <KeyboardShortcutModal />
            </Overlay>
          )}
        { ide.errorType
          && (
            <Overlay
              title="Error"
              ariaLabel="error"
              closeOverlay={hideErrorModal}
            >
              <ErrorModal
                type={ide.errorType}
                closeModal={hideErrorModal}
              />
            </Overlay>
          )}
        { ide.helpType
          && (
            <Overlay
              title="Serve over HTTPS"
              closeOverlay={hideHelpModal}
            >
              <HTTPSModal />
            </Overlay>
          )}
      </div>
    );
  }
}

IDEView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      project_id: PropTypes.string,
      username: PropTypes.string,
      reset_password_token: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  getProject: PropTypes.func.isRequired,
  user: PropTypes.shape({
    authenticated: PropTypes.bool.isRequired,
    id: PropTypes.string,
    username: PropTypes.string
  }).isRequired,
  // saveProject: PropTypes.func.isRequired,
  ide: PropTypes.shape({
    isPlaying: PropTypes.bool.isRequired,
    isAccessibleOutputPlaying: PropTypes.bool.isRequired,
    consoleEvent: PropTypes.array,
    modalIsVisible: PropTypes.bool.isRequired,
    sidebarIsExpanded: PropTypes.bool.isRequired,
    consoleIsExpanded: PropTypes.bool.isRequired,
    preferencesIsVisible: PropTypes.bool.isRequired,
    projectOptionsVisible: PropTypes.bool.isRequired,
    newFolderModalVisible: PropTypes.bool.isRequired,
    shareModalVisible: PropTypes.bool.isRequired,
    shareModalProjectId: PropTypes.string.isRequired,
    shareModalProjectName: PropTypes.string.isRequired,
    shareModalProjectUsername: PropTypes.string.isRequired,
    editorOptionsVisible: PropTypes.bool.isRequired,
    keyboardShortcutVisible: PropTypes.bool.isRequired,
    unsavedChanges: PropTypes.bool.isRequired,
    infiniteLoop: PropTypes.bool.isRequired,
    previewIsRefreshing: PropTypes.bool.isRequired,
    infiniteLoopMessage: PropTypes.string.isRequired,
    projectSavedTime: PropTypes.string,
    previousPath: PropTypes.string.isRequired,
    justOpenedProject: PropTypes.bool.isRequired,
    errorType: PropTypes.string,
    helpType: PropTypes.string,
    runtimeErrorWarningVisible: PropTypes.bool.isRequired,
  }).isRequired,
  stopSketch: PropTypes.func.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.string
    }),
    updatedAt: PropTypes.string
  }).isRequired,
  editorAccessibility: PropTypes.shape({
    lintMessages: PropTypes.array.isRequired,
  }).isRequired,
  updateLintMessage: PropTypes.func.isRequired,
  clearLintMessage: PropTypes.func.isRequired,
  preferences: PropTypes.shape({
    fontSize: PropTypes.number.isRequired,
    // autosave: PropTypes.bool.isRequired,
    linewrap: PropTypes.bool.isRequired,
    lineNumbers: PropTypes.bool.isRequired,
    lintWarning: PropTypes.bool.isRequired,
    textOutput: PropTypes.bool.isRequired,
    gridOutput: PropTypes.bool.isRequired,
    soundOutput: PropTypes.bool.isRequired,
    theme: PropTypes.string.isRequired,
    autorefresh: PropTypes.bool.isRequired
  }).isRequired,
  closePreferences: PropTypes.func.isRequired,
  setFontSize: PropTypes.func.isRequired,
  // setAutosave: PropTypes.func.isRequired,
  setLineNumbers: PropTypes.func.isRequired,
  setLinewrap: PropTypes.func.isRequired,
  setLintWarning: PropTypes.func.isRequired,
  setTextOutput: PropTypes.func.isRequired,
  setGridOutput: PropTypes.func.isRequired,
  setSoundOutput: PropTypes.func.isRequired,
  // setAllAccessibleOutput: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })).isRequired,
  updateFileContent: PropTypes.func.isRequired,
  selectedFile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  setSelectedFile: PropTypes.func.isRequired,
  htmlFile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired,
  dispatchConsoleEvent: PropTypes.func.isRequired,
  newFile: PropTypes.func.isRequired,
  closeNewFileModal: PropTypes.func.isRequired,
  expandSidebar: PropTypes.func.isRequired,
  collapseSidebar: PropTypes.func.isRequired,
  // cloneProject: PropTypes.func.isRequired,
  expandConsole: PropTypes.func.isRequired,
  collapseConsole: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  updateFileName: PropTypes.func.isRequired,
  openProjectOptions: PropTypes.func.isRequired,
  closeProjectOptions: PropTypes.func.isRequired,
  newFolder: PropTypes.func.isRequired,
  closeNewFolderModal: PropTypes.func.isRequired,
  createFolder: PropTypes.func.isRequired,
  createFile: PropTypes.func.isRequired,
  closeShareModal: PropTypes.func.isRequired,
  showEditorOptions: PropTypes.func.isRequired,
  closeEditorOptions: PropTypes.func.isRequired,
  showKeyboardShortcutModal: PropTypes.func.isRequired,
  closeKeyboardShortcutModal: PropTypes.func.isRequired,
  toast: PropTypes.shape({
    isVisible: PropTypes.bool.isRequired
  }).isRequired,
  // autosaveProject: PropTypes.func.isRequired,
  // router: PropTypes.shape({
  //   setRouteLeaveHook: PropTypes.func
  // }).isRequired,
  // route: PropTypes.oneOfType([PropTypes.object, PropTypes.element]).isRequired,
  setUnsavedChanges: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
  endSketchRefresh: PropTypes.func.isRequired,
  startRefreshSketch: PropTypes.func.isRequired,
  setBlobUrl: PropTypes.func.isRequired,
  setPreviousPath: PropTypes.func.isRequired,
  console: PropTypes.arrayOf(PropTypes.shape({
    method: PropTypes.string.isRequired,
    args: PropTypes.arrayOf(PropTypes.string)
  })).isRequired,
  clearConsole: PropTypes.func.isRequired,
  // showErrorModal: PropTypes.func.isRequired,
  hideErrorModal: PropTypes.func.isRequired,
  clearPersistedState: PropTypes.func.isRequired,
  persistState: PropTypes.func.isRequired,
  hideHelpModal: PropTypes.func.isRequired,
  showRuntimeErrorWarning: PropTypes.func.isRequired,
  hideRuntimeErrorWarning: PropTypes.func.isRequired,
  startSketch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    files: state.files,
    selectedFile: state.files.find((file) => file.isSelectedFile)
      || state.files.find((file) => file.name === 'sketch.js')
      || state.files.find((file) => file.name !== 'root'),
    htmlFile: getHTMLFile(state.files),
    ide: state.ide,
    preferences: state.preferences,
    editorAccessibility: state.editorAccessibility,
    user: state.user,
    project: state.project,
    toast: state.toast,
    console: state.console
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...EditorAccessibilityActions,
      ...FileActions,
      ...ProjectActions,
      ...IDEActions,
      ...PreferencesActions,
      ...UserActions,
      ...ToastActions,
      ...ConsoleActions
    },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IDEView));
