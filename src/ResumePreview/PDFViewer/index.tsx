import React, { PureComponent, ReactElement } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import pdfjs from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { pdf } from '@react-pdf/renderer'
import { Button } from '@material-ui/core';
import { Document, Page } from 'react-pdf';
import { CurrentUserContextImpl } from 'utils/contexts';
import throttle from 'lodash.throttle';

import styles from './styles.module.scss';

type PDFViewerProps = {
  document: ReactElement;
};

type PDFViewerState = {
  document: string;
};

type TComponentProps = PDFViewerProps & WithNamespaces;

class PDFViewerComponent extends PureComponent<TComponentProps, PDFViewerState> {
  private throttledRenderDocument: Function;
  public static contextType = CurrentUserContextImpl;

  public constructor(props: TComponentProps) {
    super(props);

    this.throttledRenderDocument = throttle(this.renderDocument, 4000);

    this.state = {
      document: ''
    }
  }

  public render() {
    const { t } = this.props;
    const { document } = this.state;

    if (!document) return null;

    return (
      <div className={styles.container}>
        <div className={styles.pdfViewerWrapper}>
          <Document file={document}>
            <Page renderMode="svg" pageNumber={1} />
          </Document>
        </div>

        <Button href={document} download={this.getResumeName()} target="_blank" variant="contained" color="primary">
          {t('download_as_pdf')}
        </Button>
      </div>
    );
  }

  public componentDidMount() {
    const { document } = this.props;

    this.throttledRenderDocument(document)
  }

  public componentDidUpdate(prevProps: PDFViewerProps) {
    const { document } = this.props;
    // Don't update if document didn't change
    if (document === prevProps.document) return

    this.throttledRenderDocument(document);
  }

  private renderDocument(doc: ReactElement) {
    pdf(doc)
      .toBlob()
      .then(blob => {
        const url = URL.createObjectURL(blob)

        this.setState({ document: url })
      })
  }

  private getResumeName = (): string => {
    const { user } = this.context;

    return `${user.firstName} ${user.lastName}.pdf`;
  }
}

export const PDFViewer = withNamespaces()(PDFViewerComponent);
