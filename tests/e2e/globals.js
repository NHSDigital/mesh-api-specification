doc = `
API Management Postman Test Runner
Usage:
  test-runner.js <username> <password> <token_app_url>
  test-runner.js -h | --help
  -h --help  Show this text.
`


const fs = require('fs')
const path = require('path')
const docopt = require('docopt').docopt
const puppeteer = require('puppeteer')

function nhsIdLogin(username, password, login_url, callback) {
  (async () => {
    console.log('Oauth journey on ' + login_url)
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(login_url, { waitUntil: 'networkidle2' })
    await page.click('#start')
    await page.waitForSelector('#idToken1')
    await page.type('#idToken1', username)
    await page.type('#idToken2', password)
    await page.click('#loginButton_0')
    await page.waitForNavigation()

    let credentialsJSON = await page.$eval('body > div > div > pre', e => e.innerText)
    let cred = credentialsJSON.replace(/'/g, '"')
    let c = JSON.parse(cred)

    await browser.close();
    callback(c.access_token)
  })()
}

function writeGlobals(token) {
  let globals = JSON.parse(fs.readFileSync("e2e/globals.json"));
  const tokenGlobal = {
    "key": "token",
    "value": token,
    "enabled": true
  };

  for(let index in globals.values) {
    if (globals.values[index].key === "token") {
      globals.values[index] = tokenGlobal;
    }
  }

  console.log(globals);
  fs.writeFileSync('e2e/globals.json', JSON.stringify(globals));
}

function main(args) {
  nhsIdLogin(
    args['<username>'],
    args['<password>'],
    args['<token_app_url>'],
    writeGlobals,
  )
}

args = docopt(doc)
main(args)
