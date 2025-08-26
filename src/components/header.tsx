import Link from "next/link";

export function Header() {
  return (
    <header className="w-full h-19 bg-zinc-900 flex justify-center items-center">
      <section className="px-[18px] w-full max-w-5xl flex justify-between items-center">
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-[32px] font-bold ">
            <h1>
              Tasks<span className="text-red-600 pl-0.5">+</span>
            </h1>
          </Link>
          <Link href="/painel" className="bg-neutral-100 text-black py-1 px-3.5 rounded">Meu Painel</Link>
        </nav>

        <button className="py-2 px-8 rounded-full border-[1.5px] border-red-600 cursor-pointer transition-all duration-400 hover:scale-108 hover:bg-red-600 hover:font-bold">
          Acessar
        </button>
      </section>
    </header>
  );
}
