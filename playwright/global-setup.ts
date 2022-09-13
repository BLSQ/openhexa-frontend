import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const adminPage = await browser.newPage();
  // ... log in
  await adminPage.context().storageState({ path: "adminStorageState.json" });

  const userPage = await browser.newPage();
  // ... log in
  await userPage.context().storageState({ path: "userStorageState.json" });
  await browser.close();
}

export default globalSetup;
