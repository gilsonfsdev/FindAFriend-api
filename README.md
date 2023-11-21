# Find a Friend

A "Find a Friend" é uma API Rest para adoção de cães e gatos. Nela é possível se registrar como organização e então cadastrar seus animais que estão para adoção. O usuário tem a possibilidade de visualizar estes animais e aplicar filtros por cidade, tipo do animal, tamanho entre outros.

### 🎲 Rodando o Back End (servidor)

```bash
# Clone Repository
$ git clone https://github.com/gilsonfsdev/FindAFriend-api.git

# Go to server folder
$ cd findafriend-api

# Install Dependencies
$ npm install

# rename file .env.example to .env

# run docker compose
$ docker compose up -d

# run prisma
$ npx prisma migrate dev

# Run Tests
$ npm run test
$ npm run test:e2e
```

## RFs (Requisitos funcionais) - O que é possível o usuário fazer na aplicação.

- [x] Deve ser possível se cadastrar como uma ORG;
- [x] Deve ser possível realizar login como uma ORG;
- [x] Deve ser possível cadastrar um pet;
- [x] Deve ser possível visualizar detalhes de um pet;
- [x] Deve ser possível deletar e editar os dados um pet ;
- [x] Deve ser possível filtrar pets por suas características;

## RNs (Regras de negócio) - Que condições são aplicadas pra cada regra de negócio.

- [x] Somente a organização logada pode deletar ou alterar os dados de um pet;
- [x] Uma ORG precisa ter um endereço e um número de WhatsApp;
- [x] Um pet deve estar ligado a uma ORG;
- [x] Todos os filtros são opcionais;
- [x] Para uma ORG acessar a aplicação como admin, ela precisa estar logada;


