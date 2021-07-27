class Config {
  debug = true;

  mixer = {
    address: "Mixer",
    commission: 0.03,
    timeout: 3000,
    host: "localhost",
    port: 5000,
    url: "",
    batchInterval: 20000,
    payInterval: 10000,
  };

  verify = {
    timeout: 3000,
    tries: 10,
  };

  xcoin = {
    host: "localhost",
    port: 4000,
    url: "",
  };

  web = {
    host: "localhost",
    port: 3000,
    url: "",
  };

  constructor() {
    this.xcoin.url = `http://${this.xcoin.host}:${this.xcoin.port}`;
    this.web.url = `http://${this.web.host}:${this.web.port}`;
    this.mixer.url = `http://${this.mixer.host}:${this.mixer.port}`;
  }
}

const config = new Config();

export default config;
