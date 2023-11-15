import {IsNotEmpty, IsOptional} from 'class-validator';

export class RegisterAuthDto {
    @IsOptional()
    firstName: string;

    @IsOptional()
    lastName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    image: string;

    @IsOptional()
    userType: string;
}
