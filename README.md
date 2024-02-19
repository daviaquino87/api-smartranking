# Smartranking

Sistema de gestão de partidas, pensado para gerar ranks e desafios para jogadores de tenis

obs: Sistema desenvolvido no curso Node.js Microservices: NestJS, RabbitMQ and Cloud Services

![Badge](https://img.shields.io/badge/Smartranking-api-%237159c1?style=for-the-badge&logo=ghost)

<hr>

## 🛠️ Pré-requisitos
* Docker e docker-compose instalados
* Um cluster configurado no mongoDB atlas

## 🎲 Rodando o Backend

### Criar o arquivo .env e copiar as variáveis do .env.example
```=shell
cp ./.env.example ./.env
```
* Pegar a URL de conexão do mongoose

### Rodar aplicação
```=shell
docker-compose up -d 
```

## 📖 Documentação da api

[Documentação](http://localhost:3000/api)

## 👨🏼‍💻 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [Nest.js](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/docs/manual/)
- [Docker](https://docs.docker.com/)

## 🛠️ Observações
* Instalar dependências dentro do container
* A documentação não fica disponível caso a variável de ambiente NODE_ENV esteja como production