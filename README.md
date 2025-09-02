Uma plataforma moderna de gerenciamento de tarefas com recursos de compartilhamento e colaboração. Desenvolvida como parte de um curso com melhorias visuais significativas utilizando Tailwind CSS.

✨ Funcionalidades
* Tarefas Públicas: Crie tarefas públicas e compartilhe o link para colaboração
* Tarefas Privadas: Mantenha tarefas pessoais sem opção de compartilhamento
* Sistema de Comentários: Interaja com outras pessoas através de comentários em tarefas públicas
* Autenticação Social: Login simplificado através do Google
* Design Responsivo: Interface adaptada para todos os dispositivos

🛠️ Tecnologias Utilizadas
Next.js: Framework React para renderização do lado do servidor

Next Auth: Autenticação simplificada com provedores sociais

Firebase: Banco de dados em tempo real e hospedagem

Tailwind CSS: Framework CSS utilitário para estilização moderna

🚀 Como Executar o Projeto
Pré-requisitos
Node.js (versão 14 ou superior)

Conta no Firebase

Conta no Google Cloud para OAuth

🚀 **Instalação**

1. Clone o repositório:

```bash
git clone https://github.com/christopher-salomao/tarefas-plus.git

cd tarefas-plus
```

2. Instale as dependências:

```bash
npm install

# ou

yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

```env
NEXTAUTH_URL=http://localhost:3000

# Para criar, vá em https://www.md5hashgenerator.com/
JWT_SECRET=uma_chave_unica_e_grande

# Para criar, vá em: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# chaves do firebase
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

NEXT_PUBLIC_URL=http://localhost:3000
```

Você pode olhar o arquivo .env.example para referência.

4. Inicie o servidor:

```bash
npm run dev
# ou
yarn dev
```

5. Abra http://localhost:3000 no seu navegador.

📦 Scripts Disponíveis
* **npm run dev ou yarn dev**     - Inicia o servidor de desenvolvimento
* **npm run build ou yarn build** - Constrói a aplicação para produção
* **npm run start ou yarn start** - Inicia o servidor de produção

🎨 **Personalização**
Este projeto utiliza Tailwind CSS para estilização, oferecendo uma experiência visual moderna e customizável. Para modificar o tema:

1. Adicione ou modifique as classes diretamente nos componentes
2. Consulte a documentação do Tailwind CSS para mais opções de personalização: https://tailwindcss.com/docs

📱 **Responsividade**
A aplicação é totalmente responsiva e adaptada para:

* Dispositivos móveis
* Tablets
* Desktops

🔒 **Autenticação**
O sistema de autenticação utiliza NextAuth.js com provedor do Google, garantindo segurança e facilidade de uso para os usuários.

📊 **Estrutura de Dados**
As tarefas são armazenadas no Firebase Firestore com a seguinte estrutura:

```json
{
  "tasks": {
    "taskId": {
      "task": "Descrição da tarefa",
      "isPublic": true,
      "created": "timestamp",
      "userName": "Nome do usuário",
      "userEmail": "Email do usuário"
    }
  },
  "comments": {
    "commentId": {
      "taskID": "ID da tarefa",
      "comment": "Texto do comentário",
      "userName": "Nome do usuário",
      "userEmail": "Email do usuário",
      "userImage": "URL da imagem do usuário",
      "created": "timestamp"
    }
  }
}

Este é um projeto de curso com modificações visuais. Contribuições são bem-vindas para:

🤝 **Contribuição**

* Melhorias de acessibilidade
* Novos recursos funcionais
* Otimizações de performance
* Correções de bugs

📄 **Licença**
Este projeto foi desenvolvido para fins educativos e não possui fins comerciais.

Desenvolvido como parte de um curso de desenvolvimento web.
