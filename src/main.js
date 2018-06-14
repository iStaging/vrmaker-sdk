import Vue from 'vue'
import axios from 'axios'
import VueI18n from 'vue-i18n'
import messages from '@/messages'
import store from '@/store'
import App from '@/App.vue'
import { DEFAULT_SETTING } from '@/api/constants'
import { clone } from '@/api/utils'

// Vue.use(VueAxios, axios)
Vue.use(VueI18n)
export let i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true
})
class VRViewer {
  constructor () {
    this.app = null
  }

  init (config) {
    // console.log('config:', config)
    i18n = new VueI18n({
      locale: config.lang,
      fallbackLocale: 'en',
      messages,
      silentTranslationWarn: true
    })
    this.initData(config)
    this.initConfig(config)
    this.app = new Vue({
      el: config.el,
      store,
      i18n,
      render: h => h(App)
    }).$mount()
    // console.log('vrviewer app:', this.app)
  }

  destroy () {
    if (this.app) {
      this.app.$destroy()
      this.app.$el.childNodes.forEach(childNode => {
        childNode.remove()
      })
      this.app = null
    }
  }

  initData (config) {
    if (typeof store.resetState === 'function') {
      store.resetState()
    }
    store.dispatch('importPanoCollection', clone(config.panoCollection))
    store.dispatch('importPanoramas', clone(config.panoCollection.panoramas))
  }

  initConfig (config) {
    store.dispatch('importSetting', config.setting)
  }

  onToggleFloorplan () {
    store.dispatch('toggleFloorplan')
  }

  onEnterFullscreen () {
    store.dispatch('enterFullscreen')
  }

  onExitFullscreen () {
    store.dispatch('exitFullscreen')
  }

  onTogglePanoramasList () {
    store.dispatch('togglePanoramasList')
  }

  onToggleShare () {
    store.dispatch('toggleShare')
  }
}

// Vue.config.productionTip = false
// Vue.config.debug = false
// Vue.config.devtools = false
// Vue.config.silent = true

if (process.env.NODE_ENV === 'development') {
  const url = 'http://evs.c6bfd9b3f17f94cb18b5f72740b1bc300.cn-hangzhou.alicontainer.com'
  axios({
    method: 'get',
    url: `${url}/api/v1/openlink/pc_63739fd9-3290-4230-9462-d4973e072cbc`
  }).then(resp => {
    const panoCollection = resp.data
    const vrViewer = new VRViewer()
    let config = {
      el: '#vrviewer-sdk',
      lang: 'zh-cn',
      setting: DEFAULT_SETTING,
      panoCollection
    }
    vrViewer.init(config)
  }).catch(error => {
    console.log(error)
  })
}

window.VRViewer = new VRViewer()
export default VRViewer
