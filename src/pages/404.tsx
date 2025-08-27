import Link from "next/link";

function NotFound() {
  return (
    <div className="contentor w-full flex flex-col items-center justify-center">
      <h1 className="text-9xl font-bold text-red-600">404</h1>
      <h2 className="text-5xl font-bold mt-4 mb-8">
        Ops, parece que esta página não existe
      </h2>
      <Link
        href="/"
        className="py-2 px-8 rounded-full border-[1.5px] border-red-600 cursor-pointer transition-all duration-400 hover:scale-108 hover:bg-red-600 hover:font-bold"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}

export default NotFound;
