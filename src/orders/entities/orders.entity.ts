import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from "sequelize-typescript";
import { OrderStatus } from "./orderStatus.enum";

@Table({
  tableName: "orders",
  timestamps: true,
})
export class Order extends Model<Order> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  clientName: string;

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
    allowNull: false,
  })
  items: Record<string, any>[];

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
    defaultValue: OrderStatus.INITIATED,
  })
  status: OrderStatus;
}
