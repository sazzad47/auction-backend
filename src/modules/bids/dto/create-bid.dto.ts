import { IsNotEmpty } from 'class-validator';

export class CreateBidDto {
    @IsNotEmpty()
    itemId: string;

    @IsNotEmpty()
    amount: number;
}
