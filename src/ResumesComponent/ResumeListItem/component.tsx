import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Cell, Grid, Row } from '@material/react-layout-grid';

import { CV } from 'utils/models';

type CVListItemComponentProps = {
  resumes: CV[];
};

class CVListItemComponent extends PureComponent<CVListItemComponentProps & WithNamespaces> {
  public render() {
    const { resumes } = this.props;

    return (
      <Grid
        marginHeight={50}
      >
        <Row>
          {resumes.map((cv, i) => {
            return (
              <Cell
                desktopColumns={3}
                tabletColumns={4}
                phoneColumns={4}
                key={i}
              >
                {cv.name}
              </Cell>
            );
          })}
        </Row>
      </Grid>
    );
  }
}

export const CVListItem = withNamespaces()(CVListItemComponent);
