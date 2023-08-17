import entityManager, { EntityManager, WP } from "../src"
import { AuthTypeEnum } from "../src/EntityManager/EntityManager"

describe('auth', () => {
  test('apikey env', async () => {
    const em = new EntityManager({
      authType: AuthTypeEnum.APIKEY,      
    })
    const wp = await em.findOrFail<WP>(WP, 1)
    expect(wp.id).toBe(1);
  })

  test('apikey custom', async () => {
    const em = new EntityManager({
      authType: AuthTypeEnum.APIKEY, 
      apiKeyOptions: {
        getApiKey: () => {return process.env.OP_API_KEY}
      }     
    })
    const wp = await em.findOrFail<WP>(WP, 1)
    expect(wp.id).toBe(1);
  })

  test('oauth', async () => {
    const em = new EntityManager({
      authType: AuthTypeEnum.OAUTH, 
      oauthOptions: {
        clientId: process.env.OP_CLIENT_ID,
        clientSecret: process.env.OP_CLIENT_SECRET
      }   
    })
    const wp = await em.findOrFail<WP>(WP, 1)
    expect(wp.id).toBe(1);
  })

  test('env ', async () => {   
    const wp = await entityManager.findOrFail<WP>(WP, 1)
    expect(wp.id).toBe(1);
  })

})
