import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env-schema';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    PlayersModule,
    MongooseModule.forRootAsync({
      useFactory: async (envService: EnvService) => ({
        uri: envService.get('MONGODB_URL'),
      }),
      inject: [EnvService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
