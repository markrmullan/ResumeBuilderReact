import React, { Component } from 'react';
import { withNamespaces, WithNamespaces } from 'react-i18next';

class Signup extends Component<WithNamespaces> {
  render() {
    return (
      <div>Signup form goes here</div>
    )
  }
}

export const SignupComponent = withNamespaces()(Signup);
