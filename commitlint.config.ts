import { execSync } from 'child_process'
import * as fg from 'fast-glob'

const getPackages = (packagePath: string) =>
  fg.sync('*', { cwd: packagePath, onlyDirectories: true })

const scopes = [
  ...getPackages('packages'),
  'docs',
  'play',
  'project',
  'core',
  'style',
  'ci',
  'dev',
  'deploy',
  'other',
  'color',
]

const gitStatus = execSync('git status --porcelain || true')
  .toString()
  .trim()
  .split('\n')

const scopeComplete = gitStatus
  .find((r: string) => ~r.indexOf('M packages'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%((\w|-)*)/)?.[1]

const subjectComplete = gitStatus
  .find((r: string) => ~r.indexOf('M packages/components'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%components%%((\w|-)*)/)?.[1]

export default {
  rules: {
    'scope-enum': [2, 'always', scopes],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      1,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    /**
     * Type[scope]: [function] description
     * ^^^^
     */
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'release',
        'style',
        'test',
        'improvement',
      ],
    ],
  },
  prompt: {
    defaultScope: scopeComplete,
    customScopesAlign: !scopeComplete ? 'top' : 'button',
    defaultSubject: subjectComplete && `[${subjectComplete}]`,
    allowCustomIssuePrefixs: false,
    allowEmptIssuePrefixs: false,
  },
}
