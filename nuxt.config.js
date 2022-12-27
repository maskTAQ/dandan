
const  version = '1.4.60';

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: '旦旦医学',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: './favicon.ico' },
      { rel: 'stylesheet', href: './base.css' },
      // { rel: 'stylesheet', href: '/static/base.css' },
      { rel: 'stylesheet', href: './vant.css' },
      // { rel: 'stylesheet', href: '/static/vant.css' },
      { rel: 'stylesheet', href: 'https://unpkg.com/video.js@7.10.2/dist/video-js.min.css' }
    ],
    // script: [{ src: 'http://res.wx.qq.com/open/js/jweixin-1.6.0.js' }]
    script: [{ src: './jssdk.js' }, { src: 'https://unpkg.com/video.js@7.10.2/dist/video.min.js' }, { src: './clipboard.min.js' }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/route.js',
    {
      src: '~plugins/vant.js', ssr: true
    }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: true,
    filenames: {
      app: ({ isDev, isModern }) => isDev ? `[name]${isModern ? '.modern' : ''}.js` : `[name].${version}.js`,
      chunk: ({ isDev, isModern }) => isDev ? `[name]${isModern ? '.modern' : ''}.js` : `[name].${version}.js`,
      css: ({ isDev }) => isDev ? '[name].css' : `[name].${version}.css`,
      img: ({ isDev }) => '[path][name].[ext]',
      font: ({ isDev }) => '[path][name].[ext]',
      video: ({ isDev }) => '[path][name].[ext]'
    },
    // publicPath:'https://test.com'
  },
  router: {
    base: '/h5/'
  },
  generate: {
    dir: 'h5'
  }
}
