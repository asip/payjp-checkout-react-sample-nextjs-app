'use client';

// import { useRouter } from 'next/navigation';
import Link from 'next/link'
import PayjpCheckout from '@/components/class/payjp-checkout'
import type { PayjpCheckoutPayload, PayjpCheckoutErrorPayload } from '@/components/class/payjp-checkout'

export default function Class() {
  const payjpCheckoutProps = {
    dataKey: process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY,
    dataText: 'クレジットカードで支払う',
    dataPartial: 'true',
    onCreatedHandler: onCreated,
    onFailedHandler: onFailed,
  }

  /* const router = useRouter();

  function toFunc(){
    router.push('/func')
  } */

  function onCreated(payload: PayjpCheckoutPayload) {
    //console.log(payload)
    console.log(payload.token)
  }

  function onFailed(payload: PayjpCheckoutErrorPayload) {
    console.log(payload.message)
  }

  return (
    <div className="payjpButtonArea">
      <div>class component</div>
      {/* <div><a href="" onClick={toFunc}>function component</a></div> */}
      <div><Link href="/">function component</Link></div>
      <PayjpCheckout {...payjpCheckoutProps} />
    </div>
  )
}
