import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Header() {
    return <div className="relative z-10 border-b bg-gray-50">
        <div className="flex container mx-auto items-center justify-between py-2">
            <Link href="/" className="inline-flex items-center gap-1 text-2xl/9 font-bold tracking-tight">
                <Image src="/logo.png" alt="Логотип файлового хранилища" width={30} height={30} />
                SafeBox
            </Link>

            <SignedIn>
                <Button variant='outline' className="text-gray-600">
                    <Link href="/dashboard/files">Все файлы</Link>
                </Button>
            </SignedIn>


            <div className="flex gap-2">
                <OrganizationSwitcher />
                <UserButton />

                <SignedOut>
                    <SignInButton>
                        <Button>Авторизоваться</Button>
                    </SignInButton>
                </SignedOut>
            </div>

        </div>
    </div>
}