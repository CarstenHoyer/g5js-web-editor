import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InlineSVG from 'react-inlinesvg';
import * as ToastActions from '../actions/toast';

const exitUrl = require('../../../images/exit.svg');

function Toast(props) {
  const { text, hideToast } = props
  return (
    <section className="toast">
      <p>
        {text}
      </p>
      <button
        type="button"
        className="toast__close"
        onClick={hideToast}
      >
        <InlineSVG src={exitUrl} alt="Close Keyboard Shortcuts Overlay" />
      </button>
    </section>
  );
}

Toast.propTypes = {
  text: PropTypes.string.isRequired,
  hideToast: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return state.toast;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ToastActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Toast);
