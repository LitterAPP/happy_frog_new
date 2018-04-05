import Upload from '../../utils/upload.js'
const util = require('../../utils/util.js')

const app = getApp()
var momentImgs, moment
var covers=[]

var soundScale1, soundScale2, soundScale3, soundScale4, soundScale5, soundScale6, soundScale7
Page({
  /**
   * 页面的初始数据
   */
  data: {
    typeIndex:3,
    typeList: ['故事读物','看图说话', '求教解题','我的心情']
  },
  bindPickerChange:function(e){   
    var that = this
    that.setData({ typeIndex : e.detail.value})
  },
  goBack: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })

    let pages = getCurrentPages();
    console.log('getCurrentPages', pages)
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.redirectTo({
        url: '/pages/list/list',
      })
      /*
      wx.switchTab({
        url: '/pages/list/list',
      })
      */
    }
  },
  momentImgChanged: function (e) {
    console.log(e.detail)
    momentImgs = e.detail
  },
  formSumbit: function (e) {
    var that = this
    moment = e.detail.value.moment

    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {
      })

    if (!moment || moment.length === 0) {
      util.showToast('您的想法很重要', 'info')
      return
    }
    if (!momentImgs || momentImgs.length < 1) {
      util.showToast('有图有真相', 'info')
      return
    }

    var shotFiles = []
    var memos = []
    for (let i in momentImgs) {
      if (!momentImgs[i].logo || momentImgs[i].logo.length == 0) {
        util.showToast('有图有真相', 'error')
        return
      }
      shotFiles.push(momentImgs[i].logo)
      memos.push(momentImgs[i].memo)
    }

    var uploadUrl = app.globalData.host + '/Upload/uploadFile'
    //上传截图
    wx.showLoading({
      title: '保存中...',
      mask: true
    })
    
    let uploadTask = new Upload(shotFiles)
    uploadTask.upload(uploadUrl, function (keys1) {      
      var shotstr = keys1.join(',')
      util.GET(app.globalData.host + '/Forg/createBooks',
        {
          session: wx.getStorageSync('session'),
          bookName: moment,
          shots: shotstr,
          type: parseInt(that.data.typeIndex) + parseInt(1),
          memos: memos.join(',')          
        }, function (res) {
          if (res && res.code == 1) {
            util.showToast('发表成功', 'success')
            wx.redirectTo({
              url: '/pages/moments/list',
            })
          } else if (res.code == -1) {
            util.showToast('发表失败', 'error')
          }
          setTimeout(function () { wx.hideLoading() }, 200)
        })
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var bookId = options.bookId
    util.showToast('加载中...', 'info')
    util.checkLogin(false, function () {
      if (bookId) {
        util.GET(app.globalData.host + '/Forg/getBook', { session: wx.getStorageSync('session'), bookId: bookId }, function (res) {
          if (res && res.code == 1) { 
            var shots = []
            for (let i in res.data.shots) {
              shots.push({ logo: '', remoteUrl: res.data.shots[i].pageShot })
            }
            that.setData({ W: wx.getSystemInfoSync().windowWidth, bookId: res.data.book.id, bookName: res.data.book.bookName, shots: shots,  pageshow: true })
          }
          wx.hideLoading()
        })
      } else {
        console.log('login callback')
        that.setData({ W: wx.getSystemInfoSync().windowWidth, pageshow: true })
        wx.hideLoading()
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
  },
  selectedMusic: function (e) {
    var that = this
    console.log('selectedMusic', e.detail)
    let musicIndx = e.detail.id
    if (!musicIndx) return
    backgroundMusic.playMusic(musicIndx)
  },***/
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
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

  }
})