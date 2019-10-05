import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import InlineSVG from 'react-inlinesvg';
import ConnectedFileNode from './FileNode';

const downArrowUrl = require('../../../images/down-filled-triangle.svg');

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.resetSelectedFile = this.resetSelectedFile.bind(this);
    this.toggleProjectOptions = this.toggleProjectOptions.bind(this);
    this.onBlurComponent = this.onBlurComponent.bind(this);
    this.onFocusComponent = this.onFocusComponent.bind(this);

    this.state = {
      isFocused: false,
    };
  }

  onBlurComponent() {
    const { closeProjectOptions } = this.props
    const { isFocused } = this.state
    this.setState({ isFocused: false });
    setTimeout(() => {
      if (!isFocused) {
        closeProjectOptions();
      }
    }, 200);
  }

  onFocusComponent() {
    this.setState({ isFocused: true });
  }

  resetSelectedFile() {
    const { setSelectedFile, files } = this.props
    setSelectedFile(files[1].id);
  }

  toggleProjectOptions(e) {
    e.preventDefault();
    const {
      projectOptionsVisible,
      closeProjectOptions,
      openProjectOptions
    } = this.props
    if (projectOptionsVisible) {
      closeProjectOptions();
    } else {
      this.sidebarOptions.focus();
      openProjectOptions();
    }
  }

  userCanEditProject() {
    const { owner, user } = this.props
    let canEdit;
    if (!owner) {
      canEdit = true;
    } else if (user.authenticated && owner.id === user.id) {
      canEdit = true;
    } else {
      canEdit = false;
    }
    return canEdit;
  }

  render() {
    const {
      isExpanded,
      projectOptionsVisible,
      newFolder,
      closeProjectOptions,
      newFile,
      files
    } = this.props
    const canEditProject = this.userCanEditProject();
    const sidebarClass = classNames({
      'sidebar': true,
      'sidebar--contracted': !isExpanded,
      'sidebar--project-options': projectOptionsVisible,
      'sidebar--cant-edit': !canEditProject
    });

    return (
      <nav className={sidebarClass} title="file-navigation">
        <div className="sidebar__header" onContextMenu={this.toggleProjectOptions}>
          <h3 className="sidebar__title">
            <span>Sketch Files</span>
          </h3>
          {/* <div className="sidebar__icons">
            <button
              type="button"
              aria-label="add file or folder"
              className="sidebar__add"
              tabIndex="0"
              ref={(element) => { this.sidebarOptions = element; }}
              onClick={this.toggleProjectOptions}
              onBlur={this.onBlurComponent}
              onFocus={this.onFocusComponent}
            >
              <InlineSVG src={downArrowUrl} />
            </button>
            <ul className="sidebar__project-options">
              <li>
                <button
                  type="button"
                  aria-label="add folder"
                  onClick={() => {
                    newFolder();
                    setTimeout(closeProjectOptions, 0);
                  }}
                  onBlur={this.onBlurComponent}
                  onFocus={this.onFocusComponent}
                >
                  Add folder
                </button>
              </li>
              <li>
                <button
                  type="button"
                  aria-label="add file"
                  onClick={() => {
                    newFile();
                    setTimeout(closeProjectOptions, 0);
                  }}
                  onBlur={this.onBlurComponent}
                  onFocus={this.onFocusComponent}
                >
                  Add file
                </button>
              </li>
            </ul>
          </div> */}
        </div>
        <ConnectedFileNode
          id={files.filter((file) => file.name === 'root')[0].id}
          canEdit={canEditProject}
        />
      </nav>
    );
  }
}

Sidebar.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  })).isRequired,
  setSelectedFile: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  projectOptionsVisible: PropTypes.bool.isRequired,
  newFile: PropTypes.func.isRequired,
  openProjectOptions: PropTypes.func.isRequired,
  closeProjectOptions: PropTypes.func.isRequired,
  newFolder: PropTypes.func.isRequired,
  owner: PropTypes.shape({
    id: PropTypes.string
  }),
  user: PropTypes.shape({
    id: PropTypes.string,
    authenticated: PropTypes.bool.isRequired
  }).isRequired
};

Sidebar.defaultProps = {
  owner: undefined
};

export default Sidebar;
