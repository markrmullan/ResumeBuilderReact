import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { Cell, Grid, Row } from '@material/react-layout-grid';

import { Resume } from 'utils/models';

type ResumeListItemComponentProps = {
  resumes: Resume[];
};

class ResumeListItemComponent extends PureComponent<ResumeListItemComponentProps & WithNamespaces> {
  public render() {
    const { resumes } = this.props;

    return (
      <Grid
        marginHeight={50}
      >
        <Row>
          {resumes.map((resume, i) => {
            return (
              <Cell
                desktopColumns={3}
                tabletColumns={4}
                phoneColumns={4}
                key={i}
              >
                {resume.name}
              </Cell>
            );
          })}
        </Row>
      </Grid>
    );
  }
}

export const ResumeListItem = withNamespaces()(ResumeListItemComponent);
