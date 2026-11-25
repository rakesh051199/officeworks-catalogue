import { FakeStoreProductSource } from "./adapters/fakeStore/FakeStoreProductSource.js";
import { SmtpEmailProvider } from "./adapters/smtp/SmtpEmailProvider.js";
import { loadConfig } from "./config.js";
import { createApp } from "./http/createApp.js";

const config = loadConfig();
const app = createApp({
  config,
  products: new FakeStoreProductSource(config.fakeStoreBaseUrl),
  email: new SmtpEmailProvider(config.smtpHost, config.smtpPort)
});

app.listen(config.port, () => {
  console.log(`Catalogue API listening on ${config.port}`);
});
