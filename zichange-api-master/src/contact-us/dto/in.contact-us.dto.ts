import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { MaxLength } from 'class-validator';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class InContactUsDTO {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiModelProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiModelProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiModelProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiModelProperty()
  message: string;
}