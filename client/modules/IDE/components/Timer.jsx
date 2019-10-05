import classNames from 'classnames';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import PropTypes from 'prop-types';
import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.showSavedTime = this.showSavedTime.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 10000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  showSavedTime() {
    const { projectSavedTime } = this.props
    const now = new Date();
    if (Math.abs(differenceInMilliseconds(now, projectSavedTime) < 10000)) {
      return 'Saved: just now';
    }
    if (differenceInMilliseconds(now, projectSavedTime) < 20000) {
      return 'Saved: 15 seconds ago';
    }
    if (differenceInMilliseconds(now, projectSavedTime) < 30000) {
      return 'Saved: 25 seconds ago';
    }
    if (differenceInMilliseconds(now, projectSavedTime) < 46000) {
      return 'Saved: 35 seconds ago';
    }
    return `Saved: ${formatDistanceToNow(projectSavedTime, {
      includeSeconds: true
    })} ago`;
  }

  render() {
    const { isUserOwner, projectSavedTime } = this.props
    const timerClass = classNames({
      'timer__saved-time': true,
      'timer__saved-time--notOwner': !isUserOwner
    });
    return (
      <span className={timerClass}>
        {projectSavedTime !== '' ? this.showSavedTime() : null}
      </span>
    );
  }
}

Timer.propTypes = {
  projectSavedTime: PropTypes.string.isRequired,
  isUserOwner: PropTypes.bool
};

Timer.defaultProps = {
  isUserOwner: false
};

export default Timer;
