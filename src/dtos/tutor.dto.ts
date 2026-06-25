import {
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PetDTO } from './pet.dto';

export class TutorDTO {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(0)
  @Max(99)
  @IsInt()
  age: number;

  @IsOptional()
  @IsArray()
  pets: PetDTO[];
}

export interface Identifier {
  id?: string;
  email?: string;
}
