/* eslint-disable */
import React, { createContext, Component } from 'react';

export const Context = createContext();

// TODO: move this schema into separate place?

class ContextProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // fullscreen. DO NOT CHANGE!
      fullscreen: false,
      setFullscreen: (fullscreen) => this.setState({ fullscreen }),
    };
  }

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default ContextProvider;
