import { GetStaticProps } from "next";
import Image from "next/image";

import heroImage from "../../public/assets/hero.png";
import styles from "../styles/Home.module.css"

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

interface HomeProps {
  posts: number;
  comments: number;
}

export default function Home({ posts, comments }: HomeProps) {
  return (
    <div className="contentor w-full flex flex-col justify-center items-center bg-[#171717]">
      <main>
        <div className="flex flex-col justify-center items-center">
          <Image
            src={heroImage}
            alt="Hero Tasks+"
            priority
            className="max-w-8/10 sm:max-w-[480px] w-auto h-auto object-contain"
          />
        </div>
        <h1 className="text-center text-2xl/[150%] sm:text-3xl/[150%] my-4 text-white">
          Sistema feito para você organizar <br /> seus estudos e tarefas
        </h1>

        <div>
          <section className="flex sm:flex-row flex-col justify-around items-center">
            <span className={styles.box}>+{posts} posts</span>
            <span className={styles.box}>+{comments} comentários</span>
          </section>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const commentsRef = collection(db, "comments");
  const commentsSnapshot = await getDocs(commentsRef);

  const postsRef = collection(db, "tasks");
  const postsSnapshot = await getDocs(postsRef);

  return {
    props: {
      posts: postsSnapshot.size || 0,
      comments: commentsSnapshot.size || 0,
    },
    revalidate: 60, // em segundos
  };
}
