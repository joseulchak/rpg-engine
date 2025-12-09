import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return await this.UserRepository.findOne({ where: { email } });
  }
  async findOneById(id: string) {
    return await this.UserRepository.findOne({ where: { id } });
  }
}
