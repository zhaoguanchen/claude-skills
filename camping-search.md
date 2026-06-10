# Washington State Parks Camping Search

Search for available campsites on washington.goingtocamp.com using Playwright browser automation.

## Usage

`/camping-search <park> <arrival MM/DD> <departure MM/DD> <party_size> [equipment]`

Examples:
- `/camping-search "Deception Pass" 6/13 6/14 2`
- `/camping-search "Deception Pass" 6/13 6/14 2 "1 Tent"`

## Instructions

When this skill is invoked, extract the arguments:
- **park**: park name (default: "Deception Pass")
- **arrival**: arrival date in M/D format (year is always 2026)
- **departure**: departure date in M/D format (year is always 2026)
- **party_size**: number of people (default: 2)
- **equipment**: equipment type string to match (default: "1 Tent")

Then write and run the following Node.js Playwright script at `/Users/gczhao/camping.js`, substituting the arguments:

```js
const { chromium } = require('playwright');

(async () => {
  const PARK = '$PARK';
  const ARRIVAL_LABEL = 'ARRIVAL_ARIA_LABEL'; // e.g. "June 13, 2026"
  const DEPARTURE_LABEL = 'DEPARTURE_ARIA_LABEL'; // e.g. "June 14, 2026"
  const PARTY_SIZE = '$PARTY_SIZE';
  const EQUIPMENT = '$EQUIPMENT';

  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto('https://washington.goingtocamp.com/');
  await page.waitForLoadState('networkidle');

  try {
    const cookieBtn = page.locator('button:has-text("Consent"), button:has-text("Accept")').first();
    if (await cookieBtn.isVisible({ timeout: 3000 })) {
      await cookieBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch {}

  await page.click('text=Camping');
  await page.waitForTimeout(1500);

  // 选公园
  const parkInput = page.locator('#park-autocomplete-input');
  await parkInput.click({ clickCount: 3 });
  await parkInput.fill(PARK);
  await page.waitForTimeout(2000);
  await page.locator('mat-option').filter({ hasText: PARK }).first().click();
  await page.waitForTimeout(1000);
  console.log(`✓ 选择了 ${PARK}`);

  // 选日期（在日历上点击）
  await page.locator('#arrival-date-field').click();
  await page.waitForTimeout(1000);
  await page.locator(`button[aria-label="${ARRIVAL_LABEL}"]`).click();
  await page.waitForTimeout(600);
  await page.locator(`button[aria-label="${DEPARTURE_LABEL}"]`).click();
  await page.waitForTimeout(600);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  console.log(`✓ 日期: ${ARRIVAL_LABEL} → ${DEPARTURE_LABEL}`);

  // 人数
  await page.locator('#party-size-field').click({ clickCount: 3 });
  await page.locator('#party-size-field').fill(String(PARTY_SIZE));
  console.log(`✓ 人数: ${PARTY_SIZE}`);

  // 装备
  await page.locator('#equipment-field').click();
  await page.waitForTimeout(1200);
  await page.locator('mat-option').filter({ hasText: EQUIPMENT }).first().click();
  await page.waitForTimeout(600);
  console.log(`✓ 装备: ${EQUIPMENT}`);

  // 搜索
  await page.locator('button:has-text("Search")').first().click();
  await page.waitForTimeout(6000);
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

  // 切换 List 模式
  await page.locator('button:has-text("List"), a:has-text("List"), [aria-label="List"]').first().click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/gczhao/camping_results.png', fullPage: true });

  // 提取结果
  const bodyText = await page.locator('body').innerText();
  const hasNoSites = bodyText.includes('No Available Sites');
  if (hasNoSites) {
    console.log('❌ 无可用营位');
  } else {
    console.log('✅ 找到可用营位！');
  }

  await page.waitForTimeout(300000);
  await browser.close();
})();
```

After generating the script with the correct values substituted:
1. Run `pkill -f "camping.js" 2>/dev/null` to kill any existing instance
2. Run `node /Users/gczhao/camping.js 2>&1 | tee /tmp/camping_run.log &` to start it
3. Wait for completion using: `until grep -q "可用营位\|Error\|TimeoutError" /tmp/camping_run.log 2>/dev/null; do sleep 3; done`
4. Read `/Users/gczhao/camping_results.png` and report results to the user

## Date aria-label format

Convert M/D input to full label:
- 6/13 → "June 13, 2026"
- 7/4 → "July 4, 2026"

Month mapping: 1=January, 2=February, 3=March, 4=April, 5=May, 6=June, 7=July, 8=August, 9=September, 10=October, 11=November, 12=December
