import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import InlineSVG from 'react-inlinesvg';

import * as IDEActions from '../actions/ide';
import * as preferenceActions from '../actions/preferences';
import * as projectActions from '../actions/project';

const playUrl = require('../../../images/play.svg');
const stopUrl = require('../../../images/stop.svg');
const preferencesUrl = require('../../../images/preferences.svg');
const editProjectNameUrl = require('../../../images/pencil.svg');

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleProjectNameChange = this.handleProjectNameChange.bind(this);
  }

  handleKeyPress(event) {
    const { hideEditProjectName } = this.props
    if (event.key === 'Enter') {
      hideEditProjectName();
    }
  }

  handleProjectNameChange(event) {
    const { setProjectName } = this.props
    setProjectName(event.target.value);
  }

  validateProjectName() {
    const { project, setProjectName } = this.props
    if (project.name === '') {
      setProjectName(this.originalProjectName);
    }
  }

  canEditProjectName() {
    const { owner, currentUser } = this.props
    return (owner && owner.username
      && owner.username === currentUser)
      || !owner || !owner.username;
  }

  render() {
    const {
      isPlaying,
      preferencesIsVisible,
      project,
      startAccessibleSketch,
      setTextOutput,
      setGridOutput,
      infiniteLoop,
      startSketch,
      stopSketch,
      autorefresh,
      setAutorefresh,
      owner,
      showEditProjectName,
      hideEditProjectName,
      saveProject,
      openPreferences
    } = this.props
    const playButtonClass = classNames({
      'toolbar__play-button': true,
      'toolbar__play-button--selected': isPlaying
    });
    const stopButtonClass = classNames({
      'toolbar__stop-button': true,
      'toolbar__stop-button--selected': !isPlaying
    });
    const preferencesButtonClass = classNames({
      'toolbar__preferences-button': true,
      'toolbar__preferences-button--selected': preferencesIsVisible
    });
    const nameContainerClass = classNames({
      'toolbar__project-name-container': true,
      'toolbar__project-name-container--editing': project.isEditingName
    });

    return (
      <div className="toolbar">
        <button
          type="button"
          className="toolbar__play-sketch-button"
          onClick={() => {
            startAccessibleSketch();
            setTextOutput(true);
            setGridOutput(true);
          }}
          aria-label="play sketch"
          disabled={infiniteLoop}
        >
          <InlineSVG src={playUrl} alt="Play Sketch" />
        </button>
        <button
          type="button"
          className={playButtonClass}
          onClick={startSketch}
          aria-label="play only visual sketch"
          disabled={infiniteLoop}
        >
          <InlineSVG src={playUrl} alt="Play only visual Sketch" />
        </button>
        <button
          type="button"
          className={stopButtonClass}
          onClick={stopSketch}
          aria-label="stop sketch"
        >
          <InlineSVG src={stopUrl} alt="Stop Sketch" />
        </button>
        <div className="toolbar__autorefresh">
          <input
            id="autorefresh"
            type="checkbox"
            checked={autorefresh}
            onChange={(event) => {
              setAutorefresh(event.target.checked);
            }}
          />
          {
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label htmlFor="autorefresh" className="toolbar__autorefresh-label">
              Auto-refresh
            </label>
          }
        </div>
        {/* <div className={nameContainerClass}>
          <a
            className="toolbar__project-name"
            href={owner ? `/${owner.username}/sketches/${project.id}` : ''}
            onClick={(e) => {
              if (this.canEditProjectName()) {
                e.preventDefault();
                this.originalProjectName = project.name;
                showEditProjectName();
                setTimeout(() => this.projectNameInput.focus(), 0);
              }
            }}
          >
            {project.name}
            &nbsp;
            {
              this.canEditProjectName()
              && <InlineSVG className="toolbar__edit-name-button" src={editProjectNameUrl} alt="Edit Project Name" />
            }
          </a>
          <input
            type="text"
            maxLength="256"
            className="toolbar__project-name-input"
            value={project.name}
            onChange={this.handleProjectNameChange}
            ref={(element) => { this.projectNameInput = element; }}
            onBlur={() => {
              this.validateProjectName();
              hideEditProjectName();
              if (project.id) {
                saveProject();
              }
            }}
            onKeyPress={this.handleKeyPress}
          />
          {(() => { // eslint-disable-line
            if (owner) {
              return (
                <p className="toolbar__project-owner">
                  by
                  <Link to={`/${owner.username}/sketches`}>{owner.username}</Link>
                </p>
              );
            }
          })()}
        </div> */}
        <button
          type="button"
          className={preferencesButtonClass}
          onClick={openPreferences}
          aria-label="preferences"
        >
          <InlineSVG src={preferencesUrl} alt="Preferences" />
        </button>
      </div>
    );
  }
}

Toolbar.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  preferencesIsVisible: PropTypes.bool.isRequired,
  stopSketch: PropTypes.func.isRequired,
  setProjectName: PropTypes.func.isRequired,
  openPreferences: PropTypes.func.isRequired,
  owner: PropTypes.shape({
    username: PropTypes.string
  }),
  project: PropTypes.shape({
    name: PropTypes.string.isRequired,
    isEditingName: PropTypes.bool,
    id: PropTypes.string,
  }).isRequired,
  showEditProjectName: PropTypes.func.isRequired,
  hideEditProjectName: PropTypes.func.isRequired,
  infiniteLoop: PropTypes.bool.isRequired,
  autorefresh: PropTypes.bool.isRequired,
  setAutorefresh: PropTypes.func.isRequired,
  setTextOutput: PropTypes.func.isRequired,
  setGridOutput: PropTypes.func.isRequired,
  startSketch: PropTypes.func.isRequired,
  startAccessibleSketch: PropTypes.func.isRequired,
  saveProject: PropTypes.func.isRequired,
  currentUser: PropTypes.string
};

Toolbar.defaultProps = {
  owner: undefined,
  currentUser: undefined
};

function mapStateToProps(state) {
  return {
    autorefresh: state.preferences.autorefresh,
    currentUser: state.user.username,
    infiniteLoop: state.ide.infiniteLoop,
    isPlaying: state.ide.isPlaying,
    owner: state.project.owner,
    preferencesIsVisible: state.ide.preferencesIsVisible,
    project: state.project,
  };
}

const mapDispatchToProps = {
  ...IDEActions,
  ...preferenceActions,
  ...projectActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
