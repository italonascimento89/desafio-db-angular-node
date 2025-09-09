# Desafio Votação — Backend Node.js

## Visão Geral

Este projeto representa o backend da aplicação de votação, desenvolvido em Node.js com arquitetura modular e suporte a ES Modules. Ele é responsável por gerenciar as regras de negócio, persistência de dados e comunicação com o frontend via API REST.

A aplicação permite o cadastro de pautas, abertura de sessões de votação, registro de votos por CPF único e apuração dos resultados. Toda a comunicação é feita em formato JSON, e a documentação da API está disponível via Swagger.

---

## Tecnologias Utilizadas

- Node.js (versões compatíveis: ^18.19.1, ^20.11.1 ou ^22.0.0)
- Express para gerenciamento de rotas e middlewares
- Sequelize como ORM para PostgreSQL
- dotenv para gerenciamento de variáveis de ambiente
- Swagger para documentação da API
- Jest e Supertest para testes automatizados
- Babel para suporte a ES Modules e transpilação

---

## Instalação e Execução

Antes de iniciar, certifique-se de que você possui uma versão compatível do Node.js instalada em sua máquina.

Para executar o projeto localmente, siga os seguintes passos:

1. Faça o clone do repositório em sua máquina.
2. Acesse o diretório correspondente ao backend.
3. Execute o Docker Compose

```bash
docker-compose up -d
```

4. Instale todas as dependências utilizando o gerenciador de pacotes

```bash
npm install
```

5. Execute o comando de migração para criar as tabelas no banco de dados utilizando o comando: npm run migrate

```bash
 npm run migrate
```

6. Inicie o servidor da aplicação

```bash
 npm start
```

## Endpoints da API

Após iniciar o servidor backend, você verá no console:

API rodando em http://localhost:3000  
Swagger disponível em http://localhost:3000/api-docs

## Testes Automatizados

O backend inclui testes automatizados que validam regras de negócio, rotas e integrações com o banco de dados. Os testes foram escritos com Jest e Supertest.

Para executar os testes, utilize o comando de teste padrão definido no projeto. Basta rodar "npm run test" no terminal. Isso iniciará o ambiente de testes e exibirá os resultados diretamente no console.

Os testes cobrem cenários como:

- Cadastro e listagem de pautas
- Abertura e encerramento de sessões de votação
- Registro de votos com validação de CPF e unicidade
- Apuração e retorno do resultado da votação

Executar testes:

```bash
npm run test
```

---

## Endpoints Principais

A API REST expõe os seguintes recursos:

- Cadastro de pauta
- Abertura de sessão de votação
- Registro de voto (Sim/Não)
- Consulta de resultado da pauta
- Listagem de pautas com sessões abertas

Todos os endpoints aceitam e retornam dados em formato JSON. A documentação completa está disponível via Swagger na rota padrão `/api-docs`.

---

## Boas Práticas Adotadas

- Separação clara entre camadas de controller, service e repository
- Tratamento de erros centralizado
- Uso de UUID para identificação única de registros
- Persistência segura e durável dos dados com Sequelize
- Testes automatizados com cobertura mínima recomendada
- Documentação da API gerada automaticamente com Swagger

---

## Usuários Cadastrados no Sistema

O sistema já está pré-configurado com dois usuários para fins de teste e validação das funcionalidades:

### Admin  
CPF: `659.652.350-03`  
Este usuário possui permissões administrativas, como criação de pautas e abertura de sessões de votação.

### Votante  
CPF: `536.833.990-90`  
Este usuário pode participar das votações, registrando seu voto em pautas abertas.

Esses CPFs podem ser utilizados diretamente nas requisições para simular os fluxos de votação e administração.

