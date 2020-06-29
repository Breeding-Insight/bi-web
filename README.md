# bi-web
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FBreeding-Insight%2Fbi-web.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FBreeding-Insight%2Fbi-web?ref=badge_shield)


## Project setup
Install all dependencies.
```
npm install
```
Configure git to prepend branch names to commit messages.  Master, develop, and
test branch names are excluded.
```
npm run githooks
```
Set the path to the scripts used for task-running in package.json with the
field"task_path".

### Compiles and hot-reloads for development
```
npm run serve
```
Set the port used by the dev server with the value of the "devport" field in package.json.

### Compiles and minifies for production
```
npm run build
```
At the beginning of the build an audit is performed on the npm modules listed as
dependencies and dev dependencies in package.json.  A message to STDOUT will
notify you if any vulnerabilities are found, and the build will stop.  The
vulnerable packages must be patched, updated, or replaced to pass the audit in
order for the production build to proceed.

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run accessibility test
TL;DR---run "npm run test:accessibility" during dev work but follow up at some
point with manual testing.

To test individual pages for accessibility errors, a JSON file
task/.pa11yTargets.json must be created containing an array of strings that are
the relative paths to the pages to be tested: e.g. "home" or "group/info".

The results of the tests are stored as JSON in the file task/pa11yResults.json.

The test points to http://localhost, so for dev work simply start the dev server
```
npm run serve
```
and run the accessibility tests:
```
npm run test:accessibility
```

Accessibility testing tools are far from perfect.  [One
study](https://alphagov.github.io/accessibility-tool-audit/) found the highest
accuracy among fourteen popular, free testing tools was 40%.  By comparison, the
pa11y tester used here performs well---it detects 47% (67 of 143) of the errors
on the [world's least accessible
site](https://alphagov.github.io/accessibility-tool-audit/test-cases.html) used
in the study.

The authors conclude that tools such as pa11y should be used but do not replace
the need for manual testing.

The Web Accessibility Evaluation Tool([https://wave.webaim.org/](WAVE)) is one
online tool that may be a helpful starting point for manual testing.  WAVE found
115 errors and warnings plus 256 structual element problems.  Obviously there is
some duplication here since the target site has 147 errors, so it's not clear if
it's accuracy is better without evaluating the results.

### Lints and fixes files
```
npm run lint
```

### Dependency Cleanup
List in STDOUT all packages that are unused or need upgrading:
```
npx npm-check
```
or get the same information organized by type with an interactive UI by using the -u option:
```
npx npm-check -u
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Style and layout
A guide to visual design conventions and writing style can be found at `/styleguide` after authentication. 
For example, if you are running the app locally on port 8080, the style guide URL would be [http://localhost:8080/styleguide].


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FBreeding-Insight%2Fbi-web.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FBreeding-Insight%2Fbi-web?ref=badge_large)