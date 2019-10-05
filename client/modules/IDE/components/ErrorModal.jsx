import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

class ErrorModal extends React.Component {
  forceAuthentication() {
    const { closeModal } = this.props
    return (
      <p>
        In order to save sketches, you must be logged in. Please&nbsp;
        <Link to="/login" onClick={closeModal}>Login</Link>
        &nbsp;or&nbsp;
        <Link to="/signup" onClick={closeModal}>Sign Up</Link>
        .
      </p>
    );
  }

  staleSession() {
    const { closeModal } = this.props
    return (
      <p>
        It looks like you&apos;ve been logged out. Please&nbsp;
        <Link to="/login" onClick={closeModal}>log in</Link>
        .
      </p>
    );
  }

  staleProject() {
    return (
      <p>
        The project you have attempted to save has been saved from another window.
        Please refresh the page to see the latest version.
      </p>
    );
  }

  render() {
    const { type } = this.props
    return (
      <div className="error-modal__content">
        {(() => { // eslint-disable-line
          if (type === 'forceAuthentication') {
            return this.forceAuthentication();
          }
          if (type === 'staleSession') {
            return this.staleSession();
          }
          if (type === 'staleProject') {
            return this.staleProject();
          }
        })()}
      </div>
    );
  }
}

ErrorModal.propTypes = {
  type: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default ErrorModal;
