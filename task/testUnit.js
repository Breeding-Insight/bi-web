const execa = require('execa');
const ora = require('ora');

(async () => {
  let spinner = ora({prefixText: ' ', color: 'yellow'});
  try {
    spinner = spinner.start('performing unit tests');
    let {stdout} = await execa.command(`vue-cli-service\ test:unit`);
    spinner = spinner.clear()
                     .succeed('unit tests done');

    console.log(stdout);

  } catch(err) {
    spinner.fail('unit testing failed');
    console.log(err.stdout);
  } finally {
    spinner.stop();
  }

})();
