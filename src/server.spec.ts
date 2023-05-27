import supertest from 'supertest';

import app from './server';

const request = supertest(app);

describe('Test suite for the home route', () => {
  // Test if the home route is redirecting to the /api route
  it('should redirect to /api', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/api');
  });
});
