import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
    return (
        <>
            <div className="bg-white">
                <div className="relative isolate px-6 lg:px-8">
                    <div
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                                Announcing our next round of funding.{' '}
                                <a href="#" className="font-semibold text-indigo-600">
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    Узнать больше <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
                                Легкий способ сохранить файлы в безопасности
                            </h1>
                            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
                                fugiat veniam occaecat.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    href="/dashboard/files"
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Давайте начнем
                                </Link>
                                <a href="#" className="text-sm/6 font-semibold text-gray-900">
                                    Узнать больше <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="text-center text-base/7 font-semibold text-indigo-600">          SafeBox – надёжное хранилище
                    </h2>
                    <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
                        Всё для безопасного хранения файлов
                    </p>
                    <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                        <div className="relative lg:row-span-2">
                            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                        Мобильная доступность
                                    </p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                        Доступ к файлам в любое время и в любом месте – SafeBox всегда с вами.
                                    </p>
                                </div>
                                <div className="@container relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                                    <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                                        <Image
                                            className="size-full object-cover object-top"
                                            src="https://tailwindui.com/plus/img/component-images/bento-03-mobile-friendly.png"
                                            alt=""
                                            width={1000}
                                            height={1000}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 lg:rounded-l-[2rem]"></div>
                        </div>
                        <div className="relative max-lg:row-start-1">
                            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Производительность</p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                        Молниеносная загрузка файлов и стабильная работа даже при высоких нагрузках.
                                    </p>
                                </div>
                                <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                                    <Image
                                        className="w-full max-lg:max-w-xs"
                                        src="https://tailwindui.com/plus/img/component-images/bento-03-performance.png"
                                        alt=""
                                        width={1000}
                                        height={1000}
                                    />
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-t-[2rem]"></div>
                        </div>
                        <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                            <div className="absolute inset-px rounded-lg bg-white"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Безопасность</p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                        Ваши данные защищены современными методами шифрования и дополнительными мерами безопасности.
                                    </p>
                                </div>
                                <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                                    <Image
                                        className="h-[min(152px,40cqw)] object-cover"
                                        src="https://tailwindui.com/plus/img/component-images/bento-03-security.png"
                                        alt=""
                                        width={1000}
                                        height={1000}
                                    />
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5"></div>
                        </div>
                        <div className="relative lg:row-span-2">
                            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                        Интеграция
                                    </p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                        Лёгкая интеграция с любимыми приложениями и инструментами для оптимизации работы команды.
                                    </p>
                                </div>
                                <div className="relative min-h-[30rem] w-full grow">
                                    <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                                        <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                                            <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                                                <div className="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">
                                                    NotificationSetting.jsx
                                                </div>
                                                <div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
                                            </div>
                                        </div>
                                        <div className="px-6 pt-6 pb-14">{/* Your code example */}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
