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
  orderBy,
  deleteDoc,
} from "firebase/firestore";

import type { TaskProps } from "@/interfaces/tasksProps";

import Head from "next/head";
import { Textarea } from "@/components/textarea";
import toast from "react-hot-toast";
import { toastStyle } from "@/styles/toastStyle";
import { FaTrashCan } from "react-icons/fa6";

interface TeskDetailsProps {
  task: TaskProps;
  allComments: CommentProps[];
}

interface CommentProps {
  id: string;
  taskID: string;
  comment: string;
  userName: string;
  userEmail: string;
  userImage: string;
  created: string;
}

function Tarefa({ task, allComments }: TeskDetailsProps) {
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);

  const { data: session } = useSession();

  async function handleComment(e: FormEvent) {
    e.preventDefault();

    if (!session?.user?.email || !session?.user?.name) return;

    toast.promise(
      async () => {
        const docRef = await addDoc(collection(db, "comments"), {
          comment: input,
          userName: session?.user?.name,
          userEmail: session?.user?.email,
          userImage: session?.user?.image,
          taskId: task?.id,
          created: new Date(),
        });

        const data: CommentProps = {
          id: docRef.id,
          comment: input,
          userName: session?.user?.name ?? "",
          userEmail: session?.user?.email ?? "",
          userImage: session?.user?.image ?? "",
          taskID: task?.id ?? "",
          created: new Date().toLocaleDateString("pt-BR"),
        };

        setComments((prevState) => [...prevState, data]);

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

  async function handleDeleteComment(id: string) {
    toast.promise(
      async () => {
        const docRef = doc(db, "comments", id);
        await deleteDoc(docRef);

        const commentsFiltered = comments.filter(
          (comment) => comment.id !== id
        );
        setComments(commentsFiltered);
      },
      {
        loading: "Deletando comentário...",
        success: "Comentário deletado com sucesso!",
        error: "Erro ao deletar comentário!",
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
          {comments.length > 0 ? (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="w-full p-3.5  border-neutral-500 rounded border-[1.5px] mb-3.5"
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center w-fit gap-2 ">
                    <div className="flex items-center gap-2  px-1 py-0.5 rounded bg-neutral-400">
                      <img
                        src={comment.userImage}
                        alt={comment.userName}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="md:text-sm text-white">
                        {comment.userName}
                      </span>
                    </div>

                    {session?.user?.email === comment.userEmail && (
                      <button
                        className="text-neutral-600 hover:text-red-700 transition-all duration-400"
                        onClick={() =>
                          handleDeleteComment(comment.id as string)
                        }
                      >
                        <FaTrashCan size={20} />
                      </button>
                    )}
                  </div>

                  <span className="text-xs">{String(comment.created)}</span>
                </div>

                <div className="w-full flex items-center justify-between">
                  <p className="whitespace-pre-wrap w-full">
                    {comment.comment}
                  </p>
                </div>
              </article>
            ))
          ) : (
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
  const q = query(
    commentsRef,
    where("taskId", "==", id),
    orderBy("created", "asc")
  );

  const commentsSnapshot = await getDocs(q);

  const allComments: CommentProps[] = [];

  commentsSnapshot.forEach((doc) => {
    allComments.push({
      id: doc.id,
      taskID: doc.data().taskId,
      comment: doc.data().comment,
      userName: doc.data().userName,
      userEmail: doc.data().userEmail,
      userImage: doc.data().userImage,
      created: new Date(doc.data().created.seconds * 1000).toLocaleDateString(
        "pt-BR"
      ),
    });
  });

  return {
    props: {
      task: task,
      allComments: allComments,
    },
  };
};
