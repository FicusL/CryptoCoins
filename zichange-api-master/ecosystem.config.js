module.exports = {
  apps : [
    {
      name: "zichange.io",
      script: "./dist/main.js",
      watch: false,
      env: {
        "NODE": "development",
      },
      env_production: {
        "NODE": "production",
      }
    }
  ]
};