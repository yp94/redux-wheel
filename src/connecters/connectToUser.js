import { connect } from "../redux";

const userSelector = (state) => {
  return {
    user: state.user,
  };
};

const userDispather = (dispath) => {
  return {
    updateUser: (attrs) => dispath({ type: "updateUser", payload: attrs }),
  };
};

export const connectToUser = connect(userSelector, userDispather);
