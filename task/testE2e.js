const execa = require('execa');
const ora = require('ora');

(async () => {
  let spinner = ora({prefixText: ' ', color: 'yellow'});
  try {
    spinner = spinner.start('testing end-to-end');
    let {stdout} = await execa.command(`vue-cli-service\ test:e2e`);
    spinner = spinner.clear()
                     .succeed('end-to-end testing done');

    console.log(stdout);

  } catch(err) {
    spinner.fail('end-to-end testing failed');
    console.log(err.stdout);
  } finally {
    spinner.stop();
  }

})();
