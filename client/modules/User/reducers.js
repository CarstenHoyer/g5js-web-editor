import * as ActionTypes from '../../constants';

const user = (state = { authenticated: false }, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_USER:
      return {
        ...action.user,
        authenticated: true
      };
    case ActionTypes.UNAUTH_USER:
      return {
        authenticated: false
      };
    case ActionTypes.AUTH_ERROR:
      return {
        authenticated: false
      };
    case ActionTypes.RESET_PASSWORD_INITIATE:
      return { ...state, resetPasswordInitiate: true }
    case ActionTypes.RESET_PASSWORD_RESET:
      return { ...state, resetPasswordInitiate: false }
    case ActionTypes.INVALID_RESET_PASSWORD_TOKEN:
      return { ...state, resetPasswordInvalid: true }
    case ActionTypes.EMAIL_VERIFICATION_INITIATE:
      return { ...state, emailVerificationInitiate: true }
    case ActionTypes.EMAIL_VERIFICATION_VERIFY:
      return { ...state, emailVerificationTokenState: 'checking' }
    case ActionTypes.EMAIL_VERIFICATION_VERIFIED:
      return { ...state, emailVerificationTokenState: 'verified' }
    case ActionTypes.EMAIL_VERIFICATION_INVALID:
      return { ...state, emailVerificationTokenState: 'invalid' }
    case ActionTypes.SETTINGS_UPDATED:
      return { ...state, ...action.user };
    default:
      return state;
  }
};

export default user;
