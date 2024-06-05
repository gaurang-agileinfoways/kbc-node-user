import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerService } from 'src/common/logger/logger.service';
import {
  AuthExceptions,
  CustomError,
  TypeExceptions,
} from 'src/common/helpers/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from 'src/common/dto/common.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    private myLogger: LoggerService,
    private configService: ConfigService,
  ) {
    this.myLogger.setContext(UsersService.name);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      // Check duplicate user
      if (await this.getUserByEmail(createUserDto.email)) {
        throw TypeExceptions.UserAlreadyExists();
      }

      // Hash password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(createUserDto.password, salt);
      createUserDto.password = hash;

      await this.userRepo.insert(createUserDto);
      return {};
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  async createInitialUser(): Promise<void> {
    try {
      const user = await this.getUserByEmail(
        this.configService.get('database.initialUser.email'),
      );

      if (user) {
        this.myLogger.customLog('Initial user already loaded.');
      } else {
        const params: CreateUserDto = {
          firstName: this.configService.get('database.initialUser.firstName'),
          lastName: this.configService.get('database.initialUser.lastName'),
          email: this.configService.get('database.initialUser.email'),
          password: '',
        };

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(
          this.configService.get('database.initialUser.password'),
          salt,
        );
        params.password = hash;
        await this.userRepo.insert(params);
        this.myLogger.log('Initial user loaded successfully.');
      }
    } catch (error) {
      this.myLogger.error(error?.message || error);
      throw CustomError.UnknownError(
        error?.message || 'Something went wrong, Please try again later!',
      );
    }
  }

  async login(params: LoginDto): Promise<any> {
    try {
      const user = await this.checkUserStatus(params.email);

      if (!bcrypt.compareSync(params.password, user.password)) {
        throw AuthExceptions.InvalidIdPassword();
      }
      console.log(user);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
      };
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    return await this.userRepo.findOne({ where: { email: email } });
  }

  async checkUserStatus(email: string) {
    try {
      const user = await this.userRepo.findOne({ where: { email: email } });

      if (!user) {
        throw AuthExceptions.AccountNotexist();
      }

      if (!user.isActive) {
        throw AuthExceptions.AccountNotActive();
      }

      return user;
    } catch (error) {
      throw CustomError.UnknownError(
        error?.message || 'Something went wrong, Please try again later!',
      );
    }
  }
}
