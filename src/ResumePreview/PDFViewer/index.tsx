import React, { Component, ReactElement } from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';

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
  height: number;
  width: number;
  document: string;
  numPages: number;
  pageNumber: number;
};

type TComponentProps = PDFViewerProps & WithNamespaces;

class PDFViewerComponent extends Component<TComponentProps, PDFViewerState> {
  public static contextType = CurrentUserContextImpl;
  private throttledRenderDocument: Function;
  private throttledHandleResize: Function;

  public constructor(props: TComponentProps) {
    super(props);

    this.throttledRenderDocument = throttle(this.renderDocument, 4000, { leading: false });
    this.throttledHandleResize = throttle(this.handleResize, 1000, { leading: false });

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
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
      <div className={styles.container}>
        <div className={previewStyles.pdfViewerWrapper}>
          <Document file={document} onLoadSuccess={this.onDocumentLoadSuccess}>
            <Page renderMode="svg" pageNumber={pageNumber} scale={this.computeSvgScale()} />
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
    window.addEventListener("resize", this.throttledHandleResize as unknown as any);
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

  public componentWillUnmount() {
    window.removeEventListener("resize", this.throttledHandleResize as unknown as any);
  }

  private handleResize = () => {
    const { innerWidth: width, innerHeight: height } = window;

    this.setState({
      height, width
    });
  }

  private computeSvgScale = (): number => {
    const { width } = this.state;

    if (width > 1200) {
      return 0.75;
    }

    if (width > 1085) {
      return 0.66;
    }

    return 0.5;
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
