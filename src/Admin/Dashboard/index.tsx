import React, { PureComponent } from 'react';

import { Button } from '@material-ui/core';
import { format } from 'date-fns';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

import { Spinner } from 'common/Spinner';
import { Table } from 'common/Table';
import { TableBody } from 'common/Table/Body';
import { TableCell } from 'common/Table/Cell';
import { TableContainer } from 'common/Table/Container';
import { TableHead } from 'common/Table/Head';
import { TableRow } from 'common/Table/Row';
import { User } from 'utils/models';
import { becomeUser, fetchUsers } from 'utils/requests';

const DATE_FORMAT = 'd MMM, HH:mm';

type TComponentProps = RouteComponentProps;

type TComponentState = {
  pending: boolean;
  users: User[];
};

class AdminDashboardComponent extends PureComponent<TComponentProps, TComponentState> {
  public state = {
    pending: false,
    users: []
  };

  public render() {
    const { pending, users = [] as User[] } = this.state;

    if (pending) {
      return (
        <Container>
          <Spinner />
        </Container>
      );
    }

    return (
      <Container>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Created @
                </TableCell>

                <TableCell>
                  Num
                </TableCell>

                <TableCell>
                  First Name
                </TableCell>

                <TableCell>
                  Last Name
                </TableCell>

                <TableCell>
                  Email + Phone
                </TableCell>

                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user, i) => (
                <TableRow key={user.uuid}>
                  <TableCell>
                    {format(new Date(user.createdAt), DATE_FORMAT)}
                  </TableCell>

                  <TableCell>
                    {users.length - i}
                  </TableCell>

                  <TableCell>
                    {user.firstName}
                  </TableCell>

                  <TableCell>
                    {user.lastName}
                  </TableCell>

                  <TableCell>
                    {user.email} <br/>
                    {user.phoneNumber}
                  </TableCell>

                  <TableCell>
                    <Button
                      onClick={this.becomeUser.bind(this, user.uuid)}
                      color="primary"
                      variant="contained"
                    >
                      Become
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }

  public componentDidMount() {
    fetchUsers().then(users => {
      this.setState({ users });
    });
  }

  private becomeUser = (userId: Uuid) => {
    const { history } = this.props;

    becomeUser(userId)
      .then(_ => history.push('/dashboard'));
  }
}

export const AdminDashboard = withRouter(AdminDashboardComponent);
