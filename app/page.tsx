"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignInButton, SignedOut, SignOutButton, SignedIn, useSession } from "@clerk/nextjs";
import {useMutation, useQuery} from "convex/react";

export default function Home() {
  const session = useSession();

  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
       <SignedIn>
        <SignOutButton>
          <Button>Выйти из системы</Button>
        </SignOutButton>
       </SignedIn>

       <SignedOut>
        <div>Вы вышли из SafeBox</div>
        
        <SignInButton mode="modal">
          <Button>Войти</Button>
        </SignInButton>
       </SignedOut>

      <Button onClick={async () => { await createFile({ name: "hello world"}); }}>
        Нажми на меня
      </Button>
       
      {files?.map(file => {
        return <div key={file._id}>{file.name}</div>
      })}
      </main>
    </div>
  );
}
