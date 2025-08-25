import Link from "next/link"
import Image from "next/image"

const Logo = () => {

  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/assets/logo.png" alt="logo" width={40} height={40} />
      <h1 className="text-lg font-bold">AI Human Text</h1>
    </Link>
  )
}

export default Logo