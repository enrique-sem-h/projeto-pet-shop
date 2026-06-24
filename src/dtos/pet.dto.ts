import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class PetDTO {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(25)
  species: string;

  @IsString()
  @MinLength(3)
  @MaxLength(40)
  breed: string;

  @IsNumber()
  @IsPositive()
  @IsInt()
  age: number;

  @IsUUID()
  tutorId: string;
}
