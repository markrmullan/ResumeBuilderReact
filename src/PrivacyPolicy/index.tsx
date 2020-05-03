import React, { Fragment, PureComponent } from 'react';

import { Typography } from '@material-ui/core';
import { Col, Container, Row } from 'react-bootstrap';

import { Footer } from 'Footer';

import styles from './styles.module.scss';

export class PrivacyPolicy extends PureComponent {
  public render() {
    return (
      <Fragment>
        <Container fluid className={styles.container}>
          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography variant="h3" paragraph>
                EasyResume Privacy Policy
              </Typography>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from https://easy-resu.me (the “Site”).
              </Typography>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography variant="h5" paragraph>
                PERSONAL INFORMATION WE COLLECT
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information.”
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                We collect Device Information using the following technologies:
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                - “Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit http://www.allaboutcookies.org. <br/>
                - “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps. <br/>
                - “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                When we talk about “Personal Information” in this Privacy Policy, we are talking about Device Information.
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography variant="h5" paragraph>
                HOW DO WE USE YOUR PERSONAL INFORMATION?
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography variant="h5" paragraph>
                SHARING YOUR PERSONAL INFORMATION
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                We share your Personal Information with third parties to help us use your Personal Information, as described above. We also use Google Analytics to help us understand how our customers use the Site—you can read more about how Google uses your Personal Information here: https://www.google.com/intl/en/policies/privacy/.  You can also opt-out of Google Analytics here:  https://tools.google.com/dlpage/gaoptout.
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography variant="h5" paragraph>
                DO NOT TRACK
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography variant="h5" paragraph>
                YOUR RIGHTS
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above.  Additionally, please note that your information will be transferred outside of Europe, including to the United States.
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography variant="h5" paragraph>
                CHANGES
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography variant="h5" paragraph>
                CONTACT US
              </Typography>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
              <Typography paragraph>
                For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:mark@easy-resu.me">mark@easy-resu.me</a>.
              </Typography>
            </Col>
          </Row>
        </Container>

        <Footer />
      </Fragment>
    );
  }
}
