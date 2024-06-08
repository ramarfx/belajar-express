import { web } from '../src/app/web.js'
import { prismaClient } from '../src/app/database.js'
import supertest from 'supertest'

describe('POST /api/users', () => {

    afterEach(async () => {
      await prismaClient.user.deleteMany({
        where: {
            username: 'rama'
        }
      })
    })

  it('should can register new user', async () => {
    const result = await supertest(web)
                .post('/api/users')
                .send({
                    username: 'Rama',
                    password: 'password',
                    name: 'ramadina al muzthazam'
                })
              
        
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe('Rama')
        expect(result.body.data.name).toBe('ramadina al muzthazam')
        expect(result.body.data.password).toBeUndefined()
  } )
})