import React, { PureComponent, ReactElement } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { blueGrey } from '@material-ui/core/colors';
import { Document, Font, Page, Text, View } from '@react-pdf/renderer';
import classnames from 'classnames';
import { format } from 'date-fns';
import { Col } from 'react-bootstrap';

import { CurrentUserContextImpl } from 'utils/contexts';
import { Resume } from 'utils/models';
import { PDFViewer } from './PDFViewer';

import robotoBoldItalic from 'styles/fonts/Roboto-Italic.ttf';
import roboto from 'styles/fonts/Roboto-Light.ttf';
import robotoItalic from 'styles/fonts/Roboto-LightItalic.ttf';
import robotoBold from 'styles/fonts/Roboto-Regular.ttf';

import { pdfStyles } from './pdfStyles';
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

const DATE_FORMAT = 'MMM yyyy';

type TComponentProps = TOwnProps & WithNamespaces;

class ResumePreviewComponent extends PureComponent<TComponentProps> {
  public static contextType = CurrentUserContextImpl;

  public render() {
    const { resume, t } = this.props;
    const { user } = this.context;
    const { email, phoneNumber } = user;
    const { experiences = [] } = resume;

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

          {!!experiences.length &&
            <View>
              <Text style={pdfStyles.section}>
                {t('professional_experience')}
              </Text>

              {experiences.map(({ company, endDate, position, startDate, uuid }) => {
                const doesCurrentlyWorkHere = !!startDate && !endDate;

                return (
                  <View key={uuid} style={{ marginBottom: 12 }}>
                    {this.getRoleAndPlace(position, company)}
                    <Text style={pdfStyles.date}>
                      {format(new Date(startDate), DATE_FORMAT)} - {doesCurrentlyWorkHere ? t('present') : format(new Date(endDate!), DATE_FORMAT)}
                    </Text>
                  </View>
                );
              })}
            </View>
          }
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

  private getRoleAndPlace = (role: Maybe<string>, place: Maybe<string>): Maybe<ReactElement> => {
    const { t } = this.props;

    if (role && place) {
      return (
        <Text style={pdfStyles.roleAndPlace}>
          {t('role_at_place', { role, place })}
        </Text>
      );
    }

    if (role || place) {
      return (
        <Text style={pdfStyles.roleAndPlace}>
          {role || place}
        </Text>
      );
    }
  }
}

export const ResumePreview = withNamespaces()(ResumePreviewComponent);
