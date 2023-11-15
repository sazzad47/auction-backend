import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {Constants} from "src/utils/constants";
import {UsersService} from "./users.service";
import {CreateUsersDto} from "./dto/create-users.dto";

@Controller({path: "users", version: Constants.API_VERSION_1})

export class UsersController {
    constructor(private readonly service: UsersService) {
    }

    @Post()
    create(@Body() dto: CreateUsersDto) {
        return this.service.create(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.service.findOne(id);
    }
}
