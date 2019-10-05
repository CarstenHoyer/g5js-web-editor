import PropTypes from 'prop-types';
import React from 'react';
// import { domOnlyProps } from '../../../utils/reduxFormUtils';

class NewFolderForm extends React.Component {
  constructor(props) {
    super(props);
    this.createFolder = props.createFolder.bind(this);
  }

  componentDidMount() {
    this.fileName.focus();
  }

  render() {
    return null
    // const {
    //   fields: { name },
    //   handleSubmit,
    //   closeModal
    // } = this.props;
    // return (
    //   <form
    //     className="new-folder-form"
    //     onSubmit={(data) => {
    //       if (handleSubmit(this.createFolder)(data)) {
    //         closeModal();
    //       }
    //     }}
    //   >
    //     {
    //       // eslint-disable-next-line jsx-a11y/label-has-associated-control
    //       <label className="new-folder-form__name-label" htmlFor="name">
    //         Name:
    //       </label>
    //     }
    //     <input
    //       className="new-folder-form__name-input"
    //       id="name"
    //       type="text"
    //       placeholder="Name"
    //       ref={(element) => { this.fileName = element; }}
    //       // eslint-disable-next-line react/jsx-props-no-spreading
    //       {...domOnlyProps(name)}
    //     />
    //     <input type="submit" value="Add Folder" aria-label="add folder" />
    //     {name.touched && name.error && <span className="form-error">{name.error}</span>}
    //   </form>
    // );
  }
}

NewFolderForm.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.object.isRequired
  }).isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  createFolder: PropTypes.func.isRequired,
  // closeModal: PropTypes.func.isRequired,
  // submitting: PropTypes.bool,
  // pristine: PropTypes.bool
};
NewFolderForm.defaultProps = {
  // submitting: false,
  // pristine: true
};
export default NewFolderForm;
