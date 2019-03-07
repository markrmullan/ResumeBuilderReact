import {
  ALPHANUMERIC_OPTIONAL,
  ANYTHING,
  AT_LEAST_ONE_CHARACTER,
  EMAIL,
  EMAIL_REQUIRED
} from 'utils/regex';

describe('regexes', () => {
  it('ANYTHING', () => {
    testRegex(ANYTHING, [
      '',
      'a',
      'valid-email@gmail.com',
      '8',
      'diácritïcs okay',
      'punctuation okay.'
    ]);
  });

  it('ALPHANUMERIC_OPTIONAL', () => {
    testRegex(ALPHANUMERIC_OPTIONAL, [
      '',
      '9',
      'ABC',
      'R2D2'
    ], [
      'diácritics not okay',
      'puncuation not-okay'
    ]);
  });

  it('AT_LEAST_ONE_CHARACTER', () => {
    testRegex(AT_LEAST_ONE_CHARACTER, [
      'a',
      'abc',
      'spaces okay',
      '8',
      'punctuation okay.',
      '...leading punctuation also okay'
    ], [
      ''
    ]);
  });

  it('EMAIL', () => {
    testRegex(EMAIL, [
      '',
      'team@resumebuilder.io',
      'support@google.com'
    ], [
      'teamresumebuilder.io',
      'test'
    ]);
  });

  it('EMAIL_REQUIRED', () => {
    testRegex(EMAIL_REQUIRED, [
      'team@resumebuilder.io',
      'support@google.com'
    ], [
      'teamresumebuilder.io',
      'test',
      ''
    ]);
  });
});

function testRegex(regex: RegExp, validTestCases: string[] = [], invalidTestCases: string[] = []) {
  validTestCases.forEach(validCase => expect(regex.test(validCase)).toBe(true));
  invalidTestCases.forEach(invalidCase => expect(regex.test(invalidCase)).toBe(false));
}
