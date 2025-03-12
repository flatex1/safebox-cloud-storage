"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { SignUpButton, SignedOut } from "@clerk/nextjs";
import { GithubIcon, GithubIconHandle } from "@/components/ui/github";

export function HeroContent() {
  const [titleNumber, setTitleNumber] = useState(0);
  const githubIonRef = useRef<GithubIconHandle>(null);
  const titles = useMemo(
    () => ["надёжное", "удобное", "безопасное", "простое", "умное"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="flex flex-1 gap-12 flex-col text-center lg:text-left">
      <div>
        <Button variant="secondary" size="sm" className="gap-4">
          Читать о запуске <MoveRight className="w-4 h-4" />
        </Button>
      </div>

      <h1 className="text-4xl md:text-7xl max-w-5xl tracking-tighter text-center lg:text-left font-regular">
        <span className="text-spektr-cyan-50">SafeBox — это</span>
        <span className="relative flex w-full justify-center lg:justify-start overflow-hidden text-center lg:text-left md:pb-4 md:pt-1">
          &nbsp;
          {titles.map((title, index) => (
            <motion.span
              key={index}
              className="absolute font-semibold"
              initial={{ opacity: 0, y: "-100" }}
              transition={{ type: "spring", stiffness: 50 }}
              animate={
                titleNumber === index
                  ? {
                      y: 0,
                      opacity: 1,
                    }
                  : {
                      y: titleNumber > index ? -150 : 150,
                      opacity: 0,
                    }
              }
            >
              {title}
            </motion.span>
          ))}
        </span>
        <span className="text-spektr-cyan-50">облачное хранилище</span>
      </h1>

      <p className="text-base md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center lg:text-left">
        SafeBox — это защищённое облачное хранилище для ваших файлов. Загружайте
        файлы, организуйте их в командах и делитесь ими с коллегами. Войдите в
        систему с помощью Git или Google — быстро и безопасно.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
        <Button
          size="lg"
          className="gap-4"
          variant="outline"
          onMouseEnter={() => githubIonRef.current?.startAnimation()}
          onMouseLeave={() => githubIonRef.current?.stopAnimation()}
        >
          Проект на GitHub <GithubIcon ref={githubIonRef} className="w-4 h-4" />
        </Button>
        <SignedOut>
          <SignUpButton>
            <Button size="lg" className="gap-4">
              Зарегистрироваться <MoveRight className="w-4 h-4" />
            </Button>
          </SignUpButton>
        </SignedOut>
      </div>
    </div>
  );
}
