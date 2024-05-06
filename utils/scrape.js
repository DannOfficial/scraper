/**
* DannTeam
* ig: @neverdanzyy
*/

const axios = require("axios")
const cheerio = require("cheerio")
const fetch = require("node-fetch")
const FormData = require("form-data")
const ytdl = require("ytdl-core")
const yts = require("yt-search")

// Settings
global.creator = "@superdanzyyy"

// Scraper (all)
async function tiktoks(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux Android 10 K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: {
          keywords: query,
          count: 10,
          cursor: 0,
          HD: 1
        }
      })
      const videos = response.data.data.videos
      if (videos.length === 0) {
        reject("Tidak ada video ditemukan.")
      } else {
        const dann = Math.floor(Math.random() * videos.length)
        const videorndm = videos[dann]

        const result = {
          author: creator,
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_watermark: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
        }
        resolve(result)
      }
    } catch (error) {
      reject(error)
    }
  })
}

async function igdl(url) {
  let res = await axios("https://indown.io/")
  let _$ = cheerio.load(res.data)
  let referer = _$("input[name=referer]").val()
  let locale = _$("input[name=locale]").val()
  let _token = _$("input[name=_token]").val()
  let {
    data
  } = await axios.post(
    "https://indown.io/download",
    new URLSearchParams({
      link: url,
      referer,
      locale,
      _token,
    }),
    {
      headers: {
        cookie: res.headers["set-cookie"].join(" "),
      },
    }
  )
  let $ = cheerio.load(data)
  let result = []
  let __$ = cheerio.load($("#result").html())
  __$("video").each(function () {
    let $$ = $(this)
    result.push({
      author: creator,
      type: "video",
      thumbnail: $$.attr("poster"),
      url: $$.find("source").attr("src"),
    })
  })
  __$("img").each(function () {
    let $$ = $(this)
    result.push({
      author: creator,
      type: "image",
      url: $$.attr("src"),
    })
  })

  return result
}

function ssweb(url, device) {
  return new Promise((resolve, reject) => {
    const baseURL = 'https://www.screenshotmachine.com'
    const param = {
      url: url,
      device: device,
      cacheLimit: 0
    }
    axios({
      url: baseURL + '/capture.php',
      method: 'POST',
      data: new URLSearchParams(Object.entries(param)),
      headers: {
        'content-type': 'application/x-www-form-urlencoded charset=UTF-8'
      }
    }).then((data) => {
      const cookies = data.headers['set-cookie']
      if (data.data.status == 'success') {
        axios.get(baseURL + '/' + data.data.link, {
          headers: {
            'cookie': cookies.join('')
          },
          responseType: 'arraybuffer'
        }).then(({
            data
          }) => {
          resolve(data)
        })
      } else {
        reject()
      }
    }).catch(reject)
  })
}

function styleText(text) {
  return new Promise((resolve,
    reject) => {
    axios.get('http://qaz.wtf/u/convert.cgi?text=' + text)
    .then(({
      data
    }) => {
      let $ = cheerio.load(data)
      let result = []
      $('table > tbody > tr').each(function (a, b) {
        result.push({
          author: creator,
          text: $(b).find('td:nth-child(2)').text().trim()
        })
      }),
      resolve(result)
    })
  })
}

async function ytmp3(url) {
  return new Promise((resolve,
    reject) => {
    try {
      const id = yt.getVideoID(url)
      const yutub = yt.getInfo(`https://www.youtube.com/watch?v=${id}`)
      .then((data) => {
        let pormat = data.formats
        let audio = []
        for (let i = 0 i < pormat.length i++) {
          if (pormat[i].mimeType == 'audio/webm codecs=\"opus\"') {
            let aud = pormat[i]
            audio.push(aud.url)
          }
        }
        const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
        const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
        const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
        const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
        const published = data.player_response.microformat.playerMicroformatRenderer.publishDate

        const result = {
          author: creator,
          title: title,
          thumb: thumb,
          channel: channel,
          published: published,
          views: views,
          url: audio[0]
        }
        return(result)
      })
      resolve(yutub)
    } catch (error) {
      reject(error)
    }
    console.log(error)
  })
}

