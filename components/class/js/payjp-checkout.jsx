import React from 'react';

class PayjpCheckout extends React.Component {
  constructor(props) {
    super(props);
    this.payjpCheckoutElement = null;
    this.script = null;
    // this.windowAlertBackUp = null;
    this.onCreated = this.onCreated.bind(this);
    this.onFailed = this.onFailed.bind(this);
  }

  static defaultProps = {
    className: 'payjp-button',
    dataKey: '',
    onCreatedHandler: () => {},
    onFailedHandler: () => {},
  };

  componentDidMount() {
    // this.windowAlertBackUp = window.alert;
    window.payjpCheckoutOnCreated = this.onCreated;
    window.payjpCheckoutOnFailed = this.onFailed;
    // window.alert = () => {}; // PAY.JP の checkout から呼ばれる window.alert を一時的に無効化

    this.script = document.createElement('script');
    this.script.src = 'https://checkout.pay.jp/';
    this.script.classList.add(this.props.className);
    this.script.dataset.key = this.props.dataKey;
    this.script.dataset.partial = this.props.dataPartial || 'false';
    if (this.props.dataText) this.script.dataset.text = this.props.dataText;
    if (this.props.dataSubmitText) this.script.dataset.submitText = this.props.dataSubmitText;
    if (this.props.dataTokenName) this.script.dataset.tokenName = this.props.dataTokenName;
    if (this.props.dataPreviousToken) this.script.dataset.previousToken = this.props.dataPreviousToken;
    if (this.props.dataLang) this.script.dataset.lang = this.props.dataLang;
    this.script.dataset.onCreated = 'payjpCheckoutOnCreated';
    this.script.dataset.onFailed = 'payjpCheckoutOnFailed';
    if (this.props.dataNamePlaceholder) this.script.dataset.namePlaceholder = this.props.dataNamePlaceholder;
    if (this.props.dataTenant) this.script.dataset.tenant = this.props.dataTenant;

    this.payjpCheckoutElement = document.getElementById('payjpCheckout');
    this.payjpCheckoutElement?.appendChild(this.script);
  }

  componentWillUnmount() {
    // すでに https://checkout.pay.jp/ の checkout.js が実行済みで、script タグを削除しているだけ
    this.payjpCheckoutElement?.removeChild(this.script);
    window.payjpCheckoutOnCreated = null;
    window.payjpCheckoutOnFailed = null;
    // window.alert = this.windowAlertBackUp;
    window.PayjpCheckout = null;
  }

  shouldComponentUpdate(_nextProps, _nextState, _nextContext) {
    return false; // PAY.JP スクリプトが DOM を直接操作するため、React の再レンダリングを抑制
  }

  onCreated(response) {
    const payload = {token: response.id}
    this.props.onCreatedHandler(payload);
  }

  onFailed(statusCode, errorResponse) {
    const payload = {statusCode, message: errorResponse.message}
    this.props.onFailedHandler(payload);
  }

  render() {
    return <div id="payjpCheckout"></div>;
  }
}

export default PayjpCheckout;
