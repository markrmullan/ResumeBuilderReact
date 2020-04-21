import React, { PureComponent } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { blueGrey } from '@material-ui/core/colors';
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import classnames from 'classnames';
import { Col } from 'react-bootstrap';

import { CurrentUserContextImpl } from 'utils/contexts';
import { Resume } from 'utils/models';
import { PDFViewer } from './PDFViewer';

import robotoBoldItalic from 'styles/fonts/Roboto-Italic.ttf';
import roboto from 'styles/fonts/Roboto-Light.ttf';
import robotoItalic from 'styles/fonts/Roboto-LightItalic.ttf';
import robotoBold from 'styles/fonts/Roboto-Regular.ttf';
import styles from './styles.module.scss';

type TOwnProps = {
  resume: Resume;
};

// TODO register fonts earlier on?
Font.register({
  family: 'Roboto',
  fonts: [
    { src: roboto },
    { src: robotoBold, fontWeight: 700 },
    { src: robotoItalic, fontStyle: 'italic' },
    { src: robotoBoldItalic, fontStyle: 'italic', fontWeight: 700 }
  ]
});

Font.registerHyphenationCallback(word => [word]); // disable word wrapping hyphenation

const pdfStyles = StyleSheet.create({
  informationContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 12
  },
  page: {
    fontFamily: 'Roboto',
    paddingBottom: 65,
    paddingHorizontal: 35,
    paddingTop: 35
  },
  name: {
    fontSize: 32,
    fontWeight: 700
  },
  bold: {
    fontWeight: 700
  }
});

type TComponentProps = TOwnProps & WithNamespaces;

class ResumePreviewComponent extends PureComponent<TComponentProps> {
  public static contextType = CurrentUserContextImpl;

  public render() {
    const { t } = this.props;
    const { user } = this.context;
    const { email, phoneNumber } = user;

    const MyDocument = () => (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.informationContainer}>
            <View style={pdfStyles.name}>
              <Text>{user.firstName} {user.lastName}</Text>
            </View>

            {this.shouldShowDetails() &&
              <View style={pdfStyles.detailsContainer}>
                <Text style={pdfStyles.bold}>
                  {t('contact_details')}
                </Text>
                {phoneNumber &&
                  <Text>
                    {phoneNumber}
                  </Text>
                }

                {email &&
                  <Text>
                    {email}
                  </Text>
                }
              </View>
            }

          </View>
        </Page>
      </Document>
    );

    return (
      <Col className={classnames(styles.resumePreview, 'd-lg-flex')} style={{ backgroundColor: blueGrey[200] }} id="pdf">
        <PDFViewer document={<MyDocument />} />
      </Col>
    );
  }

  private shouldShowDetails = (): boolean => {
    const { user } = this.context;
    const { email, phoneNumber } = user;

    return !!(email || phoneNumber);
  }
}

export const ResumePreview = withNamespaces()(ResumePreviewComponent);
