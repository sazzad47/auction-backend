import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateItemDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    startPrice: number;

    @IsNotEmpty()
    startTime: string;

    @IsNotEmpty()
    endTime: string;

    @IsOptional()
    sold?: boolean
}
