import { Textarea } from "@/components/textarea";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";

import Head from "next/head";
import { FaShare, FaTrashCan } from "react-icons/fa6";

export default function Painel() {
  const [textareaLength, setTextareaLength] = useState(0);

  return (
    <>
      <Head>
        <title>Tasks+ | Meu painel de tarefas</title>
      </Head>
      <div className="contentor w-full flex justify-center">
        <main className="w-full flex flex-col items-center">
          <section className="bg-[#171717] w-full flex items-center justify-center">
            <div className="w-full max-w-5xl px-[18px] pb-7 mt-8 *:text-white">
              <h1 className="text-2xl mb-2">Qual a sua tarefa?</h1>
              <form action="">
                <div className="w-full h-48 flex flex-col gap-2">
                  <Textarea
                    placeholder="Escreva aqui sua tarefa..."
                    maxLength={2000}
                    onChange={(e) => setTextareaLength(e.target.value.length)}
                  />
                  <span className="self-end text-gray-300 text-sm">
                    {textareaLength}/2000
                  </span>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="chechboxArea"
                    id="chechboxArea"
                    className="w-[18px] h-[18px] accent-red-600"
                  />
                  <label htmlFor="chechboxArea">Deixar tarefa publica?</label>
                </div>

                <button
                  type="submit"
                  className="w-full border-nonebg-red-600 py-2 rounded bg-red-600 hover:bg-red-500 transition-all duration-400 text-[18px] font-medium"
                >
                  Registrar
                </button>
              </form>
            </div>
          </section>

          <section className="w-full max-w-5xl px-[18px] flex items-center justify-center">
            <div className="w-full  pb-7 mt-8 ">
              <h1 className="text-3xl mb-4 font-bold text-center">
                Minhas tarefas
              </h1>

              <article className="mb-4 flex flex-col gap-2 border-[1.5px] border-neutral-700 rounded p-4">
                <div className="flex items-center gap-2">
                  <label className="px-0.5 py-1.5 bg-red-600 text-xs text-white rounded">
                    PÚBLICO
                  </label>
                  <button className="hover:scale-108 transition-all duration-400">
                    <FaShare size={22} color="#fb2c36" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 w-full">
                  <p className="grow whitespace-pre-wrap">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    {"\n"}
                    Ea officia, alias iure quae eius provident explicabo ex
                    quidem maiores, sit, dolore labore cupiditate corporis
                    veniam incidunt non at saepe est.
                  </p>
                  <button className="text-neutral-600 hover:text-red-700 transition-all duration-400">
                    <FaTrashCan size={24} color="" />
                  </button>
                </div>
              </article>

            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
