const { Builder, By, until } = require("selenium-webdriver");

(async function addGoalTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Step 1: Login
    await driver.get("http://localhost:3000/");
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("test");
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("test");
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains("/dashboard"), 5000);

    // Step 2: Add new goal
    await driver.wait(until.elementLocated(By.css('input[placeholder="Goal Title"]')), 5000);
    await driver.findElement(By.css('input[placeholder="Goal Title"]')).sendKeys("Learn Selenium");
    await driver.findElement(By.css('input[placeholder="Description"]')).sendKeys("Practice UI testing");
    await driver.findElement(By.css("select")).sendKeys("Medium");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Step 3: Reload to ensure goals are fetched from backend
    await driver.navigate().refresh();

    // Step 4: Verify the new goal is displayed in the list
    let newGoal = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Learn Selenium')]")),
      5000
    );

    if (newGoal) {
      console.log("✅ Add Goal Test Passed - goal displayed in dashboard");
    } else {
      console.log("❌ Add Goal Test Failed - goal not found");
    }
  } catch (err) {
    console.error("❌ Add Goal Test Failed", err);
  } finally {
    await driver.quit();
  }
})();
