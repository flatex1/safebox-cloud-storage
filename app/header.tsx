import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
    return <div className="border-b bg-gray-50">
        <div className="flex container mx-auto items-center justify-between py-4">
            <div className="inline-flex items-center gap-1 text-2xl/9 font-bold tracking-tight">
                <svg className="mx-auto w-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0 1 11.573-2.226 3.75 3.75 0 0 1 4.133 4.303A4.5 4.5 0 0 1 18 20.25H6.75a5.25 5.25 0 0 1-2.23-10.004 6.072 6.072 0 0 1-.02-.496Z" clipRule="evenodd" />
                </svg>
                SafeBox
            </div>
            <div className="flex gap-2">
            <OrganizationSwitcher/>
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