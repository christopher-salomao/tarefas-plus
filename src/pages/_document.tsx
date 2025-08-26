import { Header } from "@/components/header";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR" className="text-white">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <title>Tasks+ | Organize suas tarefas de forma fácil</title>
      </Head>
      <Header />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
