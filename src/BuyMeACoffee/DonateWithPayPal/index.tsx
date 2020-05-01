import React, { PureComponent } from 'react';

import { WithNamespaces, withNamespaces } from 'react-i18next';

type TComponentProps = WithNamespaces;

class DonateWithPayPalComponent extends PureComponent<TComponentProps> {

  public render() {
    const { t } = this.props;

    return (
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="XCKWJYXZK7DLN" />
        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" name="submit" title={t('coffee.donate_with_paypal_title')} alt={t('coffee.donate_with_paypal_alt')} />
        <img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
      </form>
    );
  }
}

export const DonateWithPayPal = withNamespaces()(DonateWithPayPalComponent);
