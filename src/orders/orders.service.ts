import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Order } from './entities/orders.entity';
import { InjectModel } from '@nestjs/sequelize';
import {
  ORDER_STATUS_TRANSITIONS,
  OrderStatus,
} from './entities/orderStatus.enum';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name, { timestamp: true });

  constructor(@InjectModel(Order) private orderModel: typeof Order) {}

  async create(orderData: Partial<Order>): Promise<Order> {
    return this.orderModel.create(orderData);
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll();
  }

  async findOne(id: string): Promise<Order | null> {
    const order = await this.orderModel.findByPk(id);

    if (!order) {
      this.logger.warn(`Orden ${id} no encontrada.`);
      throw new NotFoundException(`Orden ${id} no encontrada.`);
    }

    return order;
  }

  async advanceStatus(id: string): Promise<{ message: string }> {
    const order = await this.orderModel.findByPk(id);

    if (!order) {
      this.logger.warn(`Orden ${id} no encontrada.`);
      throw new NotFoundException(`Orden ${id} no encontrada.`);
    }

    const current_status = order.status;

    const new_status = ORDER_STATUS_TRANSITIONS[current_status];

    if (new_status === OrderStatus.DELIVERED) {
      await this.orderModel.destroy({ where: { id } });

      this.logger.log(`Orden ${id} cambio a ${new_status}, se elimina.`);
      return { message: `Orden ${id} cambio a ${new_status}, ELIMINADA.` };
    }

    order.status = new_status;
    await order.save();

    return {
      message: `Orden ${id} cambio de estado, de ${current_status} a ${new_status}`,
    };
  }
}
