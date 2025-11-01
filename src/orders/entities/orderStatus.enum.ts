export enum OrderStatus {
  INITIATED = "initiated",
  SENT = "sent",
  DELIVERED = "delivered",
}

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus | null> =
  {
    [OrderStatus.INITIATED]: OrderStatus.SENT,
    [OrderStatus.SENT]: OrderStatus.DELIVERED,
    [OrderStatus.DELIVERED]: null,
  };
