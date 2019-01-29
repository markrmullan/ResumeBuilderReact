import { ApiQuery, url } from './api';

describe('url', () => {
  it('returns the ApiQuery path when one is defined', () => {
    const apiQuery: Partial<ApiQuery> = {
      path: 'experiences'
    };
    expect(url(apiQuery)).toEqual('/experiences');
  });

  it('returns the default base resource path when an ApiQuery does not declare a path', () => {
    expect(url({})).toEqual('/users/current');
  });

  it('appends one query string if one is defined', () => {
    const apiQuery: Partial<ApiQuery> = {
      queries: [
        { name: 'roger' }
      ]
    };
    expect(url(apiQuery)).toEqual('/users/current?name=roger');
  });

  it('appends multiple query strings if more than one is defined', () => {
    const apiQuery: Partial<ApiQuery> = {
      queries: [
        { name: 'luna' },
        { gender: 'female' }
      ]
    };
    expect(url(apiQuery)).toEqual('/users/current?name=luna&gender=female');
  });
});
