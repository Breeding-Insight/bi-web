const execa = require('execa');
const ora = require('ora');

(async () => {
  let spinner = ora({prefixText: ' ', color: 'yellow'});
  try {
    spinner = spinner.start('linting');
    let {exitCode, stdout} = await execa('vue-cli-service', ['lint']);
    if (exitCode === 0) {
      spinner = spinner.clear()
                       .succeed('linting finished');
      console.log(stdout);
    }

  } catch(err) {
    spinner = spinner.fail('lint ' + err.stdout);
  } finally {
    spinner.stop();
  }

})();
