import { Shield, Database, Settings, Share2, RefreshCw, Mail, Lock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Политика конфиденциальности
            </h1>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <Shield className="inline-block mr-2 h-5 w-5" /> 1. Общие положения
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">Настоящая политика конфиденциальности описывает, как мы собираем, используем и защищаем вашу персональную информацию при использовании нашего сервиса.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <Database className="inline-block mr-2 h-5 w-5" /> 2. Сбор информации
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">Мы собираем следующие типы информации:</p>
                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                            <li>Персональные данные (имя, email, телефон)</li>
                            <li>Технические данные (IP-адрес, cookies)</li>
                            <li>Информация об использовании сервиса</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <Settings className="inline-block mr-2 h-5 w-5" /> 3. Использование информации
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">Собранная информация используется для:</p>
                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                            <li>Предоставления и улучшения наших услуг</li>
                            <li>Коммуникации с пользователями</li>
                            <li>Аналитики и улучшения сервиса</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <Lock className="inline-block mr-2 h-5 w-5" /> 4. Защита информации
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <Share2 className="inline-block mr-2 h-5 w-5" /> 5. Передача данных третьим лицам
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">Мы не продаем, не обмениваем и не передаем ваши персональные данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <RefreshCw className="inline-block mr-2 h-5 w-5" /> 6. Изменения в политике конфиденциальности
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">Мы оставляем за собой право вносить изменения в данную политику конфиденциальности. Все изменения будут опубликованы на этой странице.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mb-3">
                            <Mail className="inline-block mr-2 h-5 w-5" /> 7. Контакты
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">Если у вас есть вопросы относительно нашей политики конфиденциальности, пожалуйста, свяжитесь с нами по электронной почте: privacy@example.com</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}