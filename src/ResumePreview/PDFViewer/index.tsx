import React, { Fragment, PureComponent, ReactElement } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import { pdf } from '@react-pdf/renderer'
import { CurrentUserContextImpl } from 'utils/contexts';

import pdfjs from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { Document, Page } from 'react-pdf';

type PDFViewerProps = {
  document?: ReactElement;
};

type PDFViewerState = {
  document: string;
};

type TComponentProps = PDFViewerProps & WithNamespaces;

class PDFViewerComponent extends PureComponent<TComponentProps, PDFViewerState> {
  public static contextType = CurrentUserContextImpl;

  public state = {
    document: ''
  }

  public render() {
    const { t } = this.props;
    const { document } = this.state;

    if (!document) return null;

    return (
      <Fragment>
        <Document file={document}>
          <Page renderMode="svg" pageNumber={1} />
        </Document>
        <a download={this.getResumeName()} target="_blank" href={document}>
          {t('download_as_pdf')}
        </a>
      </Fragment>
    );
  }

  public componentDidMount() {
    const { document } = this.props;

    this.renderDocument(document)
  }

  public componentDidUpdate(prevProps: PDFViewerProps) {
    const { document } = this.props;
    // Don't update if document didn't change
    if (document === prevProps.document) return

    this.renderDocument(document);
  }

  private renderDocument(doc: any) {
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
