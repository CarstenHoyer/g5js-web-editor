import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import prettyBytes from 'pretty-bytes';

import Loader from '../../App/components/loader';
import * as AssetActions from '../actions/assets';

class AssetList extends React.Component {
  constructor(props) {
    super(props);
    props.getAssets();
  }

  getAssetsTitle() {
    const { username, user } = this.props
    if (!username || username === user.username) {
      return 'p5.js Web Editor | My assets';
    }
    return `p5.js Web Editor | ${username}'s assets`;
  }

  hasAssets() {
    const { loading, assetList } = this.props
    return !loading && assetList.length > 0;
  }

  renderLoader() {
    const { loading } = this.props
    if (loading) return <Loader />;
    return null;
  }

  renderEmptyTable() {
    const { loading, assetList } = this.props
    if (!loading && assetList.length === 0) {
      return (<p className="asset-table__empty">No uploaded assets.</p>);
    }
    return null;
  }

  render() {
    const {
      username: uname,
      user,
      assetList,
      totalSize
    } = this.props
    const username = uname !== undefined ? uname : user.username;
    return (
      <div className="asset-table-container">
        {/* Eventually, this copy should be Total / 250 MB Used */}
        {this.hasAssets() && <p className="asset-table__total">{`${prettyBytes(totalSize)} Total`}</p>}
        <Helmet>
          <title>{this.getAssetsTitle()}</title>
        </Helmet>
        {this.renderLoader()}
        {this.renderEmptyTable()}
        {this.hasAssets()
        && (
          <table className="asset-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>View</th>
                <th>Sketch</th>
              </tr>
            </thead>
            <tbody>
              {
                assetList.map((asset) => (
                  <tr className="asset-table__row" key={asset.key}>
                    <td>{asset.name}</td>
                    <td>{prettyBytes(asset.size)}</td>
                    <td><Link to={asset.url} target="_blank">View</Link></td>
                    <td><Link to={`/${username}/sketches/${asset.sketchId}`}>{asset.sketchName}</Link></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

AssetList.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string
  }).isRequired,
  username: PropTypes.string.isRequired,
  assetList: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    sketchName: PropTypes.string.isRequired,
    sketchId: PropTypes.string.isRequired
  })).isRequired,
  totalSize: PropTypes.number.isRequired,
  getAssets: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user,
    assetList: state.assets.list,
    totalSize: state.assets.totalSize,
    loading: state.loading
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AssetActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetList);
