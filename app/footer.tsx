import Link from "next/link";

export function Footer() {
    return <div className="flex items-center h-40 border-t bg-gray-50 mt-12">
        <div className="container mx-auto py-2 text-center flex justify-between items-center">
            <p>SafeBox - 2025</p>

            <Link href="/privacy" className="text-gray-700">Политика конфиденциальности</Link>
            <Link href="/terms" className="text-gray-700">Условия использования</Link>
            <Link href="/about" className="text-gray-700">О нас</Link>
        </div>
    </div>
}