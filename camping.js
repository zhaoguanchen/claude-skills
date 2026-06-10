const { chromium } = require('playwright');

// 参数配置
const PARK = process.env.PARK || 'Deception Pass';
const ARRIVAL = process.env.ARRIVAL || 'June 13, 2026';   // e.g. "June 13, 2026"
const DEPARTURE = process.env.DEPARTURE || 'June 14, 2026'; // e.g. "June 14, 2026"
const PARTY_SIZE = process.env.PARTY_SIZE || '2';
const EQUIPMENT = process.env.EQUIPMENT || '1 Tent';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto('https://washington.goingtocamp.com/');
  await page.waitForLoadState('networkidle');

  // 接受 cookie
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

  // 选日期（通过日历点击）
  await page.locator('#arrival-date-field').click();
  await page.waitForTimeout(1000);
  await page.locator(`button[aria-label="${ARRIVAL}"]`).click();
  await page.waitForTimeout(600);
  await page.locator(`button[aria-label="${DEPARTURE}"]`).click();
  await page.waitForTimeout(600);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  console.log(`✓ 日期: ${ARRIVAL} → ${DEPARTURE}`);

  // 人数
  await page.locator('#party-size-field').click({ clickCount: 3 });
  await page.locator('#party-size-field').fill(PARTY_SIZE);
  console.log(`✓ 人数: ${PARTY_SIZE}`);

  // 装备
  await page.locator('#equipment-field').click();
  await page.waitForTimeout(1200);
  await page.locator('mat-option').filter({ hasText: EQUIPMENT }).first().click();
  await page.waitForTimeout(600);
  console.log(`✓ 装备: ${EQUIPMENT}`);

  // 搜索
  await page.locator('button:has-text("Search")').first().click();
  console.log('✓ 点击搜索...');
  await page.waitForTimeout(6000);
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

  // 切换 List 模式
  await page.locator('button:has-text("List"), a:has-text("List"), [aria-label="List"]').first().click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'camping_results.png', fullPage: true });

  // 输出结果
  const bodyText = await page.locator('body').innerText();
  if (bodyText.includes('No Available Sites')) {
    console.log('❌ 无可用营位');
  } else {
    console.log('✅ 找到可用营位！请查看浏览器。');
  }

  // 保持浏览器打开供手动操作
  await page.waitForTimeout(300000);
  await browser.close();
})();
