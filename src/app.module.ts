import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/orders.entity';
import { CacheModule } from '@nestjs/cache-manager';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { ScheduleModule } from '@nestjs/schedule';
import { OrdersCleanupJob } from './orders/orders-cleanup.job';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      autoLoadModels: true,
      synchronize: true,
      sync: { alter: true },
      models: [Order],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL', 'redis://redis:6379');
        const defaultTtlMs = Number(
          config.get<string>('REDIS_CACHE_TTL_SECONDS') ?? '60000',
        );
        const store = new Keyv({ store: new KeyvRedis(redisUrl) });

        return {
          stores: [store],
          ttl: defaultTtlMs, // milisegundos
        };
      },
    }),
    OrdersModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
