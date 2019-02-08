import React, { Component } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

class Login extends Component<WithNamespaces> {
  public render() {
    return (
      <div>Log me in already!</div>
    );
  }
}

export const LoginComponent = withNamespaces()(Login);
