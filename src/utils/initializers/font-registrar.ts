import { Font } from '@react-pdf/renderer';

import robotoBoldItalic from 'styles/fonts/Roboto-Italic.ttf';
import roboto from 'styles/fonts/Roboto-Light.ttf';
import robotoItalic from 'styles/fonts/Roboto-LightItalic.ttf';
import robotoBold from 'styles/fonts/Roboto-Regular.ttf';

export const registerPDFViewerFonts = () => {
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
};
