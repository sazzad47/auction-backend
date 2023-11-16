import { IsNotEmpty } from "class-validator";

export class CreateItemDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    startPrice: string;

    @IsNotEmpty()
    startTime: string;

    @IsNotEmpty()
    timeWindow: string;
}
