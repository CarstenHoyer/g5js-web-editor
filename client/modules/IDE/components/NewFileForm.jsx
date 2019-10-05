import PropTypes from 'prop-types';
import React from 'react';
import { domOnlyProps } from '../../../utils/reduxFormUtils';

class NewFileForm extends React.Component {
  constructor(props) {
    super(props);
    this.createFile = props.createFile.bind(this);
  }

  componentDidMount() {
    this.fileName.focus();
  }

  render() {
    const {
      fields: { name },
      handleSubmit,
      focusOnModal
    } = this.props;
    return (
      <form
        className="new-file-form"
        onSubmit={(data) => {
          focusOnModal();
          handleSubmit(this.createFile)(data);
        }}
      >
        {
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label className="new-file-form__name-label" htmlFor="name">Name:</label>
        }
        <input
          className="new-file-form__name-input"
          id="name"
          type="text"
          placeholder="Name"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...domOnlyProps(name)}
          ref={(element) => { this.fileName = element; }}
        />
        <input type="submit" value="Add File" aria-label="add file" />
        {name.touched && name.error && <span className="form-error">{name.error}</span>}
      </form>
    );
  }
}

NewFileForm.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.object.isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createFile: PropTypes.func.isRequired,
  focusOnModal: PropTypes.func.isRequired
};

export default NewFileForm;
