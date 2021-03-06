# @brightspace-hmc/questions

[![NPM version](https://img.shields.io/npm/v/@brightspace-hmc/questions.svg)](https://www.npmjs.org/package/@brightspace-hmc/questions)
[![NPM downloads](https://img.shields.io/npm/dt/@brightspace-hmc/questions.svg)](https://www.npmjs.com/package/@brightspace-hmc/questions)

Question components for use in quizzing and/or surveys. Questions are able to populate/display using hypermedia with the `d2l-questions-question` component regardless of question type, or with custom logic via type-specific presentational components. *Development of these components is ongoing and implemented question types are listed below*.

| Question Type | Answerable | Readonly |
|--|--|--|
| Arithmetic | | |
| Significant Figures | | |
| Fill In the Blanks | | |
| Matching | | |
| [Multiple Choice](./docs/multiple-choice.md) | &check; | &check; |
| [Multi Select](./docs/multi-select.md) | &check; | &check; |
| Multi Short-Answer | | |
| Ordering | | |
| [Short Answer](./docs/short-answer.md) | | &check; |
| [True False](./docs/true-false.md) | &check; | &check; |
| [Written Response](./docs/written-response.md) | | &check; |

Answerable components are interactable, while readonly components are designed for viewing previously answered questions and, depending on question type, may support indicating 'correct' answers.

---
## Installation

Install from NPM:

```shell
npm install @brightspace-hmc/questions
```

## Usage

```html
<script type="module">
    import '@brightspace-hmc/questions/components/d2l-questions-question.js';
</script>
<d2l-questions-question
	question-href=""
	question-response-href=""
	token="">
</d2l-questions-question>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| question-href | String | (required) Hypermedia href to the question |
| question-response-href | String | Hypermedia href to the question response |
| readonly | Boolean | If true, the question is not clickable/answerable |
| token | String | Hypermedia token |

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Linting

```shell
# eslint and lit-analyzer
npm run lint

# eslint only
npm run lint:eslint
```

### Testing

```shell
# lint & run headless unit tests
npm test

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
npm run test:headless:watch
```

### Visual Diff Testing

This repo uses the [@brightspace-ui/visual-diff utility](https://github.com/BrightspaceUI/visual-diff/) to compare current snapshots against a set of golden snapshots stored in source control.

The golden snapshots in source control must be updated by the [visual-diff GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/visual-diff).  If a pull request results in visual differences, a draft pull request with the new goldens will automatically be opened against its branch.

To run the tests locally to help troubleshoot or develop new tests, first install these dependencies:

```shell
npm install @brightspace-ui/visual-diff@X mocha@Y puppeteer@Z  --no-save
```

Replace `X`, `Y` and `Z` with [the current versions](https://github.com/BrightspaceUI/actions/tree/main/visual-diff#current-dependency-versions) the action is using.

Then run the tests:

```shell
# run visual-diff tests
npm run vdiff
# subset of visual-diff tests:
npx mocha './test/**/*.visual-diff.js' -t 10000 -g some-pattern
# update visual-diff goldens
npm run vdiff:goldens
```

### Running the demos

To start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo page and tests:

```shell
npm start
```

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`. Read on for more details...

The [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:
1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:
* Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
* Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
* To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
* Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:
* Update the version in `package.json`
* Tag the commit
* Create a GitHub release (including release notes)
* Deploy a new package to NPM

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:
* `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
* `2.x` for feature releases on top of the `2` release (after version `3` exists)
