import { StyleSheet } from '@react-pdf/renderer';

import { lightBlue } from '@material-ui/core/colors';

export const pdfStyles = StyleSheet.create({
  informationContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  link: {
    color: lightBlue[900],
    textDecoration: 'none'
  },
  detailsContainer: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 11
  },
  page: {
    fontFamily: 'Roboto',
    paddingHorizontal: 35,
    paddingVertical: 35
  },
  name: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1,
    marginLeft: -1
  },
  longName: {
    fontSize: 22
  },
  jobTitle: {
    fontSize: 11,
    marginTop: 6
  },
  section: {
    fontSize: 15,
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  bold: {
    fontWeight: 700
  },
  date: {
    fontSize: 13
  },
  roleAndPlace: {
    fontSize: 14,
    fontWeight: 700
  },
  description: {
    fontSize: 13
  },
  ul: {
    display: 'flex',
    flexDirection: 'column'
  },
  li: {
    display: 'flex',
    flexDirection: 'row',
    lineHeight: 1.2
  },
  bulletPoint: {
    fontSize: 14,
    marginRight: 10
  },
  strong: {
    fontWeight: 700
  },
  degreeAndGPA: {
    fontSize: 14
  }
});
