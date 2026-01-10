import { useCallback } from "react";
import { useEffect } from "react";

const PayjpCheckout = ({
  className = 'payjp-button',
  dataKey,
  dataPartial,
  dataText,
  dataSubmitText,
  dataTokenName,
  dataPreviousToken,
  dataLang,
  dataNamePlaceholder,
  dataTenant,
  onCreatedHandler = () => undefined,
  onFailedHandler = () => undefined
}) => {
  const onCreated = useCallback((response) => {
    const payload = {token: response.id}
    onCreatedHandler(payload);
  }, [onCreatedHandler])

  const onFailed = useCallback((statusCode, errorResponse) => {
    const payload = {statusCode, message: errorResponse.message}
    onFailedHandler(payload);
  }, [onFailedHandler])

  useEffect(() => {
    // const windowAlertBackUp = window.alert;
    window.payjpCheckoutOnCreated = onCreated;
    window.payjpCheckoutOnFailed = onFailed;
    /* // カード情報が不正のときに window.alert が payjp の checkout から呼ばれるため
    window.alert = () => {
    }; */

    //console.log(props);

    const script = document.createElement('script');
    script.src = 'https://checkout.pay.jp/';
    script.classList.add(className);
    script.dataset.key = dataKey || '';
    script.dataset.partial = dataPartial || 'false';
    if (dataText) script.dataset.text = dataText;
    if (dataSubmitText) script.dataset.submitText = dataSubmitText;
    if (dataTokenName) script.dataset.tokenName = dataTokenName;
    if (dataPreviousToken) script.dataset.previousToken = dataPreviousToken;
    if (dataLang) script.dataset.lang = dataLang;
    script.dataset.onCreated = 'payjpCheckoutOnCreated';
    script.dataset.onFailed = 'payjpCheckoutOnFailed';
    if (dataNamePlaceholder) script.dataset.namePlaceholder = dataNamePlaceholder;
    if (dataTenant) script.dataset.tenant = dataTenant;

    const payjpCheckoutElement = document.getElementById('payjpCheckout');
    payjpCheckoutElement?.appendChild(script);

    return () => {
      // すでに https://checkout.pay.jp/ の checkout.js が実行済みで、script タグを削除しているだけ
      payjpCheckoutElement?.removeChild(script);
      window.payjpCheckoutOnCreated = null;
      window.payjpCheckoutOnFailed = null;
      // window.alert = windowAlertBackUp;
      window.PayjpCheckout = null;
    }
  }, [className, dataKey, dataPartial, dataText, dataSubmitText, dataTokenName, dataPreviousToken, dataLang, dataNamePlaceholder, dataTenant, onCreated, onFailed]) // 依存配列を追加

  return (<div id="payjpCheckout"></div>);
}

export default PayjpCheckout;
