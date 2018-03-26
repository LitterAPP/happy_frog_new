import Upload from '../../utils/upload.js'
const util = require('../../utils/util.js')
const app = getApp()
var currentRecordIdx = 0, currentRecordTimes = 0, recordStatus = 0, recordInterval
const recorderManager = wx.getRecorderManager()
const recordOptions = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3'
}


var innerAudioContext

var preViewPayIndex = 0
let preViewInnerAudioContext = wx.createInnerAudioContext()
preViewInnerAudioContext.autoplay = true
preViewInnerAudioContext.obeyMuteSwitch = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0
  },
  swiperChanged: function (e) {
    var that = this
    let current = e.detail.current
    that.setData({ scrollToView: 'scrollItem_' + current, swiperCurrent: current})
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
  previewVoid: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })

    if (recordStatus == 1) {
      util.showToast('朗读中...','info')
      return
    }
    var shots = that.data.shots
    var checkRecord = true
    var record = 0 
    for (let ii in shots) {
      if (shots[ii].recorded) {
        record++
      }
    }
    if (record<=0) {
      util.showModal('请点击录音按钮开始朗读', 'info')
      return
    }
    preViewPayIndex = 0
    preViewInnerAudioContext.src = this.data.shots[preViewPayIndex].recordInfo.tempFilePath
  },
  uploadVoice: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })
   
    if (recordStatus == 1) {
      return
    }
    var shots = that.data.shots
    var checkRecord = true
    var uploadTmpfiles = []
    var pageIds = []
     
    var record = 0
    for (let ii in shots) {
      if (shots[ii].recorded) {
        record++
        pageIds.push(shots[ii].id)
        uploadTmpfiles.push(shots[ii].recordInfo.tempFilePath)
      }
    }
    if (record <= 0) { 
      util.showModal('请点击录音按钮开始朗读','info')
      return
    } 
