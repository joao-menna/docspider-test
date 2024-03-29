# docspider-test

Teste para a Docspider, feito em C# com ASP.NET, JavaScript Vanilla e Bootstrap


## Como foi fazer este projeto?

Foi uma experiência estimulante, pois nunca havia mexido com ASP.NET, apesar de ter utilizado relativamente bastante com C#, foi apenas para criação de jogos, então fui forçado a me desafiar.

Dei preferência por utilizar JavaScript Vanilla, devido ao meu conhecimento de JQuery não ser elevado e ao prazo de entrega do projeto.


## Por que existem dois back-ends (Fastify e ASP.NET)?

Nos computadores que utilizo, dei preferência por utilizar Linux. Através de dual-boot no computador de casa, utilizei Windows para instalação do ambiente de desenvolvimento e criação / testes do projeto. A partir da faculdade, consegui desenvolver meu sistema utilizando o AnyDesk, para conexão remota. Não é uma boa experiência desenvolver C# no Linux, por isso houve a necessidade de criar um segundo back-end para testes no sistema operacional.


## Como executar os projetos?

Pré-requisitos gerais:
- PostgreSQL 16.2+


### frontend-html

É possível subir o projeto num servidor HTTP como Apache ou Nginx. Para o desenvolvimento, foi utilizado a extensão Live Server no VS Code. O projeto foi carregado no Vercel e está disponível no link [https://docspider-test.vercel.app](https://docspider-test.vercel.app). O front-end que está rodando aponta para o back-end do ASP.NET ([https://localhost:7091](https://localhost:7091))


### BackendAspNet

Pré-requisitos:
- dotnet 6.0
- EF Core CLI Tools

Passo a passo:
1. Entre na pasta `BackendAspNet/BackendAspNet`;
1. Execute o comando `dotnet restore` para baixar as dependências;
1. Edite o arquivo `appsettings.json`, preenchendo o `ConnectionStrings > DefaultConnection` com sua string de conexão para a fonte de dados seguindo o modelo: `Host=<>;Port=<>;Username=<>;Password=<>;Database=<>`, substitua os `<>` pelos seus respectivos dados;
1. Execute o comando `dotnet ef database update` para atualizar o banco de dados com as migrações;
1. Inicie o servidor com o comando `dotnet run`.

Obs.: Decidi utilizar o dotnet 6.0 devido à essa versão ser a única disponível na faculdade.


### backend-fastify (caso queira testar o projeto em Linux)

Pré-requisitos:
- Node 18+
- NPM

Passo a passo:
1. Entre na pasta `backend-fastify`;
1. Execute as migrações manualmente no banco de dados. Devido ao Drizzle-ORM, as migrações do banco de dados são guardadas em .SQL na pasta `drizzle/`;
1. Copie o `.env.example` para `.env` e coloque as chaves necessárias;
1. Execute `npm install` para baixar todas as dependências;
1. Inicie o servidor com o comando `npm start`.
