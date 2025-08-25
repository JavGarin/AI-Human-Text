import { Button } from "./ui/button"
import Link from "next/link"

import { auth } from "@/auth"
import { IAuth } from "@/types/user"
import Logo from "./logo"
import { ThemeSwitcher } from "./theme-switcher";
import UserMenu from "./user-menu"
import Container from "./container"


const Header = async () => {

  const session = await auth() as IAuth

  return (
    <Container className="max-w-5xl left-1/2 -translate-x-1/2 fixed z-10 top-4">
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border dark:border-border rounded-xl px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <ThemeSwitcher />
          </div>
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>
          <div className="flex-1 flex justify-end">
            {!session ? <Link href='/login'><Button variant={'secondary'}>Login</Button></Link> : <UserMenu auth={session} />}
          </div>
        </div>
      </header>
    </Container>
  )
}

export default Header