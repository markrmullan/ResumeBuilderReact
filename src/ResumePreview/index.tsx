import React, { PureComponent, ReactElement, ReactNode } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { blueGrey } from '@material-ui/core/colors';
import { Document, Font, Link, Page, Text, View } from '@react-pdf/renderer';
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

const DATE_FORMAT_MONTH_YEAR = 'MMM yyyy';
const DATE_FORMAT_YEAR = 'yyyy';

type TComponentProps = TOwnProps & WithNamespaces;

class ResumePreviewComponent extends PureComponent<TComponentProps> {
  public static contextType = CurrentUserContextImpl;

  public render() {
    const { resume, t } = this.props;
    const { user } = this.context;
    const { email, phoneNumber, resumeEmail } = user;
    const { educations = [], experiences = [] } = resume;
    const now = Date.now();

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

                {(resumeEmail || email) &&
                  <Link style={pdfStyles.link} src={`mailto:${resumeEmail || email}`}>
                    {(resumeEmail || email)}
                  </Link>
                }
              </View>
            }
          </View>

          {!!experiences.length &&
            <View>
              <Text style={pdfStyles.section}>
                {t('experience')}
              </Text>

              {experiences.map(({ company, description, endDate, location, position, startDate = now, uuid }) => {
                const doesCurrentlyWorkHere = !!startDate && !endDate;

                return (
                  <View key={uuid} style={{ marginBottom: 12 }}>
                    {this.getRoleAndPlace(position, company, location)}
                    <Text style={pdfStyles.date}>
                      {format(new Date(startDate), DATE_FORMAT_MONTH_YEAR)} - {doesCurrentlyWorkHere ? t('present') : format(new Date(endDate!), DATE_FORMAT_MONTH_YEAR)}
                    </Text>

                    <View style={pdfStyles.description}>
                      {this.convertRichTextToTsx(description)}
                    </View>
                  </View>
                );
              })}
            </View>
          }

          {!!educations.length &&
            <View>
              <Text style={pdfStyles.section}>
                {t('education')}
              </Text>

                {educations.map(({ degree, description, endDate, gpa, school, startDate = now, uuid }) => {
                  const doesCurrentlyAttend = !!startDate && !endDate;

                  return (
                    <View key={uuid} style={{ marginBottom: 12 }}>
                      {school &&
                        <Text style={pdfStyles.roleAndPlace}>
                          {school}
                        </Text>
                      }
                      {this.getDegreeAndGPA(degree, gpa)}
                      <Text style={pdfStyles.date}>
                        {format(new Date(startDate), DATE_FORMAT_YEAR)} - {doesCurrentlyAttend ? t('present') : format(new Date(endDate!), DATE_FORMAT_YEAR)}
                      </Text>

                      <View style={pdfStyles.description}>
                        {this.convertRichTextToTsx(description)}
                      </View>
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

  private getRoleAndPlace = (role: Maybe<string>, place: Maybe<string>, location: Maybe<string>): Maybe<ReactElement> => {
    const { t } = this.props;

    if (role && place && location) {
      return (
        <Text style={pdfStyles.roleAndPlace}>
          {t('values.em_dash_separated', { val1: t('role_at_place', { role, place }), val2: location })}
        </Text>
      );
    }

    if (location && (role || place)) {
      return (
        <Text style={pdfStyles.roleAndPlace}>
          {t('values.em_dash_separated', { val1: role || place, val2: location })}
        </Text>
      );
    }

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

  private getDegreeAndGPA = (degree: Maybe<string>, gpa: Maybe<string>): Maybe<ReactElement> => {
    const { t } = this.props;

    if (degree && gpa) {
      return (
        <Text style={pdfStyles.degreeAndGPA}>
          {t('values.comma_separated', { val1: degree, val2: gpa })}
        </Text>
      );
    }

    if (degree) {
      return (
        <Text style={pdfStyles.degreeAndGPA}>
          {degree}
        </Text>
      );
    }

    if (gpa) {
      return (
        <Text style={pdfStyles.degreeAndGPA}>
          {t('gpa_and_value', { gpa })}
        </Text>
      );
    }
  }

  /**
   * please forgive me
   */
  private convertRichTextToTsx = (richText: string = ''): ReactNode => {
    return ` ${richText.trim().replace(/\n|&nbsp;/ig, '')}`
      .split(/<ul>|<\/ul>/)
      .map((ulTagOrPTag, idx) => {
        if (idx % 2 === 0) {
          // it's a <p> tag
          return ulTagOrPTag.split(/<p>|<\/p>/)
            .filter(e => e && e !== ' ')
            .map((p, pIdx) => (
              <Text key={`p-${pIdx}`}>
                {p}
              </Text>
            ));
        }

        return (
          <View key={`ul-${idx}`} style={pdfStyles.ul}>
            {ulTagOrPTag.split(/<li>|<\/li>/)
              .filter(e => e && e !== ' ')
              .map((li, idx2) => (
                <View key={`li-${idx2}`} style={pdfStyles.li}>
                  <Text style={pdfStyles.bulletPoint}>
                    •
                  </Text>

                  <Text>
                    {li}
                  </Text>
                </View>
              ))
            }
          </View>
        );
      })
      .flat(Infinity);
  }
}

export const ResumePreview = withNamespaces()(ResumePreviewComponent);
