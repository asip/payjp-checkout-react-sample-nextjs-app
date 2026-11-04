import * as React from 'react'

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
    PayjpCheckout: unknown | null
  }
}

interface PayjpCheckoutProps {
  className?: string
  data: DataProperties
  onCreatedHandler: ((payload: PayjpCheckoutPayload) => void)
  onFailedHandler: ((payload: PayjpCheckoutErrorPayload) => void)
}

class PayjpCheckout extends React.Component<PayjpCheckoutProps> {

  payjpCheckoutElement: HTMLElement | null = null
  script: HTMLScriptElement | null = null

  // windowAlertBackUp!: () => void
  payjpCheckoutId: string

  constructor(props: PayjpCheckoutProps) {
    super(props)
    this.onCreated = this.onCreated.bind(this)
    this.onFailed = this.onFailed.bind(this)
    this.payjpCheckoutId = crypto.randomUUID()
  }

  static defaultProps = {
    className: 'payjp-button',
    dataKey: '',
    onCreatedHandler: () => {},
    onFailedHandler: () => {},
  }

  componentDidMount() {
    // this.windowAlertBackUp = window.alert
    window.payjpCheckoutOnCreated = this.onCreated
    window.payjpCheckoutOnFailed = this.onFailed
    /*
    PAY.JP の checkout から呼ばれる window.alert を無効化
    // カード情報が不正のときに window.alert が payjp の checkout から呼ばれるため
    window.alert = () => {}
    */

    this.script = document.createElement('script')
    this.script.src = 'https://checkout.pay.jp/'
    this.props.className && this.script.classList.add(this.props.className)
    this.script.dataset.onCreated = 'payjpCheckoutOnCreated'
    this.script.dataset.onFailed = 'payjpCheckoutOnFailed'
    this.script.dataset.key = this.props.data.key
    this.script.dataset.partial = this.props.data.partial || 'false'
    if (this.props.data.text) this.script.dataset.text = this.props.data.text
    if (this.props.data.submitText) this.script.dataset.submitText = this.props.data.submitText
    if (this.props.data.tokenName) this.script.dataset.tokenName = this.props.data.tokenName
    if (this.props.data.previousToken) this.script.dataset.previousToken = this.props.data.previousToken
    if (this.props.data.lang) this.script.dataset.lang = this.props.data.lang
    if (this.props.data.namePlaceholder) this.script.dataset.namePlaceholder = this.props.data.namePlaceholder
    if (this.props.data.tenant) this.script.dataset.tenant = this.props.data.tenant

    this.payjpCheckoutElement = document.getElementById(this.payjpCheckoutId)
    this.payjpCheckoutElement?.appendChild(this.script)
  }

  componentWillUnmount() {
    // すでに https://checkout.pay.jp/ の checkout.js が実行済みで、script タグを削除しているだけ
    this.payjpCheckoutElement?.removeChild(this.script as Node)
    window.payjpCheckoutOnCreated = null
    window.payjpCheckoutOnFailed = null
    // window.alert = this.windowAlertBackUp
    window.PayjpCheckout = null
  }

  shouldComponentUpdate(_nextProps: unknown, _nextState: unknown, _nextContext: unknown) {
    return false // PAY.JP スクリプトが DOM を直接操作するため、React の再レンダリングを抑制
  }

  onCreated(response: PayjpCheckoutResponse) {
    const payload: PayjpCheckoutPayload = {token: response.id}
    this.props.onCreatedHandler(payload)
  }

  onFailed(statusCode: number, errorResponse: PayjpCheckoutErrorResponse) {
    const payload: PayjpCheckoutErrorPayload = {statusCode, message: errorResponse.message}
    this.props.onFailedHandler(payload)
  }

  render() {
    return <div id={this.payjpCheckoutId}></div>
  }
}

export default PayjpCheckout
