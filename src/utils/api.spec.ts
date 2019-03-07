import { ApiQuery, url } from 'utils/api';

describe('url', () => {
  it('assumes that /users is the default path', () => {
    expect(url({})).toEqual('/users/');
  });

  it('returns the ApiQuery path when one is defined', () => {
    const apiQuery: Partial<ApiQuery> = {
      path: 'experiences'
    };
    expect(url(apiQuery)).toEqual('/experiences');
  });

  it('appends one query string if one is defined', () => {
    const apiQuery: Partial<ApiQuery> = {
      queries: [
        { name: 'roger' }
      ]
    };
    expect(url(apiQuery)).toEqual('/users/?name=roger');
  });

  it('appends multiple query strings if more than one is defined', () => {
    const apiQuery: Partial<ApiQuery> = {
      queries: [
        { name: 'luna' },
        { gender: 'female' }
      ]
    };
    expect(url(apiQuery)).toEqual('/users/?name=luna&gender=female');
  });
});
