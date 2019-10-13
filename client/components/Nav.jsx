import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import InlineSVG from 'react-inlinesvg';
import classNames from 'classnames';
import * as IDEActions from '../modules/IDE/actions/ide';
import * as toastActions from '../modules/IDE/actions/toast';
import * as projectActions from '../modules/IDE/actions/project';
import { setAllAccessibleOutput } from '../modules/IDE/actions/preferences';
import { logoutUser } from '../modules/User/actions';

import { metaKeyName, } from '../utils/metaKey';

const triangleUrl = require('../images/down-filled-triangle.svg');
const logoUrl = require('../images/g5js-logo-small.svg');

const __process = (typeof global !== 'undefined' ? global : window).process;

class Nav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: 'none'
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.clearHideTimeout = this.clearHideTimeout.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.handleDuplicate = this.handleDuplicate.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleFind = this.handleFind.bind(this);
    this.handleAddFile = this.handleAddFile.bind(this);
    this.handleAddFolder = this.handleAddFolder.bind(this);
    this.handleFindNext = this.handleFindNext.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleFindPrevious = this.handleFindPrevious.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleStartAccessible = this.handleStartAccessible.bind(this);
    this.handleStopAccessible = this.handleStopAccessible.bind(this);
    this.handleKeyboardShortcuts = this.handleKeyboardShortcuts.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleDropdownForFile = this.toggleDropdown.bind(this, 'file');
    this.handleFocusForFile = this.handleFocus.bind(this, 'file');
    this.setDropdownForNone = this.setDropdown.bind(this, 'none');
    this.toggleDropdownForEdit = this.toggleDropdown.bind(this, 'edit');
    this.handleFocusForEdit = this.handleFocus.bind(this, 'edit');
    this.toggleDropdownForSketch = this.toggleDropdown.bind(this, 'sketch');
    this.handleFocusForSketch = this.handleFocus.bind(this, 'sketch');
    this.toggleDropdownForHelp = this.toggleDropdown.bind(this, 'help');
    this.handleFocusForHelp = this.handleFocus.bind(this, 'help');
    this.toggleDropdownForAccount = this.toggleDropdown.bind(this, 'account');
    this.handleFocusForAccount = this.handleFocus.bind(this, 'account');
    this.closeDropDown = this.closeDropDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
    document.addEventListener('keydown', this.closeDropDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
    document.removeEventListener('keydown', this.closeDropDown, false);
  }

  setDropdown(dropdown) {
    this.setState({
      dropdownOpen: dropdown
    });
  }

  closeDropDown(e) {
    if (e.keyCode === 27) {
      this.setDropdown('none');
    }
  }

  handleClick(e) {
    if (!this.node) {
      return;
    }
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.handleClickOutside();
  }

  handleNew() {
    const {
      unsavedChanges,
      showToast,
      setToastText,
      newProject,
      warnIfUnsavedChanges
    } = this.props
    if (!unsavedChanges) {
      showToast(1500);
      setToastText('Opened new sketch.');
      newProject();
    } else if (warnIfUnsavedChanges()) {
      showToast(1500);
      setToastText('Opened new sketch.');
      newProject();
    }
    this.setDropdown('none');
  }

  handleSave() {
    const {
      user,
      saveProject,
      cmController,
      showErrorModal
    } = this.props
    if (user.authenticated) {
      saveProject(cmController.getContent());
    } else {
      showErrorModal('forceAuthentication');
    }
    this.setDropdown('none');
  }

  handleFind() {
    const { cmController } = this.props
    cmController.showFind();
    this.setDropdown('none');
  }

  handleFindNext() {
    const { cmController } = this.props
    cmController.findNext();
    this.setDropdown('none');
  }

  handleFindPrevious() {
    const { cmController } = this.props
    cmController.findPrev();
    this.setDropdown('none');
  }

  handleAddFile() {
    const { newFile } = this.props
    newFile();
    this.setDropdown('none');
  }

  handleAddFolder() {
    const { newFolder } = this.props
    newFolder();
    this.setDropdown('none');
  }

  handleRun() {
    const { startSketch } = this.props
    startSketch();
    this.setDropdown('none');
  }

  handleStop() {
    const { stopSketch } = this.props
    stopSketch();
    this.setDropdown('none');
  }

  handleStartAccessible() {
    const { setAllAccessibleOutput: asso } = this.props
    asso(true);
    this.setDropdown('none');
  }

  handleStopAccessible() {
    const { setAllAccessibleOutput: asso } = this.props
    asso(false);
    this.setDropdown('none');
  }

  handleKeyboardShortcuts() {
    const { showKeyboardShortcutModal } = this.props
    showKeyboardShortcutModal();
    this.setDropdown('none');
  }

  handleLogout() {
    const { logoutUser: logout } = this.props
    logout();
    this.setDropdown('none');
  }

  handleDownload() {
    const { autosaveProject, exportProjectAsZip, project } = this.props
    autosaveProject();
    exportProjectAsZip(project.id);
    this.setDropdown('none');
  }

  handleDuplicate() {
    const { cloneProject } = this.props
    cloneProject();
    this.setDropdown('none');
  }

  handleShare() {
    const { showShareModal } = this.props
    showShareModal();
    this.setDropdown('none');
  }

  handleClickOutside() {
    this.setState({
      dropdownOpen: 'none'
    });
  }

  toggleDropdown(dropdown) {
    const { dropdownOpen } = this.state
    if (dropdownOpen === 'none') {
      this.setState({
        dropdownOpen: dropdown
      });
    } else {
      this.setState({
        dropdownOpen: 'none'
      });
    }
  }

  isUserOwner() {
    const { project, user } = this.props
    return project.owner && project.owner.id === user.id;
  }

  handleFocus(dropdown) {
    this.clearHideTimeout();
    this.setDropdown(dropdown);
  }

  clearHideTimeout() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  handleBlur() {
    this.timer = setTimeout(this.setDropdown.bind(this, 'none'), 10);
  }

  render() {
    const { project, user, cmController } = this.props
    const { dropdownOpen } = this.state
    const navDropdownState = {
      file: classNames({
        'nav__item': true,
        'nav__item--open': dropdownOpen === 'file'
      }),
      edit: classNames({
        'nav__item': true,
        'nav__item--open': dropdownOpen === 'edit'
      }),
      sketch: classNames({
        'nav__item': true,
        'nav__item--open': dropdownOpen === 'sketch'
      }),
      help: classNames({
        'nav__item': true,
        'nav__item--open': dropdownOpen === 'help'
      }),
      account: classNames({
        'nav__item': true,
        'nav__item--open': dropdownOpen === 'account'
      })
    };
    return (
      <nav className="nav" title="main-navigation" ref={(node) => { this.node = node; }}>
        <ul className="nav__items-left" title="project-menu">
          <li className="nav__item-logo">
            <InlineSVG src={logoUrl} alt="G5.js logo" className="svg__logo" />
          </li>
          <li className={navDropdownState.file}>
            {/* <button
              type="button"
              onClick={this.toggleDropdownForFile}
              onBlur={this.handleBlur}
              onFocus={this.clearHideTimeout}
              onMouseOver={() => {
                if (dropdownOpen !== 'none') {
                  this.setDropdown('file');
                }
              }}
            >
              <span className="nav__item-header">File</span>
              <InlineSVG className="nav__item-header-triangle" src={triangleUrl} />
            </button> */}
            <ul className="nav__dropdown">
              <li className="nav__dropdown-item">
                <button
                  type="button"
                  onClick={this.handleNew}
                  onFocus={this.handleFocusForFile}
                  onBlur={this.handleBlur}
                >
                  New
                </button>
              </li>
              { __process.env.LOGIN_ENABLED && (!project.owner || this.isUserOwner())
              && (
                <li className="nav__dropdown-item">
                  <button
                    type="button"
                    onClick={this.handleSave}
                    onFocus={this.handleFocusForFile}
                    onBlur={this.handleBlur}
                  >
                    Save
                    <span className="nav__keyboard-shortcut">
                      {metaKeyName}
                      +s
                    </span>
                  </button>
                </li>
              )}
              { project.id && user.authenticated
              && (
                <li className="nav__dropdown-item">
                  <button
                    type="button"
                    onClick={this.handleDuplicate}
                    onFocus={this.handleFocusForFile}
                    onBlur={this.handleBlur}
                  >
                    Duplicate
                  </button>
                </li>
              )}
              { project.id
              && (
                <li className="nav__dropdown-item">
                  <button
                    type="button"
                    onClick={this.handleShare}
                    onFocus={this.handleFocusForFile}
                    onBlur={this.handleBlur}
                  >
                    Share
                  </button>
                </li>
              )}
              { project.id
              && (
                <li className="nav__dropdown-item">
                  <button
                    type="button"
                    onClick={this.handleDownload}
                    onFocus={this.handleFocusForFile}
                    onBlur={this.handleBlur}
                  >
                    Download
                  </button>
                </li>
              )}
              { user.authenticated
              && (
                <li className="nav__dropdown-item">
                  <Link
                    to={`/${user.username}/sketches`}
                    onFocus={this.handleFocusForFile}
                    onBlur={this.handleBlur}
                    onClick={this.setDropdownForNone}
                  >
                    Open
                  </Link>
                </li>
              )}
              { __process.env.EXAMPLES_ENABLED
              && (
                <li className="nav__dropdown-item">
                  <Link
                    to="/p5/sketches"
                    onFocus={this.handleFocusForFile}
                    onBlur={this.handleBlur}
                    onClick={this.setDropdownForNone}
                  >
                    Examples
                  </Link>
                </li>
              )}
            </ul>
          </li>
          <li className={navDropdownState.edit}>
            <button
              type="button"
              onClick={this.toggleDropdownForEdit}
              onBlur={this.handleBlur}
              onFocus={this.clearHideTimeout}
              onMouseOver={() => {
                if (dropdownOpen !== 'none') {
                  this.setDropdown('edit');
                }
              }}
            >
              <span className="nav__item-header">Edit</span>
              <InlineSVG className="nav__item-header-triangle" src={triangleUrl} />
            </button>
            <ul className="nav__dropdown">
              <li className="nav__dropdown-item">
                <button
                  type="button"
                  onClick={() => {
                    cmController.tidyCode();
                    this.setDropdown('none');
                  }}
                  onFocus={this.handleFocusForEdit}
                  onBlur={this.handleBlur}
                >
                  Tidy Code
                  <span className="nav__keyboard-shortcut">
                    {'\u21E7'}
                    +Tab
                  </span>
                </button>
              </li>
              <li className="nav__dropdown-item">
                <button
                  type="button"
                  onClick={this.handleFind}
                  onFocus={this.handleFocusForEdit}
                  onBlur={this.handleBlur}
                >
                  Find
                  <span className="nav__keyboard-shortcut">
                    {metaKeyName}
                    +F
                  </span>
                </button>
              </li>
              <li className="nav__dropdown-item">
                <button
                  type="button"
                  onClick={this.handleFindNext}
                  onFocus={this.handleFocusForEdit}
                  onBlur={this.handleBlur}
                >
                  Find Next
                  <span className="nav__keyboard-shortcut">
                    {metaKeyName}
                    +G
                  </span>
                </button>
              </li>
              <li className="nav__dropdown-item">
                <button
                  type="button"
                  onClick={this.handleFindPrevious}
                  onFocus={this.handleFocusForEdit}
                  onBlur={this.handleBlur}
                >
                  Find Previous
                  <span className="nav__keyboard-shortcut">
                    {'\u21E7'}
                    +
                    {metaKeyName}
                    +G
                  </span>
                </button>
              </li>
            </ul>
          </li>
          <li className={navDropdownState.sketch}>
            <button
              type="button"
              onClick={this.toggleDropdownForSketch}
              onBlur={this.handleBlur}
              onFocus={this.clearHideTimeout}
              onMouseOver={() => {
                if (dropdownOpen !== 'none') {
                  this.setDropdown('sketch');
                }
              }}
            >
              <span className="nav__item-header">Sketch</span>
              <InlineSVG className="nav__item-header-triangle" src={triangleUrl} />
            </button>
            <ul className="nav__dropdown">
              {/* <li className="nav__dropdown-item">
                <button
                  type="button"
                  onClick={this.handleAddFile}
                  onFocus={this.handleFocusForSketch}
                  onBlur={this.handleBlur}
                >
                  Add File
                </button>
              </li> */}
              {/* <li className="nav__dropdown-item">
                <button
                  type="button"
                  onClick={this.handleAddFolder}
                  onFocus={this.handleFocusForSketch}
                  onBlur={this.handleBlur}
                >
                  Add Folder
                </button>
              </li> */}
              <li className="nav__dropdown-item">
                <button
                  type="button"
                  onClick={this.handleRun}
                  onFocus={this.handleFocusForSketch}
                  onBlur={this.handleBlur}
                >
                  Run
                  <span className="nav__keyboard-shortcut">
                    {metaKeyName}
                    +Enter
                  </span>
                </button>
              </li>
              <li className="nav__dropdown-item">
                <button
                  type="button"
                  onClick={this.handleStop}
                  onFocus={this.handleFocusForSketch}
                  onBlur={this.handleBlur}
                >
                  Stop
                  <span className="nav__keyboard-shortcut">
                    {'\u21E7'}
                    +
                    {metaKeyName}
                    +Enter
                  </span>
                </button>
              </li>
              {/* <li className="nav__dropdown-item">
                <button
                  onClick={this.handleStartAccessible}
                  onFocus={this.handleFocusForSketch}
                  onBlur={this.handleBlur}
                >
                  Start Accessible
                  <span className="nav__keyboard-shortcut">{'\u21E7'}+{metaKeyName}+1</span>
                </button>
              </li>
              <li className="nav__dropdown-item">
                <button
                  onClick={this.handleStopAccessible}
                  onFocus={this.handleFocusForSketch}
                  onBlur={this.handleBlur}
                >
                  Stop Accessible
                  <span className="nav__keyboard-shortcut">{'\u21E7'}+{metaKeyName}+2</span>
                </button>
              </li> */}
            </ul>
          </li>
          <li className={navDropdownState.help}>
            <button
              type="button"
              onClick={this.toggleDropdownForHelp}
              onBlur={this.handleBlur}
              onFocus={this.clearHideTimeout}
              onMouseOver={() => {
                if (dropdownOpen !== 'none') {
                  this.setDropdown('help');
                }
              }}
            >
              <span className="nav__item-header">Help</span>
              <InlineSVG className="nav__item-header-triangle" src={triangleUrl} />
            </button>
            <ul className="nav__dropdown">
              <li className="nav__dropdown-item">
                <button
                  type="button"
                  onFocus={this.handleFocusForHelp}
                  onBlur={this.handleBlur}
                  onClick={this.handleKeyboardShortcuts}
                >
                  Keyboard Shortcuts
                </button>
              </li>
              <li className="nav__dropdown-item">
                <a
                  href="https://p5js.org/reference/#group-Shape"
                  target="_blank"
                  rel="noopener noreferrer"
                  onFocus={this.handleFocusForHelp}
                  onBlur={this.handleBlur}
                  onClick={this.setDropdownForNone}
                >
                  Reference
                </a>
              </li>
            </ul>
          </li>
        </ul>
        { __process.env.LOGIN_ENABLED && !user.authenticated
        && (
          <ul className="nav__items-right" title="user-menu">
            <li>
              <Link to="/login">
                <span className="nav__item-header">Log in</span>
              </Link>
            </li>
            <span className="nav__item-spacer">or</span>
            <li>
              <Link to="/signup">
                <span className="nav__item-header">Sign up</span>
              </Link>
            </li>
          </ul>
        )}
        { __process.env.LOGIN_ENABLED && user.authenticated
        && (
          <ul className="nav__items-right" title="user-menu">
            <li className="nav__item">
              <span>
                Hello,
                {user.username}
                !
              </span>
            </li>
            <span className="nav__item-spacer">|</span>
            <li className={navDropdownState.account}>
              <button
                type="button"
                className="nav__item-header"
                onClick={this.toggleDropdownForAccount}
                onBlur={this.handleBlur}
                onFocus={this.clearHideTimeout}
                onMouseOver={() => {
                  if (dropdownOpen !== 'none') {
                    this.setDropdown('account');
                  }
                }}
              >
                My Account
                <InlineSVG className="nav__item-header-triangle" src={triangleUrl} />
              </button>
              <ul className="nav__dropdown">
                <li className="nav__dropdown-item">
                  <Link
                    to={`/${user.username}/sketches`}
                    onFocus={this.handleFocusForAccount}
                    onBlur={this.handleBlur}
                    onClick={this.setDropdownForNone}
                  >
                    My sketches
                  </Link>
                </li>
                <li className="nav__dropdown-item">
                  <Link
                    to="/assets"
                    onFocus={this.handleFocusForAccount}
                    onBlur={this.handleBlur}
                    onClick={this.setDropdownForNone}
                  >
                    My assets
                  </Link>
                </li>
                <li className="nav__dropdown-item">
                  <Link
                    to="/account"
                    onFocus={this.handleFocusForAccount}
                    onBlur={this.handleBlur}
                    onClick={this.setDropdownForNone}
                  >
                    Settings
                  </Link>
                </li>
                <li className="nav__dropdown-item">
                  <button
                    type="button"
                    onClick={this.handleLogout}
                    onFocus={this.handleFocusForAccount}
                    onBlur={this.handleBlur}
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        )}
        {/*
        <div className="nav__announce">
          This is a preview version of the editor, that has not yet been officially released.
          It is in development, you can report bugs <a
            href="https://github.com/processing/p5.js-web-editor/issues"
            target="_blank"
            rel="noopener noreferrer"
          >here</a>.
          Please use with caution.
        </div>
      */}
      </nav>
    );
  }
}

