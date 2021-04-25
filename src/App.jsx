import React from "react";
import { Provider, connect, createStore } from "./redux.jsx";
import { connectToUser } from "./connecters/connectToUser.js";

//规范state创建流程
const reducer = (state, { type, payload }) => {
  if (type === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    };
  } else {
    return state;
  }
};

const store = createStore(reducer, {
  user: { name: "yp94", age: 18 },
  group: { id: 1 },
});

export const App = () => {
  return (
    <Provider store={store}>
      <ComponentA />
      <ComponentB />
      <ComponentC />
    </Provider>
  );
};
const ComponentA = () => {
  console.log("ComponentA执行了");
  return (
    <section>
      ComponentA
      <User />
    </section>
  );
};

const ComponentB = () => {
  console.log("ComponentB执行了");
  return (
    <section>
      ComponentB
      <UserModifier />
    </section>
  );
};

const ComponentC = connect((state) => {
  return {
    id: state.group.id,
  };
})(({ id }) => {
  console.log("ComponentC执行了");
  return (
    <section>
      ComponentC<p>id:{id}</p>
    </section>
  );
});

const User = connect(
  null,
  null
)(({ state }) => {
  console.log("user执行了");
  return <div>User:{state.user.name}</div>;
});

const UserModifier = connectToUser(({ updateUser, user, children }) => {
  console.log("UserModifier执行了");
  const onChange = (e) => {
    updateUser({ name: e.target.value });
  };
  return (
    <div>
      {children}
      <input value={user.name} onChange={onChange} />
    </div>
  );
});
