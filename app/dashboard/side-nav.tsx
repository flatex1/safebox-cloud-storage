'use client'

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="w-40 flex flex-col justify-start">
      <Link href="/dashboard/files">
        <Button  
        variant={'link'}
        className={clsx("flex gap-2", {
          "text-blue-500" : pathname.includes("dashboard/files")
        })}
        >
          <FileIcon />Все файлы
        </Button>
      </Link>  

      <Link href="/dashboard/favorites">
        <Button 
        variant={'link'}
        className={clsx("flex gap-2", {
          "text-blue-500" : pathname.includes("dashboard/favorites")
        })}
        >
          <StarIcon />Избранное
        </Button>
      </Link>

      <Link href="/dashboard/trash">
        <Button 
        variant={'link'}
        className={clsx("flex gap-2", {
          "text-blue-500" : pathname.includes("dashboard/trash")
        })}
        >
          <TrashIcon />Корзина
        </Button>
      </Link>
    </div>
  );
}