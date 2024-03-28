# docspider-test
Teste para a Docspider, feito em C# com ASP.NET, JavaScript Vanilla e Bootstrap


## Como foi fazer este projeto?

Foi uma experiência diferente, pois nunca tinha mexido com ASP.NET, apesar de ter mexido relativamente bastante com C#, foi apenas para criação de jogos, então tive que me virar para fazer.

Estava com pouca prática com JavaScript Vanilla. Escolhi fazer com Vanilla pois não sei mexer com JQuery eficientemente.


## Por que tem dois back-ends (Fastify e ASP.NET)?

Eu passo a maioria do tempo que estou no computador usando Linux. É Linux no trabalho e dual-boot em casa, os únicos lugares que eu tinha para mexer no Windows era na faculdade e conectando via AnyDesk no meu computador ligado em casa. Como vocês devem saber, não é uma experiência tão legal desenvolver C# no Linux, por isso fiz esse back-end, eu precisava testar meu front-end integrando com back-end.


## Como rodar os projetos?

Pré-requisitos gerais:
- PostgreSQL (para o desenvolvimento foi usada a versão 16.2)

### frontend-html

É possível subir o projeto num servidor HTTP como Apache ou Nginx. Para o desenvolvimento, foi usado a extensão Live Server no VS Code. O projeto foi subido no Vercel e está disponível no link [https://docspider-test.vercel.app](https://docspider-test.vercel.app). O front-end subido está apontando para o back-end do ASP.NET ([https://localhost:7091](https://localhost:7091))

### backend-fastify

Pré-requisitos:
- Node 18+
- NPM

Passo a passo:
1. Entre na pasta `backend-fastify`;
1. Rode as migrations manualmente no banco de dados. Devido ao Drizzle-ORM, as migrations são guardadas em .SQL na pasta `drizzle/`;
1. Copie o `.env.example` para `.env` e coloque as chaves necessárias;
1. Rode `npm install` para baixar todas as dependências;
1. Inicie o servidor com o comando `npm start`.

### BackendAspNet

Pré-requisitos:
- dotnet 6.0
- EF Core CLI Tools

Passo a passo:
1. Entre na pasta `BackendAspNet/BackendAspNet`;
1. Rode o comando `dotnet restore` para baixar as dependências;
1. Edite o appsettings.json, preenchendo o `ConnectionStrings > DefaultConnection` com sua connection string para o banco de dados seguindo o seguinte modelo: `Host=<>;Port=<>;Username=<>;Password=<>;Database=<>`, troque os `<>` pelo seu respectivo dado;
1. Rode o comando `dotnet ef database update` para rodar as migrations;
1. Inicie o servidor com o comando `dotnet run`.
