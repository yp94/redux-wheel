import React, { useState, useEffect } from "react";

let state = undefined;
let reducer = undefined;
let listeners = [];
const setState = (newState) => {
  state = newState;
  listeners.map((fn) => fn(state));
};

const store = {
  getState() {
    return state;
  },
  subscribe(fn) {
    listeners.push(fn);
    return (fn) => {
      const index = listeners.indexOf(fn);
      listeners.splice(index, 1);
    };
  },
  dispath(action) {
    const newState = reducer(state, action);
    setState(newState);
  },
};

const dispath = store.dispath;

export const createStore = (_reducer, initState) => {
  reducer = _reducer;
  state = initState;

  return store;
};

const appContext = React.createContext(null);

export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>;
};

const changed = (oldState, newState) => {
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      return true;
    }
  }
  return false;
};

//让组件和全局状态连接
export const connect = (mapStateToProps, mapDispathToProps) => (Component) => {
  return (props) => {
    const [, update] = useState({});

    const data = mapStateToProps ? mapStateToProps(state) : { state };
    const dispathers = mapDispathToProps
      ? mapDispathToProps(dispath)
      : { dispath };

    useEffect(() => {
      const unSubscibe = store.subscribe(() => {
        const newData = mapStateToProps ? mapStateToProps(state) : { state };

        if (changed(data, newData)) {
          update({});
        }
      });
      return unSubscibe;
    }, [mapStateToProps, mapDispathToProps]);

    return (
      <>
        <Component {...props} {...data} {...dispathers} />
      </>
    );
  };
};
