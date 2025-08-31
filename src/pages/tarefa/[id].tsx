import { GetServerSideProps } from "next";
import Head from "next/head";

import { db } from "@/services/firebaseConnection";
import { doc, collection, where, query, getDoc } from "firebase/firestore";

import type { TaskProps } from "@/interfaces/tasksProps";

function Tarefa({ task }: TaskProps) {
  return (
    <>
      <Head>
        <title>Tasks+ | Detalhes da tarefa</title>
      </Head>
    <div>
      <h1>Tarefa</h1>
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
    taskID: id,
    task: snapshot?.data()?.task,
    isPublic: snapshot?.data()?.isPublic,
    created: new Date(milleseconds).toLocaleDateString("pt-BR"),
    userName: snapshot?.data()?.userName,
    userEmail: snapshot?.data()?.userEmail,
  };

  return {
    props: {
      task,
    }
  }
}
