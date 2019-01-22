import React, { Component } from 'react';

import { withNamespaces, WithNamespaces } from 'react-i18next';

class Login extends Component<WithNamespaces> {
  render() {
    return (
      <div>Log me in already!</div>
    )
  }
}

export const LoginComponent = withNamespaces()(Login);
