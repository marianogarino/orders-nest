import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
  description: string;

  @IsNumber({}, { message: 'La cantidad debe ser un número válido' })
  @Min(1, { message: 'La cantidad mínima permitida es 1' })
  quantity: number;

  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @IsPositive({ message: 'El precio debe ser mayor que 0' })
  unitPrice: number;
}

export class CreateOrderDTO {
  @IsString()
  @IsNotEmpty({ message: 'El cliente no puede estar vacío.' })
  clientName: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'La orden debe tener al menos 1 item.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
