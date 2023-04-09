/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
module.exports = {
  i18n: {
    locales: ["en", "vi"],
    defaultLocale: "en",
    localePath: path.resolve('./public/locales')
  },
};
