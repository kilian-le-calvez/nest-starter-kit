import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * The function `register` checks if an email already exists, hashes the password, and creates a new
   * user in a TypeScript application.
   * @param {RegisterDto} data - The `register` function takes a parameter `data` of type `RegisterDto`.
   * This parameter likely contains information needed to register a new user, such as email and
   * password. The function first checks if the provided email already exists in the database. If the
   * email is not found, it hashes the password
   * @returns The `register` function returns the email of the user that was successfully registered.
   */
  async register(data: RegisterDto): Promise<string> {
    // 1. Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // 2. Hash password and create user
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { email: data.email, password: hashed },
    });

    return user.email;
  }

  /**
   * The login function in TypeScript checks the user's credentials and returns a signed token if they
   * are valid.
   * @param {LoginDto} data - The `data` parameter in the `login` function is of type `LoginDto`, which
   * likely contains the user's email and password for authentication.
   * @returns The `login` method is returning a Promise that resolves to a string. The string being
   * returned is the result of calling `this.signToken(user.id, user.email)`.
   */
  async login(data: LoginDto): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signToken(user.id, user.email);
  }

  /**
   * The function `signToken` generates a JWT token with a payload containing the user ID and email.
   * @param {number} userId - The `userId` parameter is a number that represents the unique identifier of
   * a user.
   * @param {string} email - The `email` parameter is a string that represents the email address of the
   * user for whom the token is being signed.
   * @returns A JSON Web Token (JWT) is being returned.
   */
  private signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return this.jwt.sign(payload);
  }
}
