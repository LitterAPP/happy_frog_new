import Upload from '../../utils/upload.js'
const util = require('../../utils/util.js')
const backgroundMusic = require('../../utils/backgroundMusic.js')
const app = getApp()
var page = 1, pageSize = 5
var animations = []
var W
var H
var ItemW
var startX, startY, endX, endY
var reflushUrl = app.globalData.host + '/Forg/listHotBooks'
var jx = 0, hotOrLast = 0
var currentBookId = 0

var moveSprites = ['/images/forg-7.png', '/images/forg-5.png', '/images/gift-1.png', '/images/gift-2.png', '/images/gift-3.png', '/images/gift-4.png', '/images/gift-5.png', '/images/gift-6.png', '/images/gift-7.png', '/images/gift-8.png', '/images/gift-9.png', '/images/gift-10.png', '/images/gift-11.png', '/images/huaban-1.png', '/images/huaban-2.png']

var soundScale1, soundScale2, soundScale3, soundScale4, soundScale5, soundScale6, soundScale7

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hot: 1,
    borderColor: '#E6399B',
    jx: 1,
    bar: 1
  },
  goCreate: function () {
    wx.redirectTo({
      url: '/pages/create/create',
    })
  },
  goToRead: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {

      })

    wx.navigateTo({
      url: '/pages/read/read?bookId=' + currentBookId
    })
  },
  goBainian: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {

      })

    wx.navigateTo({
      url: '/wish/pages/bainian/index',
    })
  },
  goActivity: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {

      })
    wx.navigateTo({
      url: '/activity/list',
    })
  },
  goCreate: function (e) {
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {
        wx.navigateTo({
          url: '/pages/create/create',
        })
      })
  },
  jxSelected: function (e) {
    var that = this
    jx = e.currentTarget.dataset.jx
    that.setData({ jx: jx })
    that.reflush()
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {
      })
  },
  hotOrLast: function (e) {
    var that = this
    hotOrLast = e.currentTarget.dataset.hot
    that.setData({ hot: hotOrLast })
    that.reflush()
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {
      })
  },
  goSendMoment: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })
    wx.redirectTo({
      url: '/pages/create/moment',
    })
  },
  barSelect: function (e) {
    console.log('barSelect')
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })

    let bar = e.currentTarget.dataset.bar
   
    if (bar == 1) {
      page=1
      that.reflush()
    } else if (bar == 2) {
      wx.redirectTo({
        url: '/pages/moments/list',
      })
    }
  },
  reflush: function () {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    util.GET(app.globalData.host + '/Forg/listBooks_new',
      {
        session: wx.getStorageSync('session'),
        hotOrLast: hotOrLast,
        page: page,
        recommend:1,
        pageSize: pageSize
      },
      function (res) {
        wx.hideLoading()
        if (res && res.code == 1) {

          var books = res.data.list
          if (books.length <= 0) {
            page = 1
            that.reflush()
            return
          }
          currentBookId = books[0].id
          that.getTop3()
          //books.reverse()
          let zindex = books.length
          for (let i in books) {
            books[i]['X'] = 0
            books[i]['Y'] = 10
            books[i]['zindex'] = zindex
            zindex--
            let deg = (i - 3) * 3 * -1
            if (deg > 20) {
              deg = 20
            }
            if (deg < -20) {
              deg = -20
            }
            books[i]['DEG'] = deg;
          }
          that.setData(
            {
              W: W,
              H: H,
              ItemW: ItemW,
              list: books,
              currentAnimationId: 0,
              nothing: false,
              pageshow: true
            })
        }
      })
  },
  stopMusic: function () {
    backgroundMusic.stopMusic()
  },
  playMusic: function () {
    backgroundMusic.playMusic()
  },

  rankItemClick: function (e) {
    var that = this
    let index = e.currentTarget.dataset.idx
    let selectedItem = that.data.otherRecords[index]
    if (!selectedItem) return
    if (selectedItem.recordUrl) {
      return
    }
    wx.navigateTo({
      url: '/pages/read/view?readId=' + selectedItem.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    W = wx.getSystemInfoSync().windowWidth
    H = wx.getSystemInfoSync().screenHeight
    ItemW = W - 80
    util.isApproved(function (isApproved) {
      that.setData({ isApproved: isApproved })
    })

    util.checkLogin(false, function () {
      that.setData({ userinfo: wx.getStorageSync('userinfo') })
      that.reflush()
    })
  },
  goToMySpace: function () {
    wx.navigateTo({
      url: '/pages/myspace/index',
    })
  },
  getTop3: function () {
    var that = this
    util.GET(app.globalData.host + '/Forg/listRecord', {
      session: wx.getStorageSync('session'),
      bookId: currentBookId,
      byLast: 0,
      page: 1,
      pageSize: 3
    }, function (res) {
      if (res && res.code == 1 && res.data && res.data.otherRecords && res.data.otherRecords.length > 0) {
        that.setData({ otherRecords: res.data.otherRecords })
      }
    })
  },

  /*
  linsternAudioEvent: function () {
    var that = this
    backgroundMusic.listener(function (music) {
      that.setData({ music: music })
    })
  },
  selectedMusic: function (e) {
    var that = this
    console.log('selectedMusic', e.detail)
    let musicIndx = e.detail.id
    if (!musicIndx) return
    backgroundMusic.playMusic(musicIndx)
  },
  */

  moveItemStart: function (e) {
    if (!e || !e.changedTouches || !e.changedTouches[0]) return
    startX = e.changedTouches[0].pageX
    startY = e.changedTouches[0].pageY
    console.log('moveItemStart-->', startX, startY)
  },
  movingItem: function (e) {
    if (!e || !e.changedTouches) return
    endX = e.changedTouches[0].pageX
    endY = e.changedTouches[0].pageY
    console.log('movingItem-->', endX, endY)
    let absX = Math.abs(endX - startX)
    let absY = Math.abs(endY - startY)
    let offset = Math.sqrt(absX * absX + absY * absY)

    if (offset < 20) {
      console.log('moveItem-->小于20，不运动,执行跳转', endX, endY)
      wx.navigateTo({
        url: '/pages/index/index?bookId=' + e.currentTarget.dataset.bookid,
      })
      return
    }
    //判断运动方向8个方向
    //正东 东南 正南 南西 正西 西北 正北 东北
    /**
     */
    var that = this
    var idx = e.currentTarget.dataset.idx
    var copyList = that.data.list
    var maxOffset = Math.sqrt(ItemW * ItemW + ItemW * ItemW)
    let piancha = 40
    console.log('move--->idx', idx, copyList.lenght)
    //currentBookIdz
    if (idx != copyList.length - 1) {
      currentBookId = copyList[idx + 1].id
      that.getTop3()
    }

    if (endX - startX > 0 && absY < piancha) {//正东
      console.log('正东')
      copyList[idx].X = W + maxOffset
      copyList[idx].Y = 0
    } else if (endX - startX > 0 && endY - startY > 0 && absY > piancha) {//东南
      console.log('东南')
      copyList[idx].X = W + maxOffset
      copyList[idx].Y = H + maxOffset
    } else if (endY - startY > 0 && absX < piancha) {//正南
      console.log('正南')
      copyList[idx].X = 0
      copyList[idx].Y = H + maxOffset
    } else if (endX - startX < 0 && endY - startY > 0 && absX > piancha) {//南西
      console.log('南西')
      copyList[idx].X = maxOffset * -1 - 100
      copyList[idx].Y = maxOffset
    } else if (endX - startX < 0 && absY < piancha) {//正西
      console.log('正西')
      copyList[idx].X = maxOffset * -1 - 100
      copyList[idx].Y = 0
    } else if (endY - startY < 0 && endX - startX < 0 && absY > piancha) {//西北
      console.log('西北')
      copyList[idx].X = (W + maxOffset) * -1
      copyList[idx].Y = (H + maxOffset) * -1
    } else if (endY - startY < 0 && absX < piancha) {//正北 
      console.log('正北')
      copyList[idx].X = 0
      copyList[idx].Y = (H + maxOffset) * -1
    } else if (endY - startY < 0 && endX - startX > 0 && absX > piancha) {//东北
      console.log('东北')
      copyList[idx].X = W + maxOffset
      copyList[idx].Y = (H - maxOffset) * -1
    }
    copyList[idx].DEG = copyList[idx].DEG + 45
    that.setData({ list: copyList })

    var that = this
    var idx = e.currentTarget.dataset.idx
    if (idx == copyList.length - 1) {
      page++
      that.reflush()
    }
  },
  moveItemEnd: function (e) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    /*
      backgroundMusic.instance(app.globalData.host + '/Forg/listMusic', function (music) {
        console.log('list', music.selectedId)
        that.setData({ music: music })
        that.soundScale()
        that.linsternAudioEvent()
        backgroundMusic.autoPlayMusic()
      })
    */
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('clear interval')
    clearInterval(soundScale1)
    clearInterval(soundScale2)
    clearInterval(soundScale3)
    clearInterval(soundScale4)
    clearInterval(soundScale5)
    clearInterval(soundScale6)
    clearInterval(soundScale7)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      scrollLeft: 0,
      duration: 0
    })
  },

  onPageScroll: function () {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /*
  soundScale: function () {
    var that = this
    let count = 0
    soundScale1 = setInterval(function () {
      if (count % 2 == 0) {
        that.setData({ musicSoundScaleY1: Math.floor(Math.random() * 5 + 1) + 1 })
      } else {
        that.setData({ musicSoundScaleY1: 1 })
      }
      count++
    }, 600)
    soundScale2 = setInterval(function () {
      if (count % 2 == 0) {
        that.setData({ musicSoundScaleY2: Math.floor(Math.random() * 5 + 1) + 1 })
      } else {
        that.setData({ musicSoundScaleY2: 1 })
      }
    }, 650)

    soundScale3 = setInterval(function () {
      if (count % 2 == 0) {
        that.setData({ musicSoundScaleY3: Math.floor(Math.random() * 5 + 1) + 1 })
      } else {
        that.setData({ musicSoundScaleY3: 1 })
      }
    }, 750)

    soundScale4 = setInterval(function () {
      if (count % 2 == 0) {
        that.setData({ musicSoundScaleY4: Math.floor(Math.random() * 5 + 1) + 1 })
      } else {
        that.setData({ musicSoundScaleY4: 1 })
      }
    }, 600)

    soundScale5 = setInterval(function () {
      if (count % 2 == 0) {
        that.setData({ musicSoundScaleY5: Math.floor(Math.random() * 5 + 1) + 1 })
      } else {
        that.setData({ musicSoundScaleY5: 1 })
      }
    }, 700)

    soundScale6 = setInterval(function () {
      if (count % 2 == 0) {
        that.setData({ musicSoundScaleY6: Math.floor(Math.random() * 5 + 1) + 1 })
      } else {
        that.setData({ musicSoundScaleY6: 1 })
      }
    }, 710)

    soundScale7 = setInterval(function () {
      if (count % 2 == 0) {
        that.setData({ musicSoundScaleY7: Math.floor(Math.random() * 5 + 1) + 1 })
      } else {
        that.setData({ musicSoundScaleY7: 1 })
      }
    }, 630)
  }*/
})