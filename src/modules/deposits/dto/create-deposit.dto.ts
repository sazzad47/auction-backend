import { IsNotEmpty } from "class-validator";

export class CreateDepositDto {
    @IsNotEmpty()
    amount: number;
}
