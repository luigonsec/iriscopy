const path = require("path");

module.exports = {
  devServer: {
    historyApiFallback: {
      disableDotRule: true,
      htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
    },
  },
};
