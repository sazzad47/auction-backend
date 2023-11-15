import {IsNotEmpty} from 'class-validator';

export class LoginAuthDto {
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}
