'use client'
import { motion } from "framer-motion";
import {
  Blocks,
  CreditCard,
  Handshake,
  Scale
} from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "Сервис",
    links: [
      {
        name: "Возможности",
        link: "/#features",
        Icon: Blocks,
      },
      {
        name: "Подписки",
        link: "/#pricing",
        Icon: CreditCard,
      },
    ],
  },
  {
    title: "Юридическая информация",
    links: [
      {
        name: "Политика конфиденциальности",
        link: "/privacy-policy",
        Icon: Scale,
      },
      {
        name: "Условия обслуживания",
        link: "/terms-of-service",
        Icon: Handshake,
      },
    ],
  },
];

export function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-auto pt-24"
    >
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <Link href="#" className="text-xl font-semibold safebox-text">
              Safebox
            </Link>
            <p className="text-sm text-foreground/60">
              Загружайте и объединяйте файлы в безопасном месте.
            </p>

            <p className="text-sm font-light text-foreground/55 mt-3.5 ">
              <Link
                className="hover:text-foreground/90"
                target="_blank"
                href="https://github.com/flatex1"
              >
                Twitter
              </Link>{" "}
              •{" "}
              <Link className="hover:text-foreground/90" href="https://github.com/flatex1">
                Github
              </Link>{" "}
              •{" "}
              <Link className="hover:text-foreground/90" href="https://github.com/flatex1">
                Discord
              </Link>
            </p>
          </motion.div>

          <div className="grid grid-cols-2 mt-16 md:grid-cols-3 lg:col-span-8 lg:justify-items-end lg:mt-0">
            {items.map(({ title, links }, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
                key={title}
                className="last:mt-12 md:last:mt-0"
              >
                <h3 className="text-sm font-semibold">{title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map(({ name, link, Icon }, linkIndex) => (
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 * (linkIndex + 1) }}
                      key={name}
                    >
                      <Link
                        href={link}
                        className="text-sm transition-all text-foreground/60 hover:text-foreground/90 group"
                      >
                        <Icon className="inline stroke-2 h-4 mr-1.5 transition-all stroke-foreground/60 group-hover:stroke-foreground/90" />
                        {name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-20 border-t pt-6 pb-8"
        >
          <p className="text-xs text-foreground/55">Safebox Inc. © 2025</p>
        </motion.div>
      </div>
    </motion.div>
  );
}