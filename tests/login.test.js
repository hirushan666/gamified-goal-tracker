const { Builder, By, until } = require("selenium-webdriver");

(async function loginTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Go to login page
    await driver.get("http://localhost:3000/");

    // Fill username & password
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("test");
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("test");

    // Click Login button
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait until dashboard is loaded
    await driver.wait(until.urlContains("/dashboard"), 5000);

    console.log("✅ Login Test Passed");
  } catch (err) {
    console.error("❌ Login Test Failed", err);
  } finally {
    await driver.quit();
  }
})();
