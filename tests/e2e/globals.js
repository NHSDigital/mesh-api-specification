const fs = require('fs')
const process = require('process')
const puppeteer = require('puppeteer')

async function retry(func, times) {
  let result;
  let success = false;
  let error;

  for (let i = 0; i < times; i++) {
      try {
          result = await func();
          success = true;
          break;
      } catch (e) {
          error = e;
          console.error(e);
      }
  }

  if (!success) {
      throw error;
  }

  return result;
}

async function gotoLogin(browser, login_url) {
  const page = await browser.newPage();
  await page.goto(login_url, { waitUntil: 'networkidle2'});
  await page.waitForSelector('#start');
  await page.click("#start");
  await page.waitForSelector('button[class="btn btn-lg btn-primary btn-block"]', {timeout: 30000});
  await page.click('button[class="btn btn-lg btn-primary btn-block"]');
  return page;
}

function nhsIdLogin(writeGlobals, writeEnvVariables) {
  const apigee_environment = process.env['APIGEE_ENVIRONMENT'];
  const base_url = process.env['BASE_URL'];
  const apikey = process.env['API_KEY'];
  const login_url = process.env['IDP_URL'];


  (async () => {
    console.log('Oauth journey on ' + login_url)

    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_BIN || null,
      args: ['--no-sandbox', '--headless', '--disable-gpu']
    });

    const page = await retry(async () => { return await gotoLogin(browser, login_url); }, 3);

    let credentialsJSON = await page.$eval('body > div > div > pre', e => e.innerText)
    let credentials = credentialsJSON.replace(/'/g, '"')
    let credentialsObject = JSON.parse(credentials)

    await browser.close();

    writeGlobals(credentialsObject.access_token, apikey)
    writeEnvVariables(base_url, apigee_environment)
  })()
}

function writeGlobals(token, apikey) {
  fs.copyFileSync("e2e/local.globals.json", "e2e/deploy.globals.json");

  let globals = JSON.parse(fs.readFileSync("e2e/deploy.globals.json"));

  const tokenGlobal = {
    "key": "token",
    "value": token,
    "enabled": true
  };

  const apikeyGlobal = {
    "key": "apikey",
    "value": apikey,
    "enabled": true
  };

  for(let i = 0; i < globals.values.length; i++) {
    if (globals.values[i].key === "token") {
      globals.values[i] = tokenGlobal;
    }
    if (globals.values[i].key === "apikey") {
      globals.values[i] = apikeyGlobal;
    }
  }

  fs.writeFileSync('e2e/deploy.globals.json', JSON.stringify(globals));
}

function writeEnvVariables(base_url, apigee_environment){
  let envVariables = JSON.parse(fs.readFileSync(`e2e/environments/${apigee_environment}.postman.json`));
  const baseUrl = {
    "key": "base_url",
    "value": base_url,
    "enabled": true
  };
  if (envVariables.values[0].key === "base_url") {
    envVariables.values[0] = baseUrl;
  }
  fs.writeFileSync(`e2e/environments/deploy.${apigee_environment}.postman.json`, JSON.stringify(envVariables));
}

function main() {
  nhsIdLogin(
    writeGlobals,
    writeEnvVariables,
  )
}

main()
