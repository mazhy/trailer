const puppeteer = require('puppeteer')

const base = `https://movie.douban.com/subject/`
const doubanId = '26752088'


const sleep = (time) => {
  return new Promise ( (resolve) => {
    setTimeout(resolve, time);
  })
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(base + doubanId);
  await sleep(3000)

  const result = await page.evaluate(() => {

    let $ = window.$
    let items = $('.related-pic-video')
    if(items.length >= 1 ) {
      const it = $(items[0])
      const link = it.attr('href')
      const cover = it.attr('style').replace('background-image:url(','').replace('?)','')
      return {link,cover}
    }
    return {}
  });

  let video
  if(result.link) {
    await page.goto(result.link)
    await sleep(2000)
    video = await page.evaluate(() => {

      let $ = window.$
      let it = $('source')
      if(it && it.length > 0 ) {
        return it.attr('src')
      }
      return ''
    });
  }

  const data = {
    video,
    doubanId,
    cover: result.cover
  }

  await browser.close();
  process.send(data)
  process.exit(0)
})();