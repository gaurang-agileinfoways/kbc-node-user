import { Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import {
  RESPONSE_SUCCESS,
  USER_LISTED,
  USER_LOGIN,
  USER_SIGNUP,
} from 'src/common/constants/response.constant';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import {
  GET_ALL_USER,
  GET_BY_ID,
  LOGIN,
  SIGNUP,
} from 'src/common/constants/message-pattern.constant';
import { CommonListDto, IdDto, LoginDto } from 'src/common/dto/common.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage(USER_LISTED)
  @MessagePattern(GET_ALL_USER)
  async getAllUsers(@Body() body: CommonListDto) {
    return await this.usersService.getAllUsers(body);
  }

  // @ResponseMessage(USER_VIEW)
  // @MessagePattern('user_view')
  // async viewUser(@Body() body: IdDto) {
  //   return await this.usersService.viewUser(body);
  // }

  // @ResponseMessage(FILE_UPLOADED)
  // @MessagePattern('user_upload')
  // @UseInterceptors(FileUploadingInterceptor)
  // async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
  //   return this.usersService.uploadImage(file, req);
  // }

  @ResponseMessage(USER_LOGIN)
  @MessagePattern(LOGIN)
  async login(@Body() params: LoginDto): Promise<any> {
    console.log('params: ', params);
    return await this.usersService.login(params);
  }

  @ResponseMessage(USER_SIGNUP)
  @MessagePattern(SIGNUP)
  async signup(@Body() params: CreateUserDto) {
    return await this.usersService.create(params);
  }

  // @ResponseMessage(FORGOT_PASSWORD_REQUESTED)
  // @MessagePattern('user_forgot-password')
  // async forgotPassword(@Body() body: ForgotPasswordDto) {
  //   return await this.usersService.forgotPassword(body);
  // }

  // @ResponseMessage(RESET_PASSWORD)
  // @MessagePattern('user_reset-password')
  // async resetPassword(@Body() body: ResetPasswordDto) {
  //   return await this.usersService.resetPassword(body);
  // }

  // @ResponseMessage(PASSWORD_CHANGED)
  // @MessagePattern('user_change-password')
  // async changePassword(@Body() body: ChangePasswordDto, @Req() request) {
  //   return await this.usersService.changePassword(body, request);
  // }

  // @ResponseMessage(PROFILE_UPDATED)
  // @MessagePattern('user_change-profile')
  // async profileChange(@Body() body: UpdateUserDto, @Req() request) {
  //   return await this.usersService.profileChange(body, request);
  // }

  // @ResponseMessage(PROFILE_VERIFIED)
  // @MessagePattern('user_verify')
  // async verifySignupUser(@Body() body: TokenDto) {
  //   return await this.usersService.verifySignupUser(body);
  // }

  @ResponseMessage(RESPONSE_SUCCESS)
  @MessagePattern(GET_BY_ID)
  async sendVerificationLink(@Body() body: IdDto) {
    return await this.usersService.getUserById(+body._id);
  }
}
