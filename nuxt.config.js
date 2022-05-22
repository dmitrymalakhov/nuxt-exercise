export default {
  head: {
    title: "Nuxt.js starter for CSB",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Official Nuxt.js starter for CodeSandBox"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: "search",
        path: "/search/*",
        component: resolve(__dirname, "pages/index.vue")
      });
    }
  },
  components: true,
  modules: [],
  css: ["~/assets/css/main"],
  plugins: []
};
