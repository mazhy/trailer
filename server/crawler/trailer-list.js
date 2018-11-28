const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/tag/#/?sort=U&range=7,10&tags=%E7%94%B5%E5%BD%B1`

const sleep = (time) => {
  return new Promise ( (resolve) => {
    setTimeout(resolve, time);
  })
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await sleep(3000)
  await page.waitForSelector('.more');

  for(let i = 0; i < 1; i++ ) {
    await sleep(3000)
    await page.click('.more')
  }

  const result = await page.evaluate(() => {

    let $ = window.$
    let items = $('.list-wp a')
    let links = []
    if(items.length >= 1) {
      items.each( (index, item) => {
        let it = $(item)
        const doubanId = it.find('div').data('id')
        const title = it.find('.title').text()
        const rate = Number(it.find('.rate').text())
        const poster = it.find('img').attr('src').replace('s_ratio','l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }
    return links
  });
  await browser.close();
  process.send({result})
  process.exit(0)
})();