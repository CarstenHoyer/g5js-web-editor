// eslint-disable-next-line max-classes-per-file
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import InlineSVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import slugify from 'slugify';
import * as ProjectActions from '../actions/project';
import * as ProjectsActions from '../actions/projects';
import * as ToastActions from '../actions/toast';
import * as SortingActions from '../actions/sorting';
import * as IdeActions from '../actions/ide';
import getSortedSketches from '../selectors/projects';
import Loader from '../../App/components/loader';

const arrowUp = require('../../../images/sort-arrow-up.svg');
const arrowDown = require('../../../images/sort-arrow-down.svg');
const downFilledTriangle = require('../../../images/down-filled-triangle.svg');

class SketchListRowBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsOpen: false,
      renameOpen: false,
      renameValue: props.sketch.name,
      isFocused: false
    };
  }

  onFocusComponent = () => {
    this.setState({ isFocused: true });
  }

  onBlurComponent = () => {
    const { isFocused } = this.state
    this.setState({ isFocused: false });
    setTimeout(() => {
      if (!isFocused) {
        this.closeAll();
      }
    }, 200);
  }

  openOptions = () => {
    this.setState({
      optionsOpen: true
    });
  }

  closeOptions = () => {
    this.setState({
      optionsOpen: false
    });
  }

  toggleOptions = () => {
    const { optionsOpen } = this.state
    if (optionsOpen) {
      this.closeOptions();
    } else {
      this.openOptions();
    }
  }

  openRename = () => {
    this.setState({
      renameOpen: true
    });
  }

  closeRename = () => {
    this.setState({
      renameOpen: false
    });
  }

  closeAll = () => {
    this.setState({
      renameOpen: false,
      optionsOpen: false
    });
  }

  handleRenameChange = (e) => {
    this.setState({
      renameValue: e.target.value
    });
  }

  handleRenameEnter = (e) => {
    const { changeProjectName, sketch } = this.props
    const { renameValue } = this.state
    if (e.key === 'Enter') {
      // TODO pass this func
      changeProjectName(sketch.id, renameValue);
      this.closeAll();
    }
  }

  resetSketchName = () => {
    const { sketch } = this.props
    this.setState({
      renameValue: sketch.name
    });
  }

  handleDropdownOpen = () => {
    this.closeAll();
    this.openOptions();
  }

  handleRenameOpen = () => {
    this.closeAll();
    this.openRename();
  }

  handleSketchDownload = () => {
    const { exportProjectAsZip, sketch } = this.props
    exportProjectAsZip(sketch.id);
  }

  handleSketchDuplicate = () => {
    const { cloneProject, sketch } = this.props
    this.closeAll();
    cloneProject(sketch.id);
  }

  handleSketchShare = () => {
    const { showShareModal, sketch, username } = this.props
    this.closeAll();
    showShareModal(sketch.id, sketch.name, username);
  }

  handleSketchDelete = () => {
    const { deleteProject, sketch } = this.props
    this.closeAll();
    if (window.confirm(`Are you sure you want to delete "${sketch.name}"?`)) {
      deleteProject(sketch.id);
    }
  }

  render() {
    const { sketch, username, user } = this.props;
    const { renameOpen, optionsOpen, renameValue } = this.state;
    const userIsOwner = user.username === username;
    let url = `/${username}/sketches/${sketch.id}`;
    if (username === 'p5') {
      url = `/${username}/sketches/${slugify(sketch.name, '_')}`;
    }

    return null
    // return (
    //   <tr
    //     className="sketches-table__row"
    //     key={sketch.id}
    //   >
    //     <th scope="row">
    //       <Link to={url}>
    //         {renameOpen ? '' : sketch.name}
    //       </Link>
    //       {renameOpen
    //       && (
    //         <input
    //           value={renameValue}
    //           onChange={this.handleRenameChange}
    //           onKeyUp={this.handleRenameEnter}
    //           onBlur={this.resetSketchName}
    //           onClick={(e) => e.stopPropagation()}
    //         />
    //       )}
    //     </th>
    //     <td>{format(new Date(sketch.createdAt), 'MMM D, YYYY h:mm A')}</td>
    //     <td>{format(new Date(sketch.updatedAt), 'MMM D, YYYY h:mm A')}</td>
    //     <td className="sketch-list__dropdown-column">
    //       <button
    //         type="button"
    //         className="sketch-list__dropdown-button"
    //         onClick={this.toggleOptions}
    //         onBlur={this.onBlurComponent}
    //         onFocus={this.onFocusComponent}
    //       >
    //         <InlineSVG src={downFilledTriangle} alt="Menu" />
    //       </button>
    //       {optionsOpen
    //       && (
    //         <ul
    //           className="sketch-list__action-dialogue"
    //         >
    //           {userIsOwner
    //           && (
    //             <li>
    //               <button
    //                 type="button"
    //                 className="sketch-list__action-option"
    //                 onClick={this.handleRenameOpen}
    //                 onBlur={this.onBlurComponent}
    //                 onFocus={this.onFocusComponent}
    //               >
    //                 Rename
    //               </button>
    //             </li>
    //           )}
    //           <li>
    //             <button
    //               type="button"
    //               className="sketch-list__action-option"
    //               onClick={this.handleSketchDownload}
    //               onBlur={this.onBlurComponent}
    //               onFocus={this.onFocusComponent}
    //             >
    //               Download
    //             </button>
    //           </li>
    //           {user.authenticated
    //           && (
    //             <li>
    //               <button
    //                 type="button"
    //                 className="sketch-list__action-option"
    //                 onClick={this.handleSketchDuplicate}
    //                 onBlur={this.onBlurComponent}
    //                 onFocus={this.onFocusComponent}
    //               >
    //                 Duplicate
    //               </button>
    //             </li>
    //           )}
    //           { /* <li>
    //             <button
    //               className="sketch-list__action-option"
    //               onClick={this.handleSketchShare}
    //               onBlur={this.onBlurComponent}
    //               onFocus={this.onFocusComponent}
    //             >
    //               Share
    //             </button>
    //           </li> */ }
    //           {userIsOwner
    //           && (
    //             <li>
    //               <button
    //                 type="button"
    //                 className="sketch-list__action-option"
    //                 onClick={this.handleSketchDelete}
    //                 onBlur={this.onBlurComponent}
    //                 onFocus={this.onFocusComponent}
    //               >
    //                 Delete
    //               </button>
    //             </li>
    //           )}
    //         </ul>
    //       )}
    //     </td>
    //   </tr>
    // );
  }
}

