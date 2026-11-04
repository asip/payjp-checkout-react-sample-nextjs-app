import { useCallback, useEffect, useId } from "react";

const PayjpCheckout = ({
  className = 'payjp-button',
  data,
  onCreatedHandler = () => undefined,
  onFailedHandler = () => undefined
}) => {
  const payjpCheckoutId = useId();

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
    /*
    PAY.JP の checkout から呼ばれる window.alert を無効化
    // カード情報が不正のときに window.alert が payjp の checkout から呼ばれるため
    window.alert = () => {}
    */

    //console.log(props);

    const script = document.createElement('script');
    script.src = 'https://checkout.pay.jp/';
    script.classList.add(className);
    script.dataset.onCreated = 'payjpCheckoutOnCreated';
    script.dataset.onFailed = 'payjpCheckoutOnFailed';
    script.dataset.key = data.key ?? '';
    script.dataset.partial = data.partial ?? 'false';
    if (data.text) script.dataset.text = data.text;
    if (data.submitText) script.dataset.submitText = data.submitText;
    if (data.tokenName) script.dataset.tokenName = data.tokenName;
    if (data.previousToken) script.dataset.previousToken = data.previousToken;
    if (data.lang) script.dataset.lang = data.lang;
    if (data.namePlaceholder) script.dataset.namePlaceholder = data.namePlaceholder;
    if (data.Tenant) script.dataset.tenant = data.tenant;

    const payjpCheckoutElement = document.getElementById(payjpCheckoutId);
    payjpCheckoutElement?.appendChild(script);

    return () => {
      // すでに https://checkout.pay.jp/ の checkout.js が実行済みで、script タグを削除しているだけ
      payjpCheckoutElement?.removeChild(script);
      window.payjpCheckoutOnCreated = null;
      window.payjpCheckoutOnFailed = null;
      // window.alert = windowAlertBackUp;
      window.PayjpCheckout = null;
    }
  }, [className, data, onCreated, onFailed, payjpCheckoutId]) // 依存配列を追加

  return (<div id={payjpCheckoutId}></div>);
}

export default PayjpCheckout;
