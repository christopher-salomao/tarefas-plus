import { Textarea } from "@/components/textarea";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

import {
  addDoc,
  collection,
  onSnapshot,
  where,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

import Head from "next/head";
import { FaShare, FaTrashCan } from "react-icons/fa6";
import toast from "react-hot-toast";
import { toastStyle } from "@/styles/toastStyle";
import { on } from "events";

interface HomeProps {
  user: {
    name: string;
    email: string;
  };
}

interface TaskProps {
  id: string;
  created: Date;
  task: string;
  isPublic: boolean;
  userName: string;
  userEmail: string;
}

export default function Painel({ user }: HomeProps) {
  const [textarea, setTextarea] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasksList, setTasksList] = useState<TaskProps[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const tasksRef = collection(db, "tasks");
      const q = query(
        tasksRef,
        orderBy("created", "desc"),
        where("userEmail", "==", user?.email)
      );

      const onsub = onSnapshot(q, (snapshot) => {
        console.log(snapshot);
        let list: TaskProps[] = [];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            task: doc.data().task,
            isPublic: doc.data().isPublic,
            created: doc.data().created,
            userName: doc.data().userName,
            userEmail: doc.data().userEmail,
          });
        });

        setTasksList(list);
      });
    }

    loadTasks();
  }, [user?.email]);

  async function handleRegisterTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (textarea === "") {
      toast.error("Preencha a tarefa!");
      return;
    }

    try {
      await toast.promise(
        async () => {
          await addDoc(collection(db, "tasks"), {
            task: textarea,
            isPublic: publicTask,
            created: new Date(),
            userEmail: user.email,
            userName: user.name,
          });
        },
        {
          loading: "Criando tarefa...",
          success: "Tarefa criada com sucesso!",
          error: "Erro ao criar tarefa!",
        },
        {
          style: toastStyle,
        }
      );
      setTextarea("");
      setPublicTask(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteTask(id: string) {
    try {
      await toast.promise(
        async () => {
          const taskRef = doc(db, "tasks", id);
          await deleteDoc(taskRef);
        },
        {
          loading: "Deletando tarefa...",
          success: "Tarefa deletada com sucesso!",
          error: "Erro ao deletar tarefa!",
        },
        {
          style: toastStyle,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

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
              <form onSubmit={handleRegisterTask}>
                <div className="w-full h-48 flex flex-col gap-2">
                  <Textarea
                    placeholder="Escreva aqui sua tarefa..."
                    maxLength={2000}
                    value={textarea}
                    onChange={(e) => setTextarea(e.target.value)}
                  />
                  <span className="self-end text-gray-300 text-sm">
                    {textarea.length}/2000
                  </span>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="chechboxArea"
                    id="chechboxArea"
                    checked={publicTask}
                    onChange={(e) => setPublicTask(e.target.checked)}
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

              {tasksList.length > 0 && (
                <>
                  {tasksList.map((task) => (
                    <article
                      key={task.id}
                      className="mb-4 flex flex-col gap-2 border-[1.5px] border-neutral-700 rounded p-4"
                    >
                      {task.isPublic && (
                        <div className="flex items-center gap-2">
                          <label className="px-0.5 py-1.5 bg-red-600 text-xs text-white rounded">
                            PÚBLICO
                          </label>
                          <button className="hover:scale-108 transition-all duration-400">
                            <FaShare size={22} color="#fb2c36" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 w-full">
                        <p className="grow whitespace-pre-wrap">{task.task}</p>
                        <button
                          className="text-neutral-600 hover:text-red-700 transition-all duration-400"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <FaTrashCan size={24} />
                        </button>
                      </div>
                    </article>
                  ))}
                </>
              )}
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
    props: {
      user: {
        name: session?.user?.name,
        email: session?.user?.email,
      },
    },
  };
};
