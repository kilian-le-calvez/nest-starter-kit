import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '@prisma-api/prisma.service';
import { AppModule } from '@app/app.module';

async function cleanupExampleUsers(prisma: PrismaService) {
  await prisma.user.deleteMany({
    where: {
      email: { endsWith: '@e2example.com' },
    },
  });
}

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let agent: request.SuperAgentTest;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    await cleanupExampleUsers(prisma);

    agent = request.agent(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  // Auto-cleanup function after each test
  afterEach(async () => {
    await cleanupExampleUsers(prisma);
  });

  it('should register a new user', async () => {
    const response = await agent
      .post('/auth/register')
      .send({ email: 'test@e2example.com', password: 'password123' })
      .expect(201);

    expect(response.body.message).toContain(
      'Your account has been created successfully with email',
    );
  });

  it('should fail to register with existing email', async () => {
    await agent
      .post('/auth/register')
      .send({ email: 'test@e2example.com', password: 'password123' })
      .expect(201);

    const response = await agent
      .post('/auth/register')
      .send({ email: 'test@e2example.com', password: 'password123' })
      .expect(409);

    expect(response.body.message).toBe('Email is already registered');
  });

  it('should login and return a JWT cookie', async () => {
    await agent
      .post('/auth/register')
      .send({ email: 'test@e2example.com', password: 'password123' })
      .expect(201);

    const response = await agent
      .post('/auth/login')
      .send({ email: 'test@e2example.com', password: 'password123' })
      .expect(200);

    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.body.message).toBe('Login successful');
    expect(response.body.jwt).toBeDefined();
  });

  it('should fail to login with incorrect credentials', async () => {
    const response = await agent
      .post('/auth/login')
      .send({ email: 'wrong@e2example.com', password: 'wrongpassword' })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });
});
