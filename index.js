const axios = require('axios')
const qs = require('qs')
const puppeteer = require('puppeteer');


(async function () {

  try {
    // 要启动的环境ID
    const profileId = '210621234929253150';
    const loginBoxServer = 'http://127.0.0.1:11170'

    //获取启动环境信息
    const startupOptionsResponse = await axios.get(loginBoxServer + '/api/getStartupOptions?profileId=' + profileId)
    const startupOptions = startupOptionsResponse.data.data

    const chromePath = startupOptions.chromeLocation
    //获取指定环境的配置信息
    const profileResponse = await axios.get(loginBoxServer + '/api/profileInfo?profileId=' + profileId)

    const profile = profileResponse.data.data


    //脚本启动如果要加载插件，需要指定插件路径
    //const extDir = 'D:\\Project\\chrome-extension\\build'
   
    let browser = await puppeteer.launch({
      headless: false,
      executablePath: chromePath,
      ignoreDefaultArgs: true,
      ignoreHTTPSErrors: true,
      args: [
        '--login-box-id=' + profileId,
        '--user-data-dir=' + startupOptions.userDir,
        //`--disable-extensions-except=${extDir}`,//加载插件取消注释
       // `--load-extension=${extDir}`//加载插件取消注释
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