Nav.propTypes = {
  newProject: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  setToastText: PropTypes.func.isRequired,
  saveProject: PropTypes.func.isRequired,
  autosaveProject: PropTypes.func.isRequired,
  exportProjectAsZip: PropTypes.func.isRequired,
  cloneProject: PropTypes.func.isRequired,
  user: PropTypes.shape({
    authenticated: PropTypes.bool.isRequired,
    username: PropTypes.string,
    id: PropTypes.string
  }).isRequired,
  project: PropTypes.shape({
    id: PropTypes.string,
    owner: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  logoutUser: PropTypes.func.isRequired,
  showShareModal: PropTypes.func.isRequired,
  showErrorModal: PropTypes.func.isRequired,
  unsavedChanges: PropTypes.bool.isRequired,
  warnIfUnsavedChanges: PropTypes.func.isRequired,
  showKeyboardShortcutModal: PropTypes.func.isRequired,
  cmController: PropTypes.shape({
    tidyCode: PropTypes.func,
    showFind: PropTypes.func,
    findNext: PropTypes.func,
    findPrev: PropTypes.func,
    getContent: PropTypes.func
  }),
  startSketch: PropTypes.func.isRequired,
  stopSketch: PropTypes.func.isRequired,
  setAllAccessibleOutput: PropTypes.func.isRequired,
  newFile: PropTypes.func.isRequired,
  newFolder: PropTypes.func.isRequired
};

Nav.defaultProps = {
  project: {
    id: undefined,
    owner: undefined
  },
  cmController: {}
};

function mapStateToProps(state) {
  return {
    project: state.project,
    user: state.user,
    unsavedChanges: state.ide.unsavedChanges
  };
}

const mapDispatchToProps = {
  ...IDEActions,
  ...projectActions,
  ...toastActions,
  logoutUser,
  setAllAccessibleOutput
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav));
export { Nav as NavComponent };
