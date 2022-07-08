import {Client} from '@hubspot/api-client';
import {/* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {Response, RestBindings} from '@loopback/rest';

const GRANT_TYPES = {
  AUTHORIZATION_CODE: 'authorization_code',
  REFRESH_TOKEN: 'refresh_token',
};
const REDIRECT_URI = `http://localhost:3000/oauth-callback`;
const CLIENT_ID = '562ed87b-84eb-429d-8003-36c20a7270b7';
const CLIENT_SECRET = '219dd759-16b4-48a0-be45-b3ad48f720f6';
export let refreshToken = '';
export let accessToken = '';
export let exp: number;

@injectable({scope: BindingScope.TRANSIENT})
export class OAuthHubSpotService {
  constructor(@inject(RestBindings.Http.RESPONSE) private response: Response) {}

  async getAccessToken(code: string) {
    const hubspotClient = new Client();
    const res = await hubspotClient.oauth.tokensApi.createToken(
      GRANT_TYPES.AUTHORIZATION_CODE,
      code,
      REDIRECT_URI,
      CLIENT_ID,
      CLIENT_SECRET,
    );
    console.log(res);
    exp = Date.now() + res.expiresIn * 1000;
    refreshToken = res.refreshToken;
    accessToken = res.accessToken;
  }

  async updateAccessToken() {
    const hubspotClient = new Client();
    const result = await hubspotClient.oauth.tokensApi.createToken(
      GRANT_TYPES.REFRESH_TOKEN,
      undefined,
      undefined,
      CLIENT_ID,
      CLIENT_SECRET,
      refreshToken,
    );
    exp = Date.now() + result.expiresIn * 1000;
    console.log('access token updated');
    accessToken = accessToken;
  }
}
