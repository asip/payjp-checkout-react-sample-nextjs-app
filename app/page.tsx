'use client';

// import { useRouter } from 'next/navigation';
// import Link from 'next/link'
import PayjpCheckout from "@/components/func/payjp-checkout"
import type { PayjpCheckoutPayload, PayjpCheckoutErrorPayload } from "@/types"

export default function Index() {
  const payjpCheckoutProps = {
    data: { key: process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? '', text: 'クレジットカードで支払う', partial: 'true' },
    onCreatedHandler: onCreated,
    onFailedHandler: onFailed,
  }

  /*
  const router = useRouter()

  function toClass() {
    router.push('/class')
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
      <PayjpCheckout {...payjpCheckoutProps} />
      {/* <div><a href="" onClick={toClass}>class component</a></div> */}
      {/* <div><Link href="/class" >class component</Link></div> */}
    </div>
  )
}
