<h1 align="center">GCP - Danilo</h2>
<br>

## Sobre

Projeto desenvolvido para desenvolvimento de uma POC utilizando A GCP (Recursos de Firebase e functions)

## Tecnologias aplicadas

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js]
- [Typescript]
- [Jest]
- [Firebase]
- [Firebase Functions]
- [Firebase Emulator]
- [Class-Validator]
- [Class-Transformer]

## Requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](v18 ou superior)
- [Java 11+]
- [Firebase CLI]

## Padrão e arquitetura

- Principios [SOLID]
- Padrão de arquitetura de software: [Clean Architecture]
- Testes utilizando [Jest]

## Executar a aplicação

```bash
# Clonar o repositório
$ git clone https://github.com/danilovitolo/danilo-gcp

# Acessar a pasta do projeto
$ cd danilo-gcp

# Autenticação no firebase
$ firebase login

# Instale as dependências. Este comando instalará as dependências do projeto e fará o build da aplicação
$ yarn install-dep ou npm run install-dep

# Inicie a aplicação
$ yarn start ou npm run start

# O servidor inciará na porta:5001
```

## Endpoints

1. Criar um registro:

<i>
OBS: Ao Criar um registro, o firebase irá atualizar o registro com o incremental_id. Você pode verificar o reigistro criado no firestore. Para visualização, acesse no seu navegador -> http://127.0.0.1:4000/firestore/default/data ou execute a chamada do método 2 para obter todos os registros </i>

[POST]

```bash
curl --location 'http://127.0.0.1:5001/{project_id}/us-central1/createRecordFunction' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Registro Teste"
}'
```

Exemplo de retorno:

```json
StatusCode: 201 - Created
{
    "name": "Registro Teste",
    "id": "OhEsolylY5O78QMVv31f"
}
```

2. Obter todos os registros:

[GET]

```bash
curl --location 'http://127.0.0.1:5001/{project_id}/us-central1/findAllRecordsFunction'
```

Exemplo de retorno:

```json
StatusCode: 200
[
    {
        "name": "Registro Teste",
        "incremental_id": 1,
        "id": "OhEsolylY5O78QMVv31f"
    },
    {
        "name": "Segundo Registro Teste",
        "incremental_id": 2,
        "id": "VTxYsYjOmIVvVYoXUMRB"
    }
]
```

## Testes

```bash
# Para rodar os testes unitários
$ yarn test ou npm run test

# Para teste completo com cobertura
$ yart test:cov ou npm run test:cov

```

## Cobertura

<i> Por se tratar de uma POC, os testes dos outros recursos da aplicação não foram contemplados. </i>

```
 PASS  tests/unit/modules/records/record.controller.test.ts (8.436 s)
 PASS  tests/unit/modules/records/record.service.test.ts (8.648 s)
-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-------------------
All files                |     100 |      100 |     100 |     100 |
 http/enums              |     100 |      100 |     100 |     100 |
  status-code.enum.ts    |     100 |      100 |     100 |     100 |
 records/dtos            |     100 |      100 |     100 |     100 |
  record.dto.ts          |     100 |      100 |     100 |     100 |
 records/implementations |     100 |      100 |     100 |     100 |
  record.controller.ts   |     100 |      100 |     100 |     100 |
  record.sevice.ts       |     100 |      100 |     100 |     100 |
-------------------------|---------|----------|---------|---------|-------------------
```

## Considerações

- Foi aplicado o conceito de Inversão / Injeção de Dependência
- Criação de um Base Repository genérico para chamadas de CRUD para o Firebase, tornando abstrata a implementação
- Foi criado um Base Handler para criação das funções para facilitar a implementação de novas rotas
- Ficaram alguns TODO's:
  - Melhoria e desacoplamento para funções de trigger (ficou na mesma camada do handler)
  - Maior cobertura dos testes unitário para funções compartilhadas
  - Criação de novas rotas de delete / findById / Update (apesar de terem sido aplicados no método SetNewId )
  - Criação de testes e2e, porém, foram criados unitários e de integração
- Como se trata apenas de um conceito, algumas validações de input não foram realizadas. Foi realizada apenas uma validação básica do campo name ser string e obrigatório
