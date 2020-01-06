const execa = require('execa');
const ora = require('ora');

(async () => {
  let spinner = ora({prefixText: ' ', color: 'yellow'});
  try {
    spinner = spinner.start('checking for node modules vulnerabilities');
    let {exitCode} = await execa('npm', ['audit']);
    if (exitCode === 0) {
      spinner = spinner.clear()
                       .succeed('no known vulnerabilities in node modules');

      // only build if no vulnerabilities found
      spinner.start('building the Vue app');
      let {stdout} = await execa('vue-cli-service', ['build'], {preferLocal: true});
      spinner = spinner.clear()
                       .succeed('Vue app build finished');
      console.log(stdout);
    }

  } catch(err) {

    // check if the npm audit found one or more vulnerabilities
    if(err.exitCode === 1) {
      spinner = spinner.fail(`build aborted because vulnerabilities found in npm modules
     run 'npm audit' for more information`);
    } else {

      // show short message for all other non-audit exceptions
      spinner.fail(err.shortMessage);
    }
  } finally {
    spinner.stop();
  }

})();
