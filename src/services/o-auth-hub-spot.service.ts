import {Client} from '@hubspot/api-client';
import {/* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {Response, RestBindings} from '@loopback/rest';

const GRANT_TYPES = {
  AUTHORIZATION_CODE: 'authorization_code',
  REFRESH_TOKEN: 'refresh_token',
};
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
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
    console.log('RECEIVED ACCESS TOKEN');
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
