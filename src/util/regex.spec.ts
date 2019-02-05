import { EMAIL_REQUIRED } from './regex';

describe('regexes', () => {
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
