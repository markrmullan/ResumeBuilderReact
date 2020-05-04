import React, { PureComponent, ReactElement } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

import classnames from 'classnames';
import { Button, Typography } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { pdf } from '@react-pdf/renderer';
import throttle from 'lodash.throttle';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { Document, Page } from 'react-pdf';

import { CurrentUserContextImpl } from 'utils/contexts';

import previewStyles from '../styles.module.scss';
import styles from './styles.module.scss';

type PDFViewerProps = {
  document: ReactElement;
  isMobilePreviewEnabled: boolean;
};

type PDFViewerState = {
  document: string;
  numPages: number;
  pageNumber: number;
};

type TComponentProps = PDFViewerProps & WithNamespaces;

class PDFViewerComponent extends PureComponent<TComponentProps, PDFViewerState> {
  public static contextType = CurrentUserContextImpl;
  private throttledRenderDocument: Function;

  public constructor(props: TComponentProps) {
    super(props);

    this.throttledRenderDocument = throttle(this.renderDocument, 4000, { leading: false });

    this.state = {
      document: '',
      numPages: 1,
      pageNumber: 1
    };
  }

  public render() {
    const { t } = this.props;
    const { document, numPages, pageNumber } = this.state;

    if (!document) return null;

    return (
      <div className={classnames(styles.container, previewStyles.pdfViewerWrapper, previewStyles.container)}>
        <div>
          <Document file={document} onLoadSuccess={this.onDocumentLoadSuccess}>
            <Page renderMode="svg" pageNumber={pageNumber} />
          </Document>
        </div>

        {numPages > 1 &&
          <div className={styles.prevNextContainer}>
            <Typography color="primary" variant="subtitle2">
              {t('parenthetical_numerator_out_of_denominator', { num: pageNumber, denom: numPages })}
            </Typography>

            <div>
              <Button
                className={styles.prevNextButton}
                size="small"
                color="primary"
                disabled={pageNumber === 1}
                onClick={this.clickPrevPage}
                startIcon={<ChevronLeft style={{ fontSize: 14 }} />}
                >
                  {t('prev')}
                </Button>

                <Button
                  className={styles.prevNextButton}
                  size="small"
                  disabled={pageNumber === numPages}
                  color="primary"
                  onClick={this.clickNextPage}
                  endIcon={<ChevronRight style={{ fontSize: 14 }} />}
                  >
                    {t('next')}
                  </Button>
            </div>
          </div>
        }

        <Button
          size="large"
          className={styles.downloadAsPdfButton}
          href={document}
          download={this.getResumeName()}
          target="_blank"
          variant="contained"
          color="primary"
        >
          {t('download_as_pdf')}
        </Button>
      </div>
    );
  }

  public componentDidMount() {
    const { document } = this.props;

    this.throttledRenderDocument(document);
    (this.throttledRenderDocument as unknown as any).flush();
  }

  /**
   * don't re-render if we're just switching from Build to Preview mode on mobile
   */
  public shouldComponentUpdate(nextProps: TComponentProps) {
    const { isMobilePreviewEnabled } = nextProps;
    const { isMobilePreviewEnabled: wasMobilePreviewEnabled } = this.props;

    return isMobilePreviewEnabled === wasMobilePreviewEnabled;
  }

  public componentDidUpdate(prevProps: PDFViewerProps) {
    const { document } = this.props;
    if (document === prevProps.document) return;

    this.throttledRenderDocument(document);
  }

  private renderDocument(doc: ReactElement) {
    pdf(doc)
      .toBlob()
      .then(blob => {
        const url = URL.createObjectURL(blob);

        this.setState({ document: url });
      });
  }

  private getResumeName = (): string => {
    const { t } = this.props;
    const { user } = this.context;

    const fullName = `${user.firstName} ${user.lastName}`;

    return t('full_name_resume_dot_pdf', { fullName });
  }

  private onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy): void => {
    this.setState(prevState => ({
      numPages,
      pageNumber: Math.min(numPages, prevState.pageNumber)
    }));
  }

  private clickNextPage = (): void => {
    this.setState(prevState => ({
      pageNumber: prevState.pageNumber + 1
    }));
  }

  private clickPrevPage = (): void => {
    this.setState(prevState => ({
      pageNumber: prevState.pageNumber - 1
    }));
  }
}

export const PDFViewer = withNamespaces()(PDFViewerComponent);
