import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/orders.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersCleanupJob } from './orders-cleanup.job';

@Module({
  imports: [SequelizeModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersCleanupJob],
})
export class OrdersModule {}
