# Desafio Votação — Frontend Angular

## Visão Geral

Este projeto representa o frontend da aplicação de votação, desenvolvida em Angular 19+, com foco na comunicação eficiente com o backend via API REST. O objetivo é permitir que usuários visualizem pautas, participem de sessões de votação e acompanhem os resultados em tempo real.

A interface foi construída com foco em responsividade, clareza na navegação e boas práticas de desenvolvimento Angular.

---

## Tecnologias Utilizadas

- Angular 19.2+
- RxJS 7.8
- Bootstrap 5.3 + Bootstrap Icons
- Ngx-Toastr (notificações)
- Ngx-Mask (formatação de campos)
- Karma + Jasmine (testes unitários)

---

## Instalação e Execução

Antes de iniciar, certifique-se de que você possui as versões corretas das ferramentas necessárias:

- Angular CLI na versão 19.2.x
- Node.js em uma das seguintes versões compatíveis: ^18.19.1, ^20.11.1 ou ^22.0.0

### Passos para execução

1. Faça o clone do repositório em sua máquina local.
2. Acesse o diretório do projeto referente ao frontend.
3. Instale as dependências utilizando o gerenciador de pacotes com utilizando o comando: npm install
4. Inicie o servidor de desenvolvimento utilizando o comando: npm start
5. A aplicação estará disponível em `http://localhost:4200`.

---

## Testes Automatizados

A aplicação inclui testes unitários que validam regras de negócio, componentes críticos e validações de formulários. Os testes foram escritos com Jasmine e são executados via Karma.

Ao rodar os testes, será gerado automaticamente um relatório de cobertura na pasta `coverage`, permitindo visualizar quais partes do código estão devidamente testadas.

Para executar os testes unitários com relatório de cobertura, utilize o comando: npm run test


## Telas Implementadas

### Formulário de Pauta

Permite o cadastro de uma nova pauta, incluindo título, descrição e tempo de duração da sessão. Inclui validação de campos obrigatórios e máscara de tempo.

### Lista de Pautas

Exibe todas as pautas com sessões abertas. Permite filtragem por categoria e acesso direto à tela de votação.

### Tela de Votação

Exibe os dados da pauta e permite que o usuário vote com as opções "Sim" ou "Não". A votação exige a inserção de um CPF válido e só é permitida durante sessões ativas.

### Tela de Detalhes

Apresenta o resultado da votação, total de votos por opção e status da sessão (ativa ou encerrada).

---

## Boas Práticas Adotadas

- Componentização e modularização de telas e funcionalidades
- Uso de serviços Angular para comunicação com a API
- Validação de formulários com Reactive Forms e máscaras de entrada
- Feedback visual com notificações via ngx-toastr
- Layout responsivo utilizando Bootstrap 5
- Organização de módulos para escalabilidade
- Testes automatizados com cobertura mínima recomendada

---

