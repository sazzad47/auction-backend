import { IsNotEmpty } from 'class-validator';

export class CreateBidDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    itemId: string;

    @IsNotEmpty()
    amount: number;
}
