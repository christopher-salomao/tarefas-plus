import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

import { db } from "@/services/firebaseConnection";
import {
  doc,
  collection,
  where,
  query,
  getDoc,
  addDoc,
  getDocs,
} from "firebase/firestore";

import type { TaskProps } from "@/interfaces/tasksProps";

import Head from "next/head";
import { Textarea } from "@/components/textarea";
import toast from "react-hot-toast";
import { toastStyle } from "@/styles/toastStyle";

interface TeskDetailsProps {
  task: TaskProps;
  allComments: CommentProps[];
}

interface CommentProps {
  taskID: string;
  comment: string;
  userName: string;
  userEmail: string;
  userImage: string;
  created: string;
}

function Tarefa({ task, allComments }: TeskDetailsProps) {
  const [input, setInput] = useState("");

  const { data: session } = useSession();

  console.log(allComments);

  async function handleComment(e: FormEvent) {
    e.preventDefault();

    if (!session?.user?.email || !session?.user?.name) return;

    toast.promise(
      async () => {
        await addDoc(collection(db, "comments"), {
          comment: input,
          userName: session?.user?.name,
          userEmail: session?.user?.email,
          userImage: session?.user?.image,
          taskId: task?.id,
          created: new Date(),
        });

        setInput("");
      },
      {
        loading: "Enviando comentário...",
        success: "Comentário enviado com sucesso!",
        error: "Erro ao enviar comentário!",
      },
      {
        style: toastStyle,
      }
    );
  }

  return (
    <>
      <Head>
        <title>Tasks+ | Detalhes da tarefa</title>
      </Head>
      <div className="contentor w-full max-w-5xl mx-auto px-[18px] flex flex-col items-center ">
        <main className="w-full">
          <h1 className="text-3xl mt-10 font-bold mb-3.5">Tarefa</h1>
          <article className="w-full flex flex-col items-center justify-center">
            <p className="whitespace-pre-wrap w-full p-3.5 border-[1.5px] border-neutral-500 rounded">
              {task.task}
            </p>
            <p className="text-xs mt-2 self-start text-neutral-700">
              Criada em por <em className="font-bold">{task.userName}</em> em{" "}
              <strong>{String(task.created)}</strong>
            </p>
          </article>
        </main>

        <section className="w-full max-w-5xl flex flex-col mt-6">
          <h2 className="text-2xl font-bold my-3.5">Deixar um comentário</h2>
          <form onSubmit={handleComment}>
            <div className="w-full h-[125px]">
              <Textarea
                placeholder="Deixe seu comentário..."
                disabled={!session?.user}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full border-nonebg-red-600 py-2 rounded bg-red-600 hover:bg-red-500 transition-all duration-400 text-[18px] font-medium text-white mt-3 disabled:bg-red-600/65"
              disabled={!session?.user || !input}
            >
              Enviar comentário
            </button>
          </form>
        </section>

        <section className="w-full max-w-5xl flex flex-col mt-10">
          <h2 className="text-2xl font-bold my-3.5">Todos os comentários</h2>
          {allComments.length > 0 ? (
            <p></p>
          ): (
            <p className="text-xl font-bold my-3.5">Nenhum comentário ainda</p>
          )}
        </section>
      </div>
    </>
  );
}

export default Tarefa;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;

  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const docRef = doc(db, "tasks", id as string);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapshot?.data()?.isPublic) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const milleseconds = snapshot?.data()?.created.seconds * 1000;

  const task = {
    id: id,
    task: snapshot?.data()?.task,
    isPublic: snapshot?.data()?.isPublic,
    created: new Date(milleseconds).toLocaleDateString("pt-BR"),
    userName: snapshot?.data()?.userName,
    userEmail: snapshot?.data()?.userEmail,
  };

  const commentsRef = collection(db, "comments");
  const q = query(commentsRef, where("taskId", "==", id));

  const commentsSnapshot = await getDocs(q);

  const allComments: CommentProps[] = [];


  commentsSnapshot.forEach((doc) => {
    allComments.push({
      taskID: doc.data().taskId,
      comment: doc.data().comment,
      userName: doc.data().userName,
      userEmail: doc.data().userEmail,
      userImage: doc.data().userImage,
      created: new Date(doc.data().created.seconds * 1000).toLocaleDateString("pt-BR"),
    });
  });

  console.log(allComments);

  return {
    props: {
      task: task,
      allComments: allComments,
    },
  };
};
