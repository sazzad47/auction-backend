import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {Constants} from "src/utils/constants";
// import {AdminAuthGuard} from "src/core/guards/admin-auth.guard";
import {UsersService} from "./users.service";
import {CreateUsersDto} from "./dto/create-users.dto";
import {UpdateUsersDto} from "./dto/update-users.dto";

@Controller({path: "users", version: Constants.API_VERSION_1})

export class UsersController {
    constructor(private readonly service: UsersService) {
    }

    @Post()
    // @UseGuards(AdminAuthGuard)
    create(@Body() dto: CreateUsersDto) {
        return this.service.create(dto);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.service.findAll();
    }

    @Get(":id")
    // @UseGuards(AdminAuthGuard)
    findOne(@Param("id") id: string) {
        return this.service.findOne(id);
    }

    @Patch("/:id")
    // @UseGuards(AdminAuthGuard)
    update(@Param("id") id: string, @Body() dto: UpdateUsersDto) {
        return this.service.update(id, dto);
    }

    @Delete(":id")
    // @UseGuards(AdminAuthGuard)
    async remove(@Param("id") id: string) {
        return await this.service.delete(id);
    }
}
