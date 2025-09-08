# Votação

## Objetivo

Imagine que você deve criar uma solução web para gerenciar e participar de sessões de votação.

Essa solução deve ser executada na nuvem e promover as seguintes funcionalidades através de uma API REST:

- Cadastrar uma nova pauta
- Abrir uma sessão de votação em uma **pauta** (a sessão de votação deve ficar aberta por um tempo determinado na chamada de abertura ou 1 minuto por *default*)
- Receber votos nas pautas (os votos são apenas 'Sim'/'Não'. Cada usuário é identificado por um id único e pode votar apenas uma vez por pauta)
- Contabilizar os votos e dar o resultado da votação na pauta

Para fins de exercício a solução deve ser construída em Node no backend e Angular 2+ no frontend. Frameworks e bibliotecas são de livre escolha (desde que não infrinja direitos de uso).

É importante que as pautas e os votos sejam persistidos e que não sejam perdidos com o restart da aplicação.

O foco dessa avaliação é a comunicação entre o backend e o frontend. Essa comunicação é feita através de mensagens no formato JSON, onde essas mensagens serão interpretadas pelo cliente para montar as telas onde o usuário vai interagir com o sistema. O formato fica a seu criterio e as telas estão descritas no anexo 1.

## Como proceder

Por favor, realize o FORK desse repositório e implemente sua solução no FORK em seu repositório GitHub, ao final, notifique da conclusão para que possamos analisar o código implementado.

Lembre-se de deixar todas as orientações necessárias para executar o seu código.

## Tarefas bônus

### Tarefa Bônus 1 - Controle de usuários

- Criar cadastro de usuários para votação (apenas CPFs validos)
- Adicionar usuários específicos como admin
- Apenas usuários admin podem acessar alguns recursos
    - Criar pautas
    - Cadastrar usuários votantes

### Tarefa Bônus 2 - Performance

- Imagine que sua aplicação possa ser usada em cenários que existam centenas de milhares de votos. Ela deve se comportar de maneira performática nesses cenários
- Testes de performance são uma boa maneira de garantir e observar como sua aplicação se comporta

### Tarefa Bônus 3 - Versionamento da API

- Como você versionaria a API da sua aplicação? Que estratégia usar?

## Dicas e observações

- Teste bem sua solução, evite bugs;
- Não inicie o teste sem sanar todas as dúvidas;
- Iremos executar a aplicação para testá-la, cuide com qualquer dependência externa e deixe claro caso haja instruções especiais para execução do mesmo;

## Anexo 1

### Introdução

A seguir serão detalhados quais telas são necessárias para a conclusão do desafio, assim como os tipos de campos disponíveis para a interação do usuário.

### Tipo de tela – FORMULARIO

Criar um formulário para cadastro de uma pauta com o tempo de sessão.

### Tipo de tela – SELECAO

Exibir uma lista de pautas para que o usuário acesse e consiga votar.

Apenas pautas com sessão disponíveis devem ser exibidas.

Deve ser possível filtrar uma pauta por **categoria**

### Tipo de tela – VOTACAO

Exibir os dados da pauta e as opções de voto disponíveis.

Ao acessar a votação uma sessão precisa estar aberta para a pauta em questão.

Pautas com sessão expiradas não podem receber votos.

A votação pode ser acessada por qualquer pessoa com link, sendo necessário informar o CFP antes de votar.

### Tipo de tela – DETALHES

Exibir os dados da pauta, quantidade de votos total e se a mesma foi aprovada.

Ao acessar os detalhes deve exibir se a sessão já terminou.

## O que será analisado

- Simplicidade no design da solução (evitar over engineering)
- Organização do código
- Arquitetura do projeto
- Boas práticas de programação (manutenibilidade, legibilidade etc)
- Possíveis bugs
- Tratamento de erros e exceções
- Explicação breve do porquê das escolhas tomadas durante o desenvolvimento da solução
- Uso de testes automatizados e ferramentas de qualidade
- Limpeza do código
- Documentação do código e da API
- Logs da aplicação
- Mensagens e organização dos commits
- Layout responsivo
