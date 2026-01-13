'use client';

// import { useRouter } from 'next/navigation';
import Link from 'next/link'
import PayjpCheckout from "@/components/func/payjp-checkout"
import type { PayjpCheckoutPayload, PayjpCheckoutErrorPayload } from "@/components/func/payjp-checkout"

export default function Index() {
  const payjpCheckoutProps = {
    dataKey: process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY,
    dataText: 'クレジットカードで支払う',
    dataPartial: 'true',
    onCreatedHandler: onCreated,
    onFailedHandler: onFailed,
  }

  /*
  const router = useRouter()
  function toTop() {
    router.push('/')
  }
  */

  function onCreated(payload: PayjpCheckoutPayload) {
    //console.log(payload)
    console.log(payload.token)
  }

  function onFailed(payload: PayjpCheckoutErrorPayload) {
    console.log(payload.message)
  }

  return (
    <div className="payjpButtonArea">
      <div>function component</div>
      {/* <div><a href="" onClick={toTop}>class component</a></div> */}
      <div><Link href="/class" >class component</Link></div>
      <PayjpCheckout {...payjpCheckoutProps} />
    </div>
  )
}
