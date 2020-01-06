const execa = require('execa');
const ora = require('ora');
const fs = require('fs');

// read from package.json which port to use for the dev server
const port = JSON.parse(fs.readFileSync('package.json', 'utf8')).devport;

(async () => {
  let spinner = ora({prefixText: ' ', color: 'yellow'});
  try {
    spinner = spinner.start('sort package.json');
    await execa('npx', ['sort-package-json'], {preferLocal: true});
    spinner = spinner.clear()
                     .succeed('package.json sorted');

    console.log(`App running at http://localhost:${port}`);
    await execa.command(`vue-cli-service\ serve --port ${port}`);

  } catch(err) {
    spinner.fail(err.shortMessage);
  } finally {
    spinner.stop();
  }

})();
