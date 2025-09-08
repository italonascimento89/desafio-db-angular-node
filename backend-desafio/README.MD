## Node versão
`v20.19.4`

## Docker versão
`Docker version 28.3.3`

## Subir bando de dados com docker
`docker compose up -d`

## Instalar pacotes
`npm install`

## Executar migrate
`npm run migrate`

## Executar aplicação
`npm start`

## Executar testes
`npm test`

## Usuarios cadastrados no sistema
### Admin: `659.652.350-03`
### Votante: `536.833.990-90`

## Arquitetura
```
src/
 ├─ controllers/
 │   ├─ userController.js
 │   ├─ categoriaController.js
 │   ├─ pautaController.js
 │   └─ votoController.js
 ├─ services/
 │   ├─ categoriaService.js
 │   ├─ userService.js
 │   ├─ pautaService.js
 │   └─ votoService.js
 ├─ repositories/
 │   ├─ categoriaRepository.js
 │   ├─ userRepository.js
 │   ├─ pautaRepository.js
 │   └─ votoRepository.js
 ├─ routes/
 │   ├─ categoriaRoutes.js
 │   ├─ userRoutes.js
 │   ├─ pautaRoutes.js
 │   └─ votoRoutes.js
 ├─ models/
 │   ├─ Categoria.js
 │   ├─ User.js
 │   ├─ Pauta.js
 │   └─ Voto.js
```

## Libs utilizada
`dotenv` para utilizar variaveis de ambiente com .env .
`sequelize` ORM para database.
`jest` utilizado para teste unitários.
`babel` utilizado para exports das class.