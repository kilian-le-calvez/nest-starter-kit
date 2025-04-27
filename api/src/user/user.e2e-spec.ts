import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '@prisma-api/prisma.service';
import { AppModule } from '@app/app.module';

const testUser = {
  email: 'user@e2example.com',
  password: 'password123', // Ensure to hash this or handle properly in real tests
};

async function cleanupExampleUsers(prisma: PrismaService) {
  await prisma.user.deleteMany({
    where: {
      email: { endsWith: '@e2example.com' },
    },
  });
}

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let agent: request.SuperAgentTest;
  let token: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    await cleanupExampleUsers(prisma);

    agent = request.agent(app.getHttpServer());
    await agent.post('/auth/register').send(testUser).expect(201);
    // Perform login and capture the JWT token
    const loginResponse = await agent
      .post('/auth/login')
      .send(testUser)
      .expect(200);

    // Extract the JWT token manually from the response body
    token = loginResponse.body.jwt;
    agent.set('Authorization', `Bearer ${token}`); // Send token in the header
  });

  afterAll(async () => {
    // Clean up any test data after tests are finished
    cleanupExampleUsers(prisma);
    await app.close();
  });

  it('GET /users/me should return the current user details', async () => {
    // Send the token explicitly in the Authorization header
    const response = await agent.get('/users/me').expect(200);

    // Validate the response
    expect(response.body.email).toBe(testUser.email);
  });

  it('GET /users should return all users', async () => {
    const response = await agent.get('/users').expect(200);

    expect(response.body.length).toBeGreaterThan(0); // Assert there’s at least one user
    expect(response.body[0].email).toBe(testUser.email); // Check if the test user is in the list
  });
});
