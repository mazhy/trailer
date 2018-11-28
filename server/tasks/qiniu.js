const qiniu = require('qiniu')
const conf = require('../config/index')
const nanoid = require('nanoid')

var mac = new qiniu.auth.digest.Mac(conf.qiniu.AK, conf.qiniu.SK);
var config = new qiniu.conf.Config();
var client = new qiniu.rs.BucketManager(mac, config);

const bucket = conf.qiniu.bucket

const upload = async (resUrl, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(resUrl, bucket, key, (err, respBody, respInfo) => {
      if (err) {
        reject(err)
      } else {
        if (respInfo.statusCode === 200) {
          resolve({ key })
        } else {
          reject(respInfo)
        }
      }
    })
  })
}


;(async () => {
  let movies = [{
    video: 'http://vt1.doubanio.com/201712282244/a97c1e7cd9025478b43ebc222bab892e/view/movie/M/302190491.mp4',
    doubanId: '26739551',
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2506258944.jpg',
    cover: 'https://img1.doubanio.com/img/trailer/medium/2493603388.jpg?'
  }]

  movies.map(async movie => {
    if (movie.video && !movie.key) {
      try {
        console.log('开始传 video')
        let videoData = await upload(movie.video, nanoid() + '.mp4')
        console.log('开始传 cover')
        let coverData = await upload(movie.cover, nanoid() + '.png')
        console.log('开始传 poster')
        let posterData = await upload(movie.poster, nanoid() + '.png')


        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }

        console.log(movie)
      
      } catch (err) {
        console.log(err)
      }
    }
  })
})()