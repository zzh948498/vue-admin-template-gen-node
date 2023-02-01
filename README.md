<p align="center">
  <a href="https://zerone.top/" target="blank"><img src="https://zerone.top/images/logo/logo3.gif" width="320" alt="Nest Logo" /></a>
</p>

前端项目地址[https://github.com/zzh948498/vue-admin-template-gen](https://github.com/zzh948498/vue-admin-template-gen)


## Installation

```bash
$ pnpm i
```

## Database
`/src/app.module.ts`
```ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
```

## Running the app

```bash
# development
$ pnpm dev

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Zerone is [MIT licensed](LICENSE).
