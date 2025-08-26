import Image from "next/image";
import heroImage from "../../public/assets/hero.png";

export default function Home() {
  return (
    <div className="bg-neutral-900 w-full h-screen flex flex-col justify-center items-center">
      <main>
        <div className="flex flex-col justify-center items-center">
          <Image
            src={heroImage}
            alt="Hero Tasks+"
            priority
            className="max-w-[480px] w-auto h-auto object-contain"
          />
        </div>
        <h1 className="text-white text-center text-3xl/[150%]">
          Sistema feito para você organizar <br /> seus estudos e tarefas
        </h1>
      </main>
    </div>
  );
}
