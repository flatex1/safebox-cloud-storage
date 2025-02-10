import { ShieldCheck, HardDrive, Scroll, UserX, KeyRound, FileWarning, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TermsOfService() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Условия использования SafeBox
            </h1>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <ShieldCheck className="inline-block mr-2 h-5 w-5" /> 1. Общие положения
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">Настоящие условия использования определяют правила и порядок использования облачного хранилища SafeBox, а также права и обязанности пользователей сервиса.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <HardDrive className="inline-block mr-2 h-5 w-5" /> 2. Использование сервиса
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">При использовании SafeBox вы соглашаетесь:</p>
                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                            <li>Не загружать нелегальный контент</li>
                            <li>Не нарушать авторские права</li>
                            <li>Соблюдать ограничения по объему хранения</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <Scroll className="inline-block mr-2 h-5 w-5" /> 3. Права и ограничения
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">Пользователям предоставляется:</p>
                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                            <li>Доступ к облачному хранилищу</li>
                            <li>Возможность загрузки и скачивания файлов</li>
                            <li>Инструменты управления файлами</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <KeyRound className="inline-block mr-2 h-5 w-5" /> 4. Безопасность
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">SafeBox обеспечивает безопасность ваших файлов через шифрование данных, регулярное резервное копирование и защиту от несанкционированного доступа.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <UserX className="inline-block mr-2 h-5 w-5" /> 5. Ответственность
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">Пользователи несут полную ответственность за содержимое загружаемых файлов. SafeBox не несет ответственности за потерю данных, произошедшую по вине пользователя.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <FileWarning className="inline-block mr-2 h-5 w-5" /> 6. Изменения условий
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">SafeBox оставляет за собой право изменять условия использования сервиса. Пользователи будут уведомлены о существенных изменениях через электронную почту.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <HelpCircle className="inline-block mr-2 h-5 w-5" /> 7. Поддержка
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">По всем вопросам использования сервиса SafeBox вы можете обратиться в службу поддержки: support@safezy.ru</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}