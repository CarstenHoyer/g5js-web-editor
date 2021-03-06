import PropTypes from 'prop-types';
import React from 'react';
import InlineSVG from 'react-inlinesvg';

const exitUrl = require('../../../images/exit.svg');

class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.keyPressHandle = this.keyPressHandle.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
    document.addEventListener('keydown', this.keyPressHandle);
    this.node.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
    document.removeEventListener('keydown', this.keyPressHandle);
  }

  handleClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }

    this.handleClickOutside(e);
  }

  handleClickOutside() {
    this.close();
  }

  keyPressHandle(e) {
    // escape key code = 27.
    // So here we are checking if the key pressed was Escape key.
    if (e.keyCode === 27) {
      this.close();
    }
  }

  close() {
    const { closeOverlay } = this.props
    // Only close if it is the last (and therefore the topmost overlay)
    const overlays = document.getElementsByClassName('overlay');
    if (this.node.parentElement.parentElement !== overlays[overlays.length - 1]) return;

    if (!closeOverlay) {
      // browserHistory.push(previousPath);
    } else {
      closeOverlay();
    }
  }

  render() {
    const {
      ariaLabel,
      title,
      children
    } = this.props;
    return (
      <div className="overlay">
        <div className="overlay__content">
          <section
            role="main"
            aria-label={ariaLabel}
            ref={(node) => { this.node = node; }}
            className="overlay__body"
          >
            <header className="overlay__header">
              <h2 className="overlay__title">{title}</h2>
              <button
                type="button"
                className="overlay__close-button"
                onClick={this.close}
              >
                <InlineSVG src={exitUrl} alt="close overlay" />
              </button>
            </header>
            {children}
          </section>
        </div>
      </div>
    );
  }
}

Overlay.propTypes = {
  children: PropTypes.element,
  closeOverlay: PropTypes.func,
  title: PropTypes.string,
  ariaLabel: PropTypes.string,
  // previousPath: PropTypes.string
};

Overlay.defaultProps = {
  children: null,
  title: 'Modal',
  closeOverlay: null,
  ariaLabel: 'modal',
  // previousPath: '/'
};

export default Overlay;
