import { useCallback, useEffect, useId } from "react"

import type { PayjpCheckoutPayload, PayjpCheckoutErrorPayload } from '@/types'

interface PayjpCheckoutResponse {
  // card: any
  // created: number
  id: string
  // livemode: boolean
  // object: string
  // used: boolean
}

interface PayjpCheckoutErrorResponse {
  // code: string
  message: string
  // status: number // http (response) status code
  // type: string
}

interface DataProperties {
  key: string
  partial?: string
  text?: string
  submitText?: string
  tokenName?: string
  previousToken?: string
  lang?: string
  namePlaceholder?: string
  tenant?: string,
}

declare global {
  interface Window {
    payjpCheckoutOnCreated: ((response: PayjpCheckoutResponse) => void) | null
    payjpCheckoutOnFailed: ((statusCode: number, errorResponse: PayjpCheckoutErrorResponse) => void) | null
    // alert: () => void
    PayjpCheckout: unknown | null
  }
}

interface PayjpCheckoutProps {
  className?: string
  data: DataProperties,
  onSuccess: ((payload: PayjpCheckoutPayload) => void)
  onError: ((payload: PayjpCheckoutErrorPayload) => void)
}

const PayjpCheckout = ({
  className = 'payjp-button',
  data,
  onSuccess = () => undefined,
  onError = () => undefined
}: PayjpCheckoutProps) => {
  const payjpCheckoutId = useId()

  const onCreated = useCallback((response: PayjpCheckoutResponse) => {
    const payload: PayjpCheckoutPayload = {token: response.id}
    onSuccess(payload)
  }, [onSuccess])

  const onFailed = useCallback((statusCode: number, errorResponse: PayjpCheckoutErrorResponse) => {
    const payload: PayjpCheckoutErrorPayload = {statusCode, message: errorResponse.message}
    onError(payload)
  }, [onError])

  useEffect(() => {
    // const windowAlertBackUp = window.alert
    window.payjpCheckoutOnCreated = onCreated
    window.payjpCheckoutOnFailed = onFailed
    /*
    PAY.JP の checkout から呼ばれる window.alert を無効化
    // カード情報が不正のときに window.alert が payjp の checkout から呼ばれるため
    window.alert = () => {}
    */

    //console.log(props)

    const script = document.createElement('script')
    script.src = 'https://checkout.pay.jp/'
    script.classList.add(className)
    script.dataset.onCreated = 'payjpCheckoutOnCreated'
    script.dataset.onFailed = 'payjpCheckoutOnFailed'
    script.dataset.key = data.key
    script.dataset.partial = data.partial ?? 'false'
    if (data.text) script.dataset.text = data.text
    if (data.submitText) script.dataset.submitText = data.submitText
    if (data.tokenName) script.dataset.tokenName = data.tokenName
    if (data.previousToken) script.dataset.previousToken = data.previousToken
    if (data.lang) script.dataset.lang = data.lang
    if (data.namePlaceholder) script.dataset.namePlaceholder = data.namePlaceholder
    if (data.tenant) script.dataset.tenant = data.tenant

    const payjpCheckoutElement = document.getElementById(payjpCheckoutId)
    payjpCheckoutElement?.appendChild(script)

    return () => {
      // すでに https://checkout.pay.jp/ の checkout.js が実行済みで、script タグを削除しているだけ
      payjpCheckoutElement?.removeChild(script)
      window.payjpCheckoutOnCreated = null
      window.payjpCheckoutOnFailed = null
      // window.alert = windowAlertBackUp
      window.PayjpCheckout = null
    }
  }, [className, data, onCreated, onFailed, payjpCheckoutId]) // 依存配列を追加

  return (<div id={payjpCheckoutId}></div>)
}

export default PayjpCheckout
