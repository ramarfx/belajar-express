import { web } from '../src/app/web.js'
import supertest from 'supertest'
import { logger } from '../src/app/logging.js'
import { createTestUser, getTestUser, removeTestUser } from './test-util.js'
import bcrypt from 'bcrypt'

describe('POST /api/users', () => {

  afterEach(async () => {
    await removeTestUser();
  })

  it('should can register new user', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'test',
        password: 'password',
        name: 'test'
      })


    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('test')
    expect(result.body.data.password).toBeUndefined()
  })

  it('should reject if request is invalid', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: '',
        password: '',
        name: ''
      })

    logger.info(result.body)

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject if username already registered', async () => {
    let result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'Test',
        password: 'password',
        name: 'test'
      })


    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('Test')
    expect(result.body.data.name).toBe('test')
    expect(result.body.data.password).toBeUndefined()

    result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'Test',
        password: 'password',
        name: 'test'
      })

    logger.info(result.body)

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })


})

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await createTestUser();
  })

  afterEach(async () => {
    await removeTestUser();
  })


  it('should can login', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'test',
        password: 'password'
      })

    logger.info(result.body)

    expect(result.status).toBe(200)
    expect(result.body.data.token).toBeDefined()
    expect(result.body.data.token).not.toBe('test')
  })

  it('should reject login if request is invalid', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: '',
        password: ''
      })

    logger.info(result.body)

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject login if password is wrong', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'test',
        password: 'salah'
      })

    logger.info(result.body)

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject login if username is wrong', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'salah',
        password: 'salah'
      })

    logger.info(result.body)

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await createTestUser();
  })

  afterEach(async () => {
    await removeTestUser();
  })

  it('shoud can get current user', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('test')
  });

  it('shoud reject if token is invalid', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'salah')

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  });
})

describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await createTestUser();
  })

  afterEach(async () => {
    await removeTestUser();
  })

  it('should can update user', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        name: 'rama',
        password: 'passwordlagi'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('rama')

    const user = await getTestUser()

    expect(await bcrypt.compare('passwordlagi', user.password)).toBe(true)

  });

  it('should can update user name', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        name: 'rama',
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('rama')

  });

  it('should can update user password', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        password: 'passwordlagi',
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('test')

    const user = await getTestUser()

    expect(await bcrypt.compare('passwordlagi', user.password)).toBe(true)

  });

  it('should reject if request is not valid', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'salah')
      .send({

      })

    expect(result.status).toBe(401)
  });
})

describe('DELETE /api/users/logout', () => { 
  beforeEach(async () => {
    await createTestUser();
  })

  afterEach(async () => {
    await removeTestUser();
  })

  it('should can logout', async () => {
    const result = await supertest(web)
      .delete('/api/users/logout')
      .set('Authorization', 'test');

      logger.warn(result.body)

    expect(result.status).toBe(200)
    expect(result.body.data).toBe("OK")

    const user = await getTestUser()
    expect(user.token).toBeNull()
  });

  it('should reject logout if token is invalid', async () => {
    const result = await supertest(web)
      .delete('/api/users/logout')
      .set('Authorization', 'salah');

    expect(result.status).toBe(401)
  });
 })