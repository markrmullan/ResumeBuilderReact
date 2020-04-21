import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
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
    fontSize: 36,
    fontWeight: 700
  },
  section: {
    fontSize: 20,
    fontWeight: 700
  },
  bold: {
    fontWeight: 700
  },
  date: {
    fontSize: 14,
    fontStyle: 'italic'
  },
  roleAndPlace: {
    fontSize: 16,
    fontWeight: 700
  }
});
