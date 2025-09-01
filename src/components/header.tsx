import { useSession, signIn, signOut } from "next-auth/react";

import Link from "next/link";

import defoultAvatar from "../../public/assets/default_avatar.png";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full h-19 bg-zinc-900 flex justify-center items-center *:text-white">
      <section className="px-[18px] w-full max-w-5xl flex justify-between items-center">
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-[32px] font-bold ">
            <h1>
              Tasks<span className="text-red-600 pl-0.5">+</span>
            </h1>
          </Link>
          {session?.user && (
            <Link
              href="/painel"
              className="bg-red-600  py-1 px-3.5 rounded hover:bg-red-500 transition-all duration-400"
            >
              Meu Painel
            </Link>
          )}
        </nav>

        {status === "loading" ? (
          <></>
        ) : session ? (
          <button
            className="py-2 px-2 md:px-8 rounded-full border-[1.5px] border-red-600 cursor-pointer transition-all duration-400 hover:scale-108 hover:bg-red-600 hover:font-bold flex items-center gap-2"
            onClick={() => signOut()}
          >
            <span className="md:inline-block hidden">
              Olá {session?.user?.name}
            </span>
            {session.user?.image && (
              <img
                src={session?.user?.image as string}
                alt={session?.user?.name ?? "User"}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = defoultAvatar.src;

                  (e.currentTarget as HTMLImageElement).classList.add(
                    "bg-neutral-100"
                  )
                }}
              />
            )}
          </button>
        ) : (
          <button
            className="py-2 px-8 rounded-full border-[1.5px] border-red-600 ansition-all duration-400 hover:scale-108 hover:bg-red-600 hover:font-bold"
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}
