import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { blueGrey } from '@material-ui/core/colors';
import classnames from 'classnames';
import { Col } from 'react-bootstrap';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { PDFViewer } from './PDFViewer';
import { CurrentUserContextImpl } from 'utils/contexts';
import { Resume } from 'utils/models';

import styles from './styles.module.scss';

type TOwnProps = {
  resume: Resume;
};

const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'row'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  name: {
    fontSize: 40
  }
});

type TComponentProps = TOwnProps & WithNamespaces;

class ResumePreviewComponent extends PureComponent<TComponentProps> {
  public static contextType = CurrentUserContextImpl;

  public render() {
    const { resume } = this.props;
    const { user } = this.context;

    const MyDocument = () => (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.section}>
            <View style={pdfStyles.name}>
              <Text>{user.firstName} {user.lastName}</Text>
            </View>
          </View>
          <View style={pdfStyles.section}>
            <Text>{resume.uuid}</Text>
          </View>
        </Page>
      </Document>
    );

    return (
      <Col className={classnames(styles.resumePreview, 'd-lg-flex')} style={{ backgroundColor: blueGrey[200] }} id="pdf">
        <div className={styles.pdfViewerWrapper}>
          <PDFViewer document={<MyDocument />} />
        </div>
      </Col>
    );
  }
}

export const ResumePreview = withNamespaces()(ResumePreviewComponent);