SketchListRowBase.propTypes = {
  sketch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
  }).isRequired,
  username: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    authenticated: PropTypes.bool.isRequired
  }).isRequired,
  deleteProject: PropTypes.func.isRequired,
  showShareModal: PropTypes.func.isRequired,
  cloneProject: PropTypes.func.isRequired,
  exportProjectAsZip: PropTypes.func.isRequired,
  changeProjectName: PropTypes.func.isRequired
};

function mapDispatchToPropsSketchListRow(dispatch) {
  return bindActionCreators({ ...ProjectActions, ...IdeActions }, dispatch);
}

const SketchListRow = connect(null, mapDispatchToPropsSketchListRow)(SketchListRowBase);

class SketchList extends React.Component {
  constructor(props) {
    super(props);
    props.getProjects(props.username);
    props.resetSorting();
    this._renderFieldHeader = this._renderFieldHeader.bind(this);
  }

  getSketchesTitle() {
    const { username, user } = this.props
    if (username === user.username) {
      return 'p5.js Web Editor | My sketches';
    }
    return `p5.js Web Editor | ${username}'s sketches`;
  }

  hasSketches() {
    const { loading, sketches } = this.props
    return !loading && sketches.length > 0;
  }

  _renderLoader() {
    const { loading } = this.props
    if (loading) return <Loader />;
    return null;
  }

  _renderEmptyTable() {
    const { loading, sketches } = this.props
    if (!loading && sketches.length === 0) {
      return (<p className="sketches-table__empty">No sketches.</p>);
    }
    return null;
  }

  _renderFieldHeader(fieldName, displayName) {
    const { sorting, toggleDirectionForField } = this.props
    const { field, direction } = sorting;
    const headerClass = classNames({
      'sketches-table__header': true,
      'sketches-table__header--selected': field === fieldName
    });
    return (
      <th scope="col">
        <button
          type="button"
          className="sketch-list__sort-button"
          onClick={() => toggleDirectionForField(fieldName)}
        >
          <span className={headerClass}>{displayName}</span>
          {field === fieldName && direction === SortingActions.DIRECTION.ASC
          && <InlineSVG src={arrowUp} />}
          {field === fieldName && direction === SortingActions.DIRECTION.DESC
          && <InlineSVG src={arrowDown} />}
        </button>
      </th>
    );
  }

  render() {
    const { username: uname, user, sketches } = this.props
    const username = uname !== undefined ? uname : user.username;
    return (
      <div className="sketches-table-container">
        <Helmet>
          <title>{this.getSketchesTitle()}</title>
        </Helmet>
        {this._renderLoader()}
        {this._renderEmptyTable()}
        {this.hasSketches()
        && (
          <table className="sketches-table" summary="table containing all saved projects">
            <thead>
              <tr>
                {this._renderFieldHeader('name', 'Sketch')}
                {this._renderFieldHeader('createdAt', 'Date Created')}
                {this._renderFieldHeader('updatedAt', 'Date Updated')}
                {
                  // eslint-disable-next-line jsx-a11y/control-has-associated-label
                  <th scope="col"></th>
                }
              </tr>
            </thead>
            <tbody>
              {sketches.map((sketch) => (
                <SketchListRow
                  key={sketch.id}
                  sketch={sketch}
                  user={user}
                  username={username}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

SketchList.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    authenticated: PropTypes.bool.isRequired
  }).isRequired,
  getProjects: PropTypes.func.isRequired,
  sketches: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
  })).isRequired,
  sketch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
  }).isRequired,
  username: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  toggleDirectionForField: PropTypes.func.isRequired,
  resetSorting: PropTypes.func.isRequired,
  sorting: PropTypes.shape({
    field: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired
  }).isRequired,
  project: PropTypes.shape({
    id: PropTypes.string,
    owner: PropTypes.shape({
      id: PropTypes.string
    })
  })
};

SketchList.defaultProps = {
  project: {
    id: undefined,
    owner: undefined
  },
  username: undefined
};

function mapStateToProps(state) {
  return {
    user: state.user,
    sketches: getSortedSketches(state),
    sorting: state.sorting,
    loading: state.loading,
    project: state.project
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...ProjectsActions, ...ToastActions, ...SortingActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SketchList);
