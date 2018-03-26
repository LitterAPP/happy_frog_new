const util = require('../../utils/util.js')
import Download from '../../utils/download.js'
const app = getApp()

var preViewPayIndex = 0
var preViewInnerAudioContext
var userInputText
var page = 1, pageSize = 5

var readId = 0
var replyId = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipShow: true,
    nomore:false,
    nodatas:false
  },
  hideOrShow: function () {
    var that = this
    var tipShow = that.data.tipShow
    console.log('hideOrShow', tipShow)
    that.setData({ tipShow: !tipShow })
  },
  goToRead: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })

    wx.navigateTo({
      url: '/pages/read/read?bookId=' + e.currentTarget.dataset.bookid
    })
  },
  itemChange: function (e) {
    var that = this
    preViewPayIndex = e.detail.current
    preViewInnerAudioContext.src = that.data.readerInfo.shots[preViewPayIndex].voiceUrl
    console.log('itemChange->preViewPayIndex=', preViewPayIndex)
  },
  replay: function () {
    var that = this
    preViewPayIndex = 0
    that.setData({ swiperCurrent: preViewPayIndex, showReplayButton: false }) 
  },
  preViewaudioListener: function () {
    var that = this
    var count = that.data.readerInfo.shots.length
    preViewInnerAudioContext = wx.createInnerAudioContext()
    preViewInnerAudioContext.autoplay = true
    preViewInnerAudioContext.obeyMuteSwitch = false

    preViewInnerAudioContext.onPlay(() => {
      console.log('preViewInnerAudioContext=>play,preViewPayIndex=', preViewPayIndex)
      if (preViewPayIndex > count - 1) {
        preViewPayIndex == 0
        preViewInnerAudioContext.stop()
        return
      }
      that.setData({ swiperCurrent: preViewPayIndex, showReplayButton:false })
    })
    preViewInnerAudioContext.onStop(() => {

    })
    preViewInnerAudioContext.onEnded(() => {
      preViewPayIndex++
      var shot = that.data.readerInfo.shots[preViewPayIndex]
      console.log('preViewInnerAudioContext=>onEnded,preViewPayIndex=', preViewPayIndex, shot)
      if (shot) {
        that.setData({ swiperCurrent: preViewPayIndex })
      } else {
        that.setData({ showReplayButton: true })
      }

    })
    preViewInnerAudioContext.onError((res) => {

      preViewPayIndex++
      var shot = that.data.readerInfo.shots[preViewPayIndex]
      console.log('preViewInnerAudioContext=>onError,preViewPayIndex=', preViewPayIndex, res, shot)
      if (shot) {
        that.setData({ swiperCurrent: preViewPayIndex })
      } else {
        that.setData({ showReplayButton: true })
      }
    })
  },
  followed: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })
    util.GET(app.globalData.host + '/Forg/follow', {
      session: wx.getStorageSync('session'),
      followUserId: that.data.readerInfo.readUserId
    }, function (res) {
      if (res && res.code == 1) {
        that.setData({ followStatus: res.data.followStatus, follows: res.data.follows })
        if (res.data.followStatus == 1) {
          wx.showToast({
            title: '关注成功',
          })
        }
        else if (res.data.followStatus == 0) {
          wx.showToast({
            title: '关注取消',
          })
        }
        that.animationFollowScale()
      }
    })
  },
  commentCancel: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })

    that.setData({ input: false })
  },
  commentInput: function (e) {
    userInputText = e.detail.value
  },
  commentReply: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })
    that.setData({ input: true })
    replyId = e.currentTarget.dataset.id
  },
  commentSend: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })
    util.GET(app.globalData.host + '/Forg/comment',
      {
        session: wx.getStorageSync('session'),
        comments: userInputText,
        readId: that.data.readerInfo.readId,
        replyId: replyId
      }, function (res) {
        if (res && res.code == 1) {
          that.setData({ input: false })
          that.listComment()
          util.showToast('评论成功', 'success')
          replyId = 0
        } else {
          util.showToast('评论失败', 'error')
        }
      })
  },
  reflushComment: function () {
    var that = this
    page = 1
    that.setData({ nomore: false })
    that.listComment()
  },
  listMoreComment: function (e) {
    var that = this

    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {

      })
    
    if(that.data.nomore){
      return 
    }
    that.setData({ loading: true })
    page++
    util.GET(app.globalData.host + '/Forg/listComments',
      {
        session: wx.getStorageSync('session'),
        readId: that.data.readerInfo.readId,
        page: page,
        pageSize: pageSize
      }, function (res) {
        that.setData({ loading: false })
        if (res && res.code == 1 && res.data.comments && res.data.comments.length > 0) {
          var old = that.data.comments
          for (let i in res.data.comments) {
            old['comments'].push(res.data.comments[i])
          }
          that.setData({ comments: old })
        } else {          
          that.setData({ nomore: true })
        }
      })
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
  listComment: function () {
    var that = this    
    page = 1
    util.GET(app.globalData.host + '/Forg/listComments',
      {
        session: wx.getStorageSync('session'),
        readId: that.data.readerInfo.readId,
        page: page,
        pageSize: pageSize
      }, function (res) {
        if (res && res.code == 1 && res.data.comments && res.data.comments.length>0) {
          that.setData({ comments: res.data.comments })
        } else {
          that.setData({ nodatas:true})
        }
      })
  },
  commentToast: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })

    that.setData({ input: true })
  },
  addFlow: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })

    util.GET(app.globalData.host + '/Forg/recordAddFlow', {
      session: wx.getStorageSync('session'),
      recordId: that.data.readerInfo.readId
    }, function (res) {
      if (res && res.code == 1) {
        var readerInfo = that.data.readerInfo
        readerInfo.readerFlows = res.data
        that.setData({ readerInfo: readerInfo })
        that.animationFlowScale()
      }
    })
  },
  animationFollowScale: function () {
    var that = this
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    that.animation = animation
    animation.scale(1.5, 1.5).step()
    animation.scale(1, 1).step()

    that.setData({
      animationDataFollow: animation.export(),
    })
    setTimeout(function () {
      that.setData({
        animationDataFollow: null,
      })
    }, 1000)
  },
  animationFlowScale: function () {
    var that = this
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    that.animation = animation
    animation.scale(1.5, 1.5).step()
    animation.scale(1, 1).step()

    that.setData({
      animationDataFlow: animation.export(),
    })
    setTimeout(function () {
      that.setData({
        animationDataFlow: null,
      })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    let W = wx.getSystemInfoSync().windowWidth
    let H = wx.getSystemInfoSync().screenHeight
    that.setData({ W: W, H: H })

    util.isApproved(function (isApproved) {
      that.setData({ isApproved: isApproved })
    })

    util.GET(app.globalData.host + '/Forg/recordAddPlayTimes',
      {
        session: wx.getStorageSync('session'),
        recordId: options.readId || 0
      }, function () { })

    readId = options.readId
    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/Forg/getOneReaderInfo',
        {
          session: wx.getStorageSync('session'),
          readId: readId
        },
        function (res) {
          if (res && res.code == 1) {
            res.data.shots.reverse()
            that.setData({ readerInfo: res.data, pageshow: true })
            that.preViewaudioListener()
            preViewPayIndex = 0
            preViewInnerAudioContext.src = that.data.readerInfo.shots[preViewPayIndex].voiceUrl

            util.GET(app.globalData.host + '/Forg/getFollowStatus', {
              session: wx.getStorageSync('session'),
              followUserId: that.data.readerInfo.readUserId
            }, function (res) {
              if (res && res.code == 1) {
                that.setData({ followStatus: res.data.followStatus, follows: res.data.follows })
              }
            })

            that.listComment()

          } else {
            util.showToast('系统繁忙', 'error')
          }
        })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (preViewInnerAudioContext){
      preViewInnerAudioContext.stop()
      preViewInnerAudioContext.destroy()
    }
  
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
    var that = this
    return {
      title: that.data.readerInfo.readerName + '朗诵了《' + that.data.readerInfo.bookName + '》,快来听听我的声音！',
      path: '/pages/read/view?readId=' + that.data.readerInfo.readId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})