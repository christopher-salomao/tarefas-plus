import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import Head from "next/head";

export default function Painel() {
  return (
    <div className="contentor w-full">
      <Head>
        <title>Tasks+ | Meu painel de tarefas</title>
      </Head>
      <h1>Meu painel</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
