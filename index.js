const axios = require('axios')
const qs = require('qs')
const puppeteer = require('puppeteer');


(async function () {

  try {
    //先获取chrome路径
    const ret = await axios.get('http://127.0.0.1:11170/api/getChromePath')
    const chromePath = ret.data.data
    const profileId = '201123205819682985';//loginBox环境ID
    //获取指定环境的配置信息
    const profileRet = await axios.get('http://127.0.0.1:11170/api/profileInfo?profileId=' + profileId + '&getUserDir=1')

    const profile = profileRet.data.data


    let browser = await puppeteer.launch({
      headless: false,
      executablePath: chromePath,
      ignoreHTTPSErrors: true,
      args: [
        '--login-box-id=' + profileId,
        '--user-data-dir=' + profile.userDir,
      ],
      defaultViewport: { // 设置分辨率
        width: profile.model.screenWidth,
        height: profile.model.screenHeight
      }
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