async function ytmp4(url) {
  return new Promise((resolve,
    reject) => {
    try {
      const id = yt.getVideoID(url)
      const yutub = yt.getInfo(`https://www.youtube.com/watch?v=${id}`)
      .then((data) => {
        let pormat = data.formats
        let video = []
        for (let i = 0 i < pormat.length i++) {
          if (pormat[i].container == 'mp4' && pormat[i].hasVideo == true && pormat[i].hasAudio == true) {
            let vid = pormat[i]
            video.push(vid.url)
          }
        }
        const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
        const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
        const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
        const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
        const published = data.player_response.microformat.playerMicroformatRenderer.publishDate

        const result = {
          author: creator,
          title: title,
          thumb: thumb,
          channel: channel,
          published: published,
          views: views,
          url: video[0]
        }
        return(result)
      })
      resolve(yutub)
    } catch (error) {
      reject(error)
    }
    console.log(error)
  })
}

async function play(query) {
  return new Promise((resolve,
    reject) => {
    try {
      const search = yts(query)
      .then((data) => {
        const url = []
        const pormat = data.all
        for (let i = 0 i < pormat.length i++) {
          if (pormat[i].type == 'video') {
            let dapet = pormat[i]
            url.push(dapet.url)
          }
        }
        const id = yt.getVideoID(url[0])
        const yutub = yt.getInfo(`https://www.youtube.com/watch?v=${id}`)
        .then((data) => {
          let pormat = data.formats
          let audio = []
          let video = []
          for (let i = 0 i < pormat.length i++) {
            if (pormat[i].mimeType == 'audio/webm codecs=\"opus\"') {
              let aud = pormat[i]
              audio.push(aud.url)
            }
          }
          const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
          const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
          const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
          const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
          const published = data.player_response.microformat.playerMicroformatRenderer.publishDate
          const result = {
            author: creator,
            title: title,
            thumb: thumb,
            channel: channel,
            published: published,
            views: views,
            url: audio[0]
          }
          return(result)
        })
        return(yutub)
      })
      resolve(search)
    } catch (error) {
      reject(error)
    }
    console.log(error)
  })
}

async function playaudio(query) {
  return new Promise((resolve, reject) => {
    try {
      const search = yts(query)
      .then((data) => {
        const url = []
        const pormat = data.all
        for (let i = 0 i < pormat.length i++) {
          if (pormat[i].type == 'video') {
            let dapet = pormat[i]
            url.push(dapet.url)
          }
        }
        const id = yt.getVideoID(url[0])
        const yutub = yt.getInfo(`https://www.youtube.com/watch?v=${id}`)
        .then((data) => {
          let pormat = data.formats
          let audio = []
          let video = []
          for (let i = 0 i < pormat.length i++) {
            if (pormat[i].mimeType == 'audio/webm codecs=\"opus\"') {
              let aud = pormat[i]
              audio.push(aud.url)
            }
          }
          const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
          const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
          const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
          const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
          const published = data.player_response.microformat.playerMicroformatRenderer.publishDate
          const result = {
            author: creator,
            title: title,
            thumb: thumb,
            channel: channel,
            published: published,
            views: views,
            url: audio[0]
          }
          return(result)
        })
        return(yutub)
      })
      resolve(search)
    } catch (error) {
      reject(error)
    }
    console.log(error)
  })
}

async function playvideo(query) {
  return new Promise((resolve, reject) => {
    try {
      const search = yts(query)
      .then((data) => {
        const url = []
        const pormat = data.all
        for (let i = 0 i < pormat.length i++) {
          if (pormat[i].type == 'video') {
            let dapet = pormat[i]
            url.push(dapet.url)
          }
        }
        const id = yt.getVideoID(url[0])
        const yutub = yt.getInfo(`https://www.youtube.com/watch?v=${id}`)
        .then((data) => {
          let pormat = data.formats
          let video = []
          for (let i = 0 i < pormat.length i++) {
            if (pormat[i].container == 'mp4' && pormat[i].hasVideo == true && pormat[i].hasAudio == true) {
              let vid = pormat[i]
              video.push(vid.url)
            }
          }
          const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
          const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
          const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
          const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
          const published = data.player_response.microformat.playerMicroformatRenderer.publishDate
          const result = {
            author: creator,
            title: title,
            thumb: thumb,
            channel: channel,
            published: published,
            views: views,
            url: video[0]
          }
          return(result)
        })
        return(yutub)
      })
      resolve(search)
    } catch (error) {
      reject(error)
    }
    console.log(error)
  })
}

async function search(query) {
  return new Promise((resolve, reject) => {
    try {
      const cari = yts(query)
      .then((data) => {
        res = data.all
        return res
      })
      resolve(cari)
    } catch (error) {
      reject(error)
    }
    console.log(error)
  })
}

const clean = e => (e = e.replace(/(<br?\s?\/>)/gi, " \n")).replace(/(<([^>] )>)/gi, "")

async function shortener(e) {
  return e
}

async function tiktok(url) {
  return new Promise(async (resolve, reject) => {
    try {
      let t = await axios("https://lovetik.com/api/ajax/search", {
        method: "post", data: new URLSearchParams(Object.entries({
          query: url
        }))
      })

      const result = {}
      result.developer = creator
      result.title = clean(t.data.desc)
      result.author = clean(t.data.author)
      result.nowm = await shortener((t.data.links[0].a || "").replace("https",
        "http"))
      result.watermark = await shortener((t.data.links[1].a || "").replace("https",
        "http"))
      result.audio = await shortener((t.data.links[2].a || "").replace("https",
        "http"))
      result.thumbnail = await shortener(t.data.cover)

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

async function fbdl(url) {
  return new Promise((resolve, reject) => {
    axios("https://getmyfb.com/process", {
      headers: {
        "cookie": "PHPSESSID=mtkljtmk74aiej5h6d846gjbo4 __cflb=04dToeZfC9vebXjRcJCMjjSQh5PprejufZXs2vHCt5 _token=K5Qobnj4QvoYKeLCW6uk"
      },
      data: {
        id: url,
        locale: "en"
      },
      "method": "POST"
    }).then(res => {
      let $ = cheerio.load(res.data)
      let result =
      result.author = creator
      result.caption = $("div.results-item-text").eq(0).text().trim()
      result.thumb = $(".results-item-image-wrapper img").attr("src")
      result.result = $("a").attr("href")
      resolve(result)
    })
  })
}

function tebakgambar() {
  return new Promise(async(resolve, reject) => {
    axios.get('https://jawabantebakgambar.net/all-answers/')
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const result = []
      let random = Math.floor(Math.random() * 2836) + 2
      let link2 = 'https://jawabantebakgambar.net'
      $(`#images > li:nth-child(${random}) > a`).each(function(a, b) {
        const img = link2 + $(b).find('img').attr('data-src')
        const jwb = $(b).find('img').attr('alt')
        result.push({
          author: creator,
          image: img,
          jawaban: jwb
        })

        resolve(result)
      })
    })
    .catch(reject)
  })
}

function komiku(judul) {
  return new Promise(async(resolve, reject) => {
    axios.get('https://data3.komiku.id/cari/?post_type=manga&s=' + encodeURIComponent(judul))
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const img = []
      const or = []
      const ind = []
      const up = []
      const des = []
      const li = []
      const ch = []
      const ch1 = []
      $('div.daftar').each(function (a, b) {
        img.push($(b).find('img').attr('data-src'))
        $('div.kan').each(function(c, d) {
          or.push($(d).find('h3').text().trim())
          ind.push($(d).find('span.judul2').text())
          li.push('https://komiku.id' + $(d).find('a').attr('href'))
          up.push($(d).find('p').text().trim().split('. ')[0])
          des.push($(d).find('p').text().trim().split('. ')[1])
          ch1.push($(d).find('div:nth-child(5) > a').attr('title'))
          $('div.new1').each(function(e, f) {
            ch.push($(f).find('a').attr('title'))
          })
        })
      })
      for (let i = 0 i < img.length i++) {
        resolve({
          author: creator,
          image: img[i],
          title: or[i],
          indo: ind[i],
          update: up[i],
          desc: des[i],
          chapter_awal: ch[i],
          chapter_akhir: ch1[i],
          link: li[i]
        })
      }
    })
    .catch(reject)
  })
}

function linkwa(nama) {
  return new Promise((resolve,
    reject) => {
    axios.get('http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search='+ nama +'&searchby=name')
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const result = []
      const lnk = []
      const nm = []
      $('div.wa-chat-title-container').each(function(a, b) {
        const limk = $(b).find('a').attr('href')
        lnk.push(limk)
      })
      $('div.wa-chat-title-text').each(function(c, d) {
        const name = $(d).text()
        nm.push(name)
      })
      for (let i = 0 i < lnk.length i++) {
        result.push({
          author: creator,
          nama: nm[i].split('. ')[1],
          link: lnk[i].split('?')[0]
        })
      }
      resolve(result)
    })
    .catch(reject)
  })
}

function WattPad(judul) {
  return new Promise((resolve,
    reject) => {
    axios.get('https://www.wattpad.com/search/' + judul)
    .then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const result = []
      const jdl = []
      const img = []
      const des = []
      const lnk = []
      const red = []
      const vt = []
      const limk = 'https://www.wattpad.com/'
      $('div.cover.cover-xs.pull-left').each(function(a, b) {
        img.push($(b).find('img').attr('src'))
      })
      $('div.content > h5').each(function(a, b) {
        jdl.push($(b).text().trim())
      })
      $('div.content > p').each(function(a, b) {
        des.push($(b).text().trim())
      })
      $('#results-stories > div > ul > li').each(function(a, b) {
        lnk.push(limk + $(b).find('a.on-result').attr('data-id'))
      })
      $('div.content > div > small.reads').each(function(a, b) {
        red.push($(b).text())
      })
      $('div.content > div > small.votes').each(function(a, b) {
        vt.push($(b).text())
      })
      for (let i = 0 i < lnk.length i++) {
        result.push({
          author: creator,
          judul: jdl[i],
          desc: des[i],
          vote: vt[i],
          reads: red[i],
          image: img[i],
          link: lnk[i]
        })
        resolve(result)
      }
    })
    .catch({
      message: 'err'
    })
  })
}

function BukaLapak(search) {
  return new Promise(async (resolve,
    reject) => {
    try {
      const {
        data
      } = await axios.get(`https://www.bukalapak.com/products?from=omnisearch&from_keyword_history=false&search[keywords]=${search}&search_source=omnisearch_keyword&source=navbar`,
        {
          headers: {
            "user-agent": 'Mozilla/ 5.0(Windows NT 10.0 Win64 x64 rv: 108.0) Gecko / 20100101 Firefox / 108.0'
          }
        })
      const $ = cheerio.load(data)
      const dat = []
      const b = $('a.slide > img').attr('src')
      $('div.bl-flex-item.mb-8').each((i, u) => {
        const a = $(u).find('observer-tracker > div > div')
        const img = $(a).find('div > a > img').attr('src')
        if (typeof img === 'undefined') return

        const link = $(a).find('.bl-thumbnail--slider > div > a').attr('href')
        const title = $(a).find('.bl-product-card__description-name > p > a').text().trim()
        const harga = $(a).find('div.bl-product-card__description-price > p').text().trim()
        const rating = $(a).find('div.bl-product-card__description-rating > p').text().trim()
        const terjual = $(a).find('div.bl-product-card__description-rating-and-sold > p').text().trim()

        const dari = $(a).find('div.bl-product-card__description-store > span:nth-child(1)').text().trim()
        const seller = $(a).find('div.bl-product-card__description-store > span > a').text().trim()
        const link_sel = $(a).find('div.bl-product-card__description-store > span > a').attr('href')

        const res_ = {
          title: title,
          rating: rating ? rating: 'No rating yet',
          terjual: terjual ? terjual: 'Not yet bought',
          harga: harga,
          image: img,
          link: link,
          store: {
            lokasi: dari,
            nama: seller,
            link: link_sel
          }
        }

        dat.push(res_)
      })
      if (dat.every(x => x === undefined)) return resolve({
        message: 'Tidak ada result!'
      })
      resolve(dat)
    } catch (err) {
      console.error(err)
    }
  })
}

function SepakBola() {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        data
      } = await axios.get('https://www.jadwaltv.net/jadwal-sepakbola')
      const $ = cheerio.load(data)
      let tv = []
      $('table.table.table-bordered > tbody > tr.jklIv').each((u, i) => {
        let an = $(i).html().replace(/<td>/g, '').replace(/<\/td>/g, ' - ')
        tv.push(`${an.substring(0, an.length - 3)}`)
      })
      if (tv.every(x => x === undefined)) return resolve({
        message: 'Tidak ada result!'
      })
      resolve(tv)
    } catch (err) {
      console.error(err)
    }
  })
}

async function HariLibur() {
  const {
    data
  } = await axios.get("https://www.liburnasional.com/")
  let libnas_content = []
  let $ = cheerio.load(data)
  let result = {
    nextLibur:
    "Hari libur" +
    $("div.row.row-alert > div").text().split("Hari libur")[1].trim(),
    libnas_content,
  }
  $("tbody > tr > td > span > div").each(function (a, b) {
    summary = $(b).find("span > strong > a").text()
    days = $(b).find("div.libnas-calendar-holiday-weekday").text()
    dateMonth = $(b).find("time.libnas-calendar-holiday-datemonth").text()
    libnas_content.push({
      summary, days, dateMonth
    })
  })
  return result
}

