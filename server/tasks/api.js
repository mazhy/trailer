const rp = require('request-promise-native')

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
  const res = await rp(url)
  return res
}

;(async () => {
  let movies = [
    {
      doubanId: 3914513,
      title: '马戏之王',
      rate: 7.3,
      poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2497576479.jpg'
    },
    {
      doubanId: 27593529,
      title: '绅士联盟',
      rate: 9.3,
      poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2508069159.jpg'
    }
  ]

  movies.map(async item => {
    let data = await fetchMovie(item)

    try{
      data = JSON.parse(data)
      console.log(data.title)
      console.log(data.summary)
    }catch (err) {
      console.log(err)
    }
  })

})()