import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Order } from './entities/orders.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class OrdersCleanupJob {
  private readonly logger = new Logger(OrdersCleanupJob.name);

  constructor(@InjectModel(Order) private orderModel: typeof Order) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handle() {
    this.logger.log('Orders cleanup started');

    const retention = Number(process.env.ORDER_RETENTION_MINUTES || 1);
    const cutoff = new Date(Date.now() - retention * 60 * 1000);

    const old_orders = await this.orderModel.findAll({
      attributes: ['id'],
      where: {
        updatedAt: { [Op.lt]: cutoff },
      },
    });

    const old_ids = old_orders.map((o) => o.id);

    if (!old_ids.length) {
      this.logger.log('No orders to be deleted');
      return;
    }

    this.logger.log('Orders ids to be deleted:', old_ids);

    const deleted = await this.orderModel.destroy({
      where: {
        id: { [Op.in]: old_ids },
      },
    });
    this.logger.log('Orders cleanup finished');
  }
}