async function growtopiaItems(nameItem) {
  try {
    const itemListResponse = await axios.get("https://growtopia.fandom.com/api/v1/SearchSuggestions/List?query=" + nameItem)
    const itemList = itemListResponse.data.items

    if (itemList.length === 0) {
      return null
    }

    const itemName = itemList[0].title
    const link = `https://growtopia.wikia.com/wiki/${itemName}`

    const getDataResponse = await axios.get(link)
    const $ = cheerio.load(getDataResponse.data)

    const Description = $(".card-text").first().text()
    const Properties = $("#mw-content-text > div > div.gtw-card.item-card > div:nth-child(4)")
    .text()
    .trim()
    .split(/[\.+\!]/)
    .filter((d) => d !== "")

    const Sprite = $("div.card-header .growsprite > img").attr("src")
    const Color = $(".seedColor > div").text().trim().split(" ")
    const Rarity = $(".card-header b > small").text().match(/(\d+)/)
    const Recipe = $(".recipebox table.content")
    .last()
    .text()
    .trim()
    .split(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/)
    .map((el) => el.trim())
    const Splice = $(".bg-splice").text()
    const Info = $("#mw-content-text > div > p:nth-child(3)").text().trim()
    const Type = $("table.card-field tr:nth-child(1) > td")
    .text()
    .split(" ")
    .pop()

    const dataList = {
      Name: itemName,
      URL: link.replace(/ /g, "_"),
      Description,
      Properties: Properties.length > 0 ? Properties: undefined,
      Sprite,
      Color,
      Rarity: Rarity !== null ? parseInt(Rarity[0]): undefined,
      Recipe: Recipe.length > 0
      ? {
        type: Recipe.shift() || "",
        recipe: Recipe,
      }: undefined,
      Splice: Splice.length > 0 ? Splice: undefined,
      Info,
      Type,
    }

    if (itemList.length > 1 && nameItem.toLowerCase() !== itemName.toLowerCase()) {
      const matches = itemList.map((i) => i.title)
      dataList.matches = matches
    }

    return dataList
  } catch (e) {
    console.error(e)
    return null
  }
}

async function chord(query) {
  const search = await axios.get(
    `https://www.gitagram.com/?s=${encodeURIComponent(query).replace(
      /%20/g,
      "+"
    )}`
  )
  const $ = await cheerio.load(search.data)
  const $url = $("table.table > tbody > tr")
  .eq(0)
  .find("td")
  .eq(0)
  .find("a")
  .eq(0)
  const url = $url.attr("href")
  const song = await axios.get(url)
  const $song = await cheerio.load(song.data)
  const $hcontent = $song("div.hcontent")
  const artist = $hcontent.find("div > a > span.subtitle").text().trim()
  const artistUrl = $hcontent.find("div > a").attr("href")
  const title = $hcontent.find("h1.title").text().trim()
  const chord = $song("div.content > pre").text().trim()
  const res = {
    url: url,
    artist,
    artistUrl,
    title,
    chord,
  }
  return res
}

async function remini(url, method) {
  return new Promise(async (resolve, reject) => {
    let Methods = ["enhance", "recolor", "dehaze"]
    Methods.includes(method) ? (method = method): (method = Methods[0])
    let buffer,
    Form = new FormData(),
    scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method
    Form.append("model_version", 1, {
      "Content-Transfer-Encoding": "binary",
      contentType: "multipart/form-data charset=uttf-8",
    })
    Form.append("image", Buffer.from(url), {
      filename: "enhance_image_body.jpg",
      contentType: "image/jpeg",
    })
    Form.submit(
      {
        url: scheme,
        host: "inferenceengine" + ".vyro" + ".ai",
        path: "/" + method,
        protocol: "https:",
        headers: {
          "User-Agent": "okhttp/4.9.3",
          Connection: "Keep-Alive",
          "Accept-Encoding": "gzip",
        },
      },
      function (err, res) {
        if (err) reject()
        let data = []
        res
        .on("data", function (chunk, resp) {
          data.push(chunk)
        })
        .on("end", () => {
          resolve(Buffer.concat(data))
        })
        res.on("error", (e) => {
          reject()
        })
      }
    )
  })
}

module.exports = {
  downloader: {
    igdl,
    tiktok,
    fbdl,
    ytmp3,
    ytmp4,
    play,
    playvideo,
    playaudio
  },
  search: {
    tiktoks,
    search,
    BukaLapak,
    WattPad,
    komiku,
    linkwa,
    growtopiaItems,
    chord
  },
  game: {
    tebakgambar
  },
  tools: {
    remini,
    ssweb,
    SepakBola,
    HariLibur
  }
}