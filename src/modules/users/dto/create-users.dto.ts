import { IsNotEmpty } from 'class-validator';

export class CreateUsersDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
