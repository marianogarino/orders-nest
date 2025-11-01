import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersService } from './orders.service';
import { Order } from './entities/orders.entity';
import { OrderStatus } from './entities/orderStatus.enum';

describe('OrdersService', () => {
  let moduleRef: TestingModule;
  let service: OrdersService;
  let order_id: string | undefined = undefined;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          autoLoadModels: true,
          synchronize: true,
          logging: false,
        }),
        SequelizeModule.forFeature([Order]),
      ],
      providers: [OrdersService],
    }).compile();

    service = moduleRef.get(OrdersService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('Crear una orden con items y status por defecto (initiated)', async () => {
    const dto = {
      clientName: 'Ana Lopez',
      items: [
        { description: 'Ceviche', quantity: 2, unitPrice: 50 },
        { description: 'Chicha morada', quantity: 1, unitPrice: 10 },
      ],
    };

    const order = await service.create(dto as any);

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
    expect(order.items).toHaveLength(2);
    expect(order.status).toBe(OrderStatus.INITIATED);

    order_id = order.id;
  });

  it('Crear una orden con items y status por defecto (initiated)', async () => {
    const dto = {
      clientName: 'Ana Perez',
      items: [
        { description: 'Naranjas', quantity: 2, unitPrice: 50 },
        { description: 'Manzanas', quantity: 1, unitPrice: 10 },
      ],
    };

    const order = await service.create(dto as any);

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
    expect(order.items).toHaveLength(2);
    expect(order.status).toBe(OrderStatus.INITIATED);
  });

  it('Encontrar 2 ordenes', async () => {
    const orders = await service.findAll();

    expect(Array.isArray(orders)).toBe(true);
    expect(orders).toHaveLength(2);
    expect(orders[0]).toHaveProperty('id');
    expect(orders[1]).toHaveProperty('items');
  });

  it('Encontrar una orden por id', async () => {
    const order = await service.findOne(order_id);

    expect(order).toBeDefined();
    //expect(order.items).toHaveLength(2);
    expect(order.status).toBe(OrderStatus.INITIATED);
  });

  it("Avanzar al estado 'sent'", async () => {
    await service.advanceStatus(order_id);

    let found = await service.findOne(order_id);

    //expect(order.items).toHaveLength(2);
    expect(found.status).toBe(OrderStatus.SENT);
  });

  it("Avanzar al estado 'delivered' y no existir mas", async () => {
    const resp = await service.advanceStatus(order_id);
    expect(resp.message).toContain('ELIMINADA');
  });
});