//title, content, showCancel, confirmFun, cancelFun
    if (record < shots.length){
      var diff = shots.length - record
      util.showWindow('朗读不完整', '您还差' + diff + '页未朗读，确定就这样上传吗？',true,function(){
        wx.showLoading({
          title: '上传中...',
          mask: true
        })
        var uploadUrl = app.globalData.host + '/Upload/uploadFile'
        let recordUploadTask = new Upload(uploadTmpfiles)
        recordUploadTask.upload(uploadUrl, function (keys) {
          console.log('recordUploadTask', keys)
          util.GET(app.globalData.host + '/Forg/recordCommit',
            {
              session: wx.getStorageSync('session'),
              bookId: that.data.book.id,
              recordUrl: '',
              recordTimingValue: 0,
              pageIds: pageIds.toString(),
              voiceOsss: keys.toString(),
            }, function (res) {
              if (res && res.code == 1) {
                wx.navigateTo({
                  url: '/pages/read/view?readId=' + res.data,
                })
              } else {
                util.showToast('上传失败', 'error')
              }
              wx.hideLoading()
            })
        })
      },function(){})
    }else{
      wx.showLoading({
        title: '上传中...',
        mask: true
      })
      var uploadUrl = app.globalData.host + '/Upload/uploadFile'
      let recordUploadTask = new Upload(uploadTmpfiles)
      recordUploadTask.upload(uploadUrl, function (keys) {
        console.log('recordUploadTask', keys)
        util.GET(app.globalData.host + '/Forg/recordCommit',
          {
            session: wx.getStorageSync('session'),
            bookId: that.data.book.id,
            recordUrl: '',
            recordTimingValue: 0,
            pageIds: pageIds.toString(),
            voiceOsss: keys.toString(),
          }, function (res) {
            if (res && res.code == 1) {
              wx.navigateTo({
                url: '/pages/read/view?readId=' + res.data,
              })
            } else {
              util.showToast('上传失败', 'error')
            }
            wx.hideLoading()
          })
      })
    }
  },
  play: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })
    if (recordStatus == 1) {
      return
    }
    console.log('play', e.currentTarget.dataset.idx, e.detail.formId)
    currentRecordIdx = e.currentTarget.dataset.idx
    var shots = this.data.shots
    innerAudioContext.src = shots[currentRecordIdx].recordInfo.tempFilePath
  },
  stop: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })
    console.log('stop', e.currentTarget.dataset.idx, e.detail.formId)
    innerAudioContext.stop()
  },
  record: function (e) {
    if (e.detail.formId){
      util.GET(app.globalData.host + '/FormId/collect',
        {
          session: wx.getStorageSync('session'),
          appId: app.globalData.appid,
          formId: e.detail.formId
        }, function () { })
    }   
    //停止录音
    if (recordStatus == 1) {      
      recorderManager.stop()
      console.log('stop record', e.currentTarget.dataset.idx, e.detail.formId)
      return
    }
    if(!wx.getStorageSync('tip-stop-opt')){
      wx.showToast({
        title: '点击可停止录音',
      })
      wx.setStorage({
        key: 'tip-stop-opt',
        data: '1',
      })
      
    }
    
    console.log('start record', e.currentTarget.dataset.idx, e.detail.formId)
    currentRecordTimes = 0
    currentRecordIdx = e.currentTarget.dataset.idx
    recordOptions['duration'] = this.data.shots[currentRecordIdx].readTime * 1000
    recorderManager.start(recordOptions)
  },   
  recordListener: function () {
    var that = this
    recorderManager.onStart(() => {
      console.log('start record , currentRecordIdx=', currentRecordIdx)
      innerAudioContext.stop()
      preViewInnerAudioContext.stop()
      recordStatus = 1
      var shots = this.data.shots
      shots[currentRecordIdx]['record'] = true

      that.setData({ shots: shots, swiperCurrent: currentRecordIdx })
      let count = 0
      recordInterval = setInterval(function () {
        let total = shots[currentRecordIdx].readTime * 1000    
        shots[currentRecordIdx]['percent'] = (count / total) * 100
        count = count + 10
        that.setData({ shots: shots })
      }, 10)
    })

    recorderManager.onError(() => {
      console.log('error record , currentRecordIdx=', currentRecordIdx)
      clearInterval(recordInterval)
      recordStatus = 0
      var shots = this.data.shots
      shots[currentRecordIdx]['record'] = false
      shots[currentRecordIdx]['percent'] = 0
      that.setData({ shots: shots })
    })

    recorderManager.onStop((res) => {
      console.log('stop record , currentRecordIdx=', currentRecordIdx, 'res=', res)
      clearInterval(recordInterval)
      recordStatus = 0
      var shots = this.data.shots
      shots[currentRecordIdx]['record'] = false
      shots[currentRecordIdx]['recorded'] = true
      shots[currentRecordIdx]['recordInfo'] = res
      shots[currentRecordIdx]['percent'] = 100
      that.setData({ shots: shots })
      /*
      var next = currentRecordIdx+1
      if (next<shots.length){
        that.setData({ scrollToView: 'scrollItem_' + next, swiperCurrent: next })
      }  */ 
    })
  },
  audioListener: function () {
    var that = this
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.obeyMuteSwitch = false

    innerAudioContext.onPlay(() => {
      console.log('audio play,currentRecordIdx=', currentRecordIdx)
      preViewInnerAudioContext.stop()
      var shots = this.data.shots
      shots[currentRecordIdx]['play'] = true
      that.setData({ shots: shots, swiperCurrent: currentRecordIdx })
    })
    innerAudioContext.onStop(() => {
      console.log('audio stop,currentRecordIdx=', currentRecordIdx)
      var shots = this.data.shots
      for (var ii in shots) {
        shots[ii]['play'] = false
      }
      that.setData({ shots: shots })

    })
    innerAudioContext.onEnded(() => {
      console.log('audio ended,currentRecordIdx=', currentRecordIdx)
      var shots = this.data.shots
      for (var ii in shots) {
        shots[ii]['play'] = false
      }
      that.setData({ shots: shots })
    })
    innerAudioContext.onError((res) => {
      console.log('audio error,currentRecordIdx=', currentRecordIdx)
      var shots = this.data.shots
      for (var ii in shots) {
        shots[ii]['play'] = false
      }
      shots[currentRecordIdx]['record'] = false
      shots[currentRecordIdx]['percent'] = 0
      that.setData({ shots: shots })
    })
  },
  preViewaudioListener: function () {
    var that = this
    var count = that.data.shots.length
    preViewInnerAudioContext = wx.createInnerAudioContext()
    preViewInnerAudioContext.autoplay = true
    preViewInnerAudioContext.obeyMuteSwitch = false
    preViewInnerAudioContext.onPlay(() => {
      console.log('preViewInnerAudioContext play,preViewPayIndex=', preViewPayIndex)
      innerAudioContext.stop()
      if (preViewPayIndex > count - 1) {
        preViewPayIndex == 0
        preViewInnerAudioContext.stop()
        return
      }
      that.setData({ swiperCurrent: preViewPayIndex })
    })
    preViewInnerAudioContext.onStop(() => {

    })
    preViewInnerAudioContext.onEnded(() => {
      preViewPayIndex++
      var shot = that.data.shots[preViewPayIndex]
      console.log('preViewInnerAudioContext onEnded,preViewPayIndex2=', preViewPayIndex)
      if (shot && shot.recordInfo && shot.recordInfo.tempFilePath) {
        console.log('preViewInnerAudioContext onEnded,preViewPayIndex3=', shot.recordInfo.tempFilePath)
        that.setData({ swiperCurrent: preViewPayIndex })
        preViewInnerAudioContext.src = shot.recordInfo.tempFilePath
      }
    })
    preViewInnerAudioContext.onError((res) => {
      console.log('preViewInnerAudioContext error,preViewPayIndex1=', preViewPayIndex, res, preViewInnerAudioContext.src)
      preViewPayIndex++
      var shot = that.data.shots[preViewPayIndex]
      console.log('preViewInnerAudioContext error,preViewPayIndex2=', preViewPayIndex)
      if (shot) {
        console.log('preViewInnerAudioContext error,preViewPayIndex3=', shot.recordInfo.tempFilePath)
        that.setData({ swiperCurrent: preViewPayIndex })
        preViewInnerAudioContext.src = shot.recordInfo.tempFilePath
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    let bookId = options.bookId || 0
    let W = wx.getSystemInfoSync().windowWidth
    let H = wx.getSystemInfoSync().screenHeight
    that.setData({ W: W, H: H })
    that.recordListener()
    that.audioListener()

    let showTip = wx.getStorageSync('recordTip')
    if (!showTip){
      util.showWindow('语速设置提醒', '朗读语速可在 "首页->个人中心->设置->语速设置" 中进行设置', false, function(){}, function(){}) 
      wx.setStorageSync('recordTip', 1)
    }

    util.isApproved(function (isApproved) {
      that.setData({ isApproved: isApproved })
    })
    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/Forg/getBook',
        {
          session: wx.getStorageSync('session'),
          bookId: bookId,
          record: true,
          shareUserId: that.shareUserId
        },
        function (res) {
          if (res && res.code == 1) {
            let shots = res.data.shots.reverse()
            for (let ii in shots) {
              if (!shots[ii].readTime) {
                shots[ii]['readTime'] = 5
              }
            }
            that.setData(
              {
                book: res.data.book,
                shots: shots,
                pageshow: true
              })
            that.preViewaudioListener()
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
      

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (innerAudioContext){
      innerAudioContext.stop()
      innerAudioContext.destroy()
    }
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

  }
})