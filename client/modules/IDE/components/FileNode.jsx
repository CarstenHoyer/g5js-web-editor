import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InlineSVG from 'react-inlinesvg';
import classNames from 'classnames';
import * as IDEActions from '../actions/ide';
import * as FileActions from '../actions/files';

const downArrowUrl = require('../../../images/down-filled-triangle.svg');
const folderRightUrl = require('../../../images/triangle-arrow-right.svg');
const folderDownUrl = require('../../../images/triangle-arrow-down.svg');
const fileUrl = require('../../../images/file.svg');

export class FileNode extends React.Component {
  constructor(props) {
    super(props);
    this.renderChild = this.renderChild.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleFileNameChange = this.handleFileNameChange.bind(this);
    this.validateFileName = this.validateFileName.bind(this);
    this.handleFileClick = this.handleFileClick.bind(this);
    this.toggleFileOptions = this.toggleFileOptions.bind(this);
    this.hideFileOptions = this.hideFileOptions.bind(this);
    this.showEditFileName = this.showEditFileName.bind(this);
    this.hideEditFileName = this.hideEditFileName.bind(this);
    this.onBlurComponent = this.onBlurComponent.bind(this);
    this.onFocusComponent = this.onFocusComponent.bind(this);

    this.state = {
      isOptionsOpen: false,
      isEditingName: false,
      isFocused: false,
    };
  }

  onFocusComponent() {
    this.setState({ isFocused: true });
  }

  onBlurComponent() {
    const { isFocused } = this.state
    this.setState({ isFocused: false });
    setTimeout(() => {
      if (!isFocused) {
        this.hideFileOptions();
      }
    }, 200);
  }

  handleFileClick(e) {
    e.stopPropagation();
    const { name, setSelectedFile, id } = this.props
    if (name !== 'root' && !this.isDeleting) {
      setSelectedFile(id);
    }
  }

  handleFileNameChange(event) {
    const { updateFileName, id } = this.props
    updateFileName(id, event.target.value);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.hideEditFileName();
    }
  }

  validateFileName() {
    const {
      name,
      fileType,
      updateFileName,
      id
    } = this.props
    const oldFileExtension = this.originalFileName.match(/\.[0-9a-z]+$/i);
    const newFileExtension = name.match(/\.[0-9a-z]+$/i);
    const hasPeriod = name.match(/\.+/);
    const newFileName = name;
    const hasNoExtension = oldFileExtension && !newFileExtension;
    const hasExtensionIfFolder = fileType === 'folder' && hasPeriod;
    const notSameExtension = oldFileExtension && newFileExtension
      && oldFileExtension[0].toLowerCase() !== newFileExtension[0].toLowerCase();
    const hasEmptyFilename = newFileName === '';
    const hasOnlyExtension = newFileExtension && newFileName === newFileExtension[0];
    if (hasEmptyFilename || hasNoExtension || notSameExtension || hasOnlyExtension || hasExtensionIfFolder) {
      updateFileName(id, this.originalFileName);
    }
  }

  toggleFileOptions(e) {
    e.preventDefault();
    const { canEdit, id } = this.props
    const { isOptionsOpen } = this.state
    if (!canEdit) {
      return;
    }
    if (isOptionsOpen) {
      this.setState({ isOptionsOpen: false });
    } else {
      this[`fileOptions-${id}`].focus();
      this.setState({ isOptionsOpen: true });
    }
  }

  hideFileOptions() {
    this.setState({ isOptionsOpen: false });
  }

  showEditFileName() {
    this.setState({ isEditingName: true });
  }

  hideEditFileName() {
    this.setState({ isEditingName: false });
  }

  renderChild(childId) {
    const { id, canEdit } = this.props
    return (
      <li key={childId}>
        <ConnectedFileNode id={childId} parentId={id} canEdit={canEdit} />
      </li>
    );
  }

  render() {
    const {
      name,
      isSelectedFile,
      isFolderClosed,
      fileType,
      newFile,
      showFolderChildren,
      hideFolderChildren,
      id,
      newFolder,
      resetSelectedFile,
      deleteFile,
      parentId,
      children
    } = this.props
    const { isOptionsOpen, isEditingName } = this.state
    const itemClass = classNames({
      'sidebar__root-item': name === 'root',
      'sidebar__file-item': name !== 'root',
      'sidebar__file-item--selected': isSelectedFile,
      'sidebar__file-item--open': isOptionsOpen,
      'sidebar__file-item--editing': isEditingName,
      'sidebar__file-item--closed': isFolderClosed
    });

    return (
      <div className={itemClass}>
        {(() => { // eslint-disable-line
          if (name !== 'root') {
            return (
              <div className="file-item__content" onContextMenu={this.toggleFileOptions}>
                <span className="file-item__spacer"></span>
                {(() => { // eslint-disable-line
                  if (fileType === 'file') {
                    return (
                      <span className="sidebar__file-item-icon">
                        <InlineSVG src={fileUrl} />
                      </span>
                    );
                  }
                  return (
                    <div className="sidebar__file-item--folder">
                      <button
                        type="button"
                        className="sidebar__file-item-closed"
                        onClick={() => showFolderChildren(id)}
                      >
                        <InlineSVG className="folder-right" src={folderRightUrl} />
                      </button>
                      <button
                        type="button"
                        className="sidebar__file-item-open"
                        onClick={() => hideFolderChildren(id)}
                      >
                        <InlineSVG className="folder-down" src={folderDownUrl} />
                      </button>
                    </div>
                  );
                })()}
                <button type="button" className="sidebar__file-item-name" onClick={this.handleFileClick}>{name}</button>
                <input
                  type="text"
                  className="sidebar__file-item-input"
                  value={name}
                  onChange={this.handleFileNameChange}
                  ref={(element) => { this.fileNameInput = element; }}
                  onBlur={() => {
                    this.validateFileName();
                    this.hideEditFileName();
                  }}
                  onKeyPress={this.handleKeyPress}
                />
                {/* <button
                  type="button"
                  className="sidebar__file-item-show-options"
                  aria-label="view file options"
                  ref={(element) => { this[`fileOptions-${id}`] = element; }}
                  tabIndex="0"
                  onClick={this.toggleFileOptions}
                  onBlur={this.onBlurComponent}
                  onFocus={this.onFocusComponent}
                >
                  <InlineSVG src={downArrowUrl} />
                </button> */}
                {/* <div className="sidebar__file-item-options">
                  <ul title="file options">
                    {(() => { // eslint-disable-line
                      if (fileType === 'folder') {
                        return (
                          <li>
                            <button
                              type="button"
                              aria-label="add file"
                              onClick={() => {
                                newFile();
                                setTimeout(() => this.hideFileOptions(), 0);
                              }}
                              onBlur={this.onBlurComponent}
                              onFocus={this.onFocusComponent}
                              className="sidebar__file-item-option"
                            >
                              Add File
                            </button>
                          </li>
                        );
                      }
                    })()}
                    {(() => { // eslint-disable-line
                      if (fileType === 'folder') {
                        return (
                          <li>
                            <button
                              type="button"
                              aria-label="add folder"
                              onClick={() => {
                                newFolder();
                                setTimeout(() => this.hideFileOptions(), 0);
                              }}
                              onBlur={this.onBlurComponent}
                              onFocus={this.onFocusComponent}
                              className="sidebar__file-item-option"
                            >
                              Add Folder
                            </button>
                          </li>
                        );
                      }
                    })()}
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          this.originalFileName = name;
                          this.showEditFileName();
                          setTimeout(() => this.fileNameInput.focus(), 0);
                          setTimeout(() => this.hideFileOptions(), 0);
                        }}
                        onBlur={this.onBlurComponent}
                        onFocus={this.onFocusComponent}
                        className="sidebar__file-item-option"
                      >
                        Rename
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${name}?`)) {
                            this.isDeleting = true;
                            resetSelectedFile(id);
                            setTimeout(() => deleteFile(id, parentId), 100);
                          }
                        }}
                        onBlur={this.onBlurComponent}
                        onFocus={this.onFocusComponent}
                        className="sidebar__file-item-option"
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div> */}
              </div>
            );
          }
        })()}
        {(() => { // eslint-disable-line
          if (children) {
            return (
              <ul className="file-item__children">
                {children.map(this.renderChild)}
              </ul>
            );
          }
        })()}
      </div>
    );
  }
}

FileNode.propTypes = {
  id: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  name: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  isSelectedFile: PropTypes.bool,
  isFolderClosed: PropTypes.bool,
  setSelectedFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  updateFileName: PropTypes.func.isRequired,
  resetSelectedFile: PropTypes.func.isRequired,
  newFile: PropTypes.func.isRequired,
  newFolder: PropTypes.func.isRequired,
  showFolderChildren: PropTypes.func.isRequired,
  hideFolderChildren: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired
};

FileNode.defaultProps = {
  parentId: '0',
  isSelectedFile: false,
  isFolderClosed: false
};

function mapStateToProps(state, ownProps) {
  // this is a hack, state is updated before ownProps
  return state.files.find((file) => file.id === ownProps.id) || { name: 'test', fileType: 'file' };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign(FileActions, IDEActions), dispatch);
}

const ConnectedFileNode = connect(mapStateToProps, mapDispatchToProps)(FileNode);
export default ConnectedFileNode;
