import React, { PureComponent, ReactElement, ReactNode } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { blueGrey } from '@material-ui/core/colors';
import { Document, Link, Page, Text, View } from '@react-pdf/renderer';
import classnames from 'classnames';
import { format } from 'date-fns';
import { Col } from 'react-bootstrap';

import { CurrentUserContextImpl } from 'utils/contexts';
import { Resume } from 'utils/models';
import { PDFViewer } from './PDFViewer';

import { pdfStyles } from './pdfStyles';
import styles from './styles.module.scss';

type TOwnProps = {
  isMobilePreviewEnabled: boolean;
  resume: Resume;
};

const DATE_FORMAT_MONTH_YEAR = 'MMM yyyy';
const DATE_FORMAT_YEAR = 'yyyy';

type TComponentProps = TOwnProps & WithNamespaces;

class ResumePreviewComponent extends PureComponent<TComponentProps> {
  public static contextType = CurrentUserContextImpl;

  public render() {
    const { isMobilePreviewEnabled, resume, t } = this.props;
    const { user } = this.context;
    const { email, jobTitle, phoneNumber, resumeEmail } = user;
    const { educations = [], experiences = [] } = resume;
    const now = Date.now();
    const emailToShow = resumeEmail || email;

    const links = this.getLinks();

    const Resume = () => (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.informationContainer}>
            <View>
              <Text style={pdfStyles.name}>
                {`${user.firstName} ${user.lastName}`.trim()}
              </Text>
              {jobTitle &&
                <Text style={pdfStyles.jobTitle}>{jobTitle}</Text>
              }
            </View>

            {this.shouldShowDetails() &&
              <View style={pdfStyles.detailsContainer}>
                {!links.length &&
                  <Text style={pdfStyles.bold}>
                    {t('contact_details')}
                  </Text>
                }

                {phoneNumber &&
                  <Text>
                    {phoneNumber}
                  </Text>
                }

                {emailToShow &&
                  <Link style={pdfStyles.link} src={`mailto:${emailToShow}`}>
                    {emailToShow}
                  </Link>
                }

                {this.getCityStateZip()}

                {links}
              </View>
            }
          </View>

          {!!experiences.length &&
            <View>
              <Text style={pdfStyles.section}>
                {t('experience')}
              </Text>

              {experiences.map(({ company, description, endDate, location, position, startDate = now, uuid }) => {
                return (
                  <View key={uuid} style={{ marginBottom: 12, marginRight: 20 }}>
                    {this.getRoleAndPlace(position, company, location)}

                    {this.getFormattedStartDateEndDate(startDate, endDate)}

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
                  return (
                    <View key={uuid} style={{ marginBottom: 12, marginRight: 20 }}>
                      {school &&
                        <Text style={pdfStyles.roleAndPlace}>
                          {school}
                        </Text>
                      }
                      {this.getDegreeAndGPA(degree, gpa)}

                      {this.getFormattedStartDateEndDate(startDate, endDate as Nullable<string>, DATE_FORMAT_YEAR)}

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
      <Col className={classnames(styles.resumePreview, 'd-lg-flex', { [styles.previewMode]: isMobilePreviewEnabled })} style={{ backgroundColor: blueGrey[200] }} id="pdf">
        {user.uuid && resume.uuid &&
          <PDFViewer
            document={<Resume />}
            isMobilePreviewEnabled={isMobilePreviewEnabled}
          />
        }
      </Col>
    );
  }

  private shouldShowDetails = (): boolean => {
    const { user } = this.context;
    const { email, phoneNumber } = user;

    return !!(email || phoneNumber);
  }

  private getCityStateZip = (): Maybe<ReactElement> => {
    const { user } = this.context;
    const { city, state, zip = '' } = user;

    if (city && state) {
      const { t } = this.props;

      const cityState = t('values.comma_separated', { val1: city, val2: state });

      return (
        <Text>
          {`${cityState} ${zip}`.trim()}
        </Text>
      );
    }

    if (city || state) {
      return (
        <Text>
          {`${city || state} ${zip}`.trim()}
        </Text>
      );
    }

    if (zip) {
      return (
        <Text>
          {zip.trim()}
        </Text>
      );
    }
  }

  private getLinks = (): ReactElement[] => {
    const { links = [] } = this.props.resume;

    return links.reduce((acc, link) => {
      const urlWithoutProtocol = link.url && link.url.replace(/^(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/|www\.)/, '');

      if (urlWithoutProtocol) {
        acc.push(
          <Link key={link.uuid} src={urlWithoutProtocol} style={pdfStyles.link}>
            {urlWithoutProtocol}
          </Link>
        );
      }

      return acc;
    }, [] as ReactElement[]);
  }

  private getFormattedStartDateEndDate = (startDate: string | number, endDate: Nullable<string>, dateFormat: string = DATE_FORMAT_MONTH_YEAR): ReactElement => {
    const { t } = this.props;

    const isCurrentlyHere = !!startDate && !endDate;
    const formattedStartDate = format(new Date(startDate), dateFormat);
    const formattedEndDate = isCurrentlyHere ? t('present') : format(new Date(endDate!), dateFormat);

    if (formattedStartDate === formattedEndDate) {
      return (
        <Text style={pdfStyles.date}>
          {formattedStartDate}
        </Text>
      );
    }

    return (
      <Text style={pdfStyles.date}>
        {formattedStartDate} - {formattedEndDate}
      </Text>
    );
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
    return ` ${richText.trim().replace(/\n|&nbsp;|<em>|<\/em>/ig, '')}`
      .replace(/<br \/>/g, '\n')
      .replace(/&amp;/g, '&')
      .replace(/&rsquo;/g, '\'')
      .replace(/<p><\/p>/g, '')
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
            {ulTagOrPTag.split(/<li><p>|<\/p><\/li>|<li>|<\/li>/)
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
