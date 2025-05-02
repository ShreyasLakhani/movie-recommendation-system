'use client'
import Image from 'next/image'

export default function SplashImage() {
  return (
    <div className="hidden md:block md:w-1/2 relative h-screen">
      <Image
        src="/img/img.png" // use your preferred image path
        alt="Auth splash"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        priority
      />
    </div>
  )
}
