const axios = require('axios')
const qs = require('qs')
const puppeteer = require('puppeteer');


(async function () {

  try {
    // 要启动的环境ID
    const profileId = '210831162130358725';
    const loginBoxServer = 'http://127.0.0.1:11170'

    //获取启动环境信息
    const startupOptionsResponse = await axios.get(loginBoxServer + '/api/getStartupOptions?profileId=' + profileId)
    const startupOptions = startupOptionsResponse.data.data

    const chromePath = startupOptions.chromeLocation
    //获取指定环境的配置信息
    const profileResponse = await axios.get(loginBoxServer + '/api/profileInfo?profileId=' + profileId)

    const profile = profileResponse.data.data

   
    let browser = await puppeteer.launch({
      headless: false,
      executablePath: chromePath,
      ignoreDefaultArgs: true,
      ignoreHTTPSErrors: true,
      args: [
        '--login-box-id=' + profileId,
        '--user-data-dir=' + startupOptions.userDir,
      ],
      defaultViewport: null
    });


    let page = await browser.newPage();


    if (!profile.model.url) {
      profile.model.url = 'https://www.bing.com'
    }
    await page.goto(profile.model.url, {timeout: 60 * 1000, waitUntil: 'domcontentloaded'})


  } catch (e) {
    console.error(e)
  }

})();