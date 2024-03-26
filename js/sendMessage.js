const esperarPorTempo = require("./esperarUmTempo");

async function sendMessageToWhatsApp(page, number, message, timeout = 60000) {
	const inputSelectors = [
		'::-p-aria(Digite uma mensagem)',
		'footer div.to2l77zo',
		'::-p-xpath(//*[@id="main"]/footer/div[1]/div/span[2]/div/div[2]/div[1]/div[2]/div[1])',
		':scope >>> footer div.to2l77zo'
	];

	const url = `https://web.whatsapp.com/send?phone=${number}`;
	await page.goto(url);

	async function waitForSelectorRace(page, selectors, options) {
		const promises = selectors.map(async selector => await page.waitForSelector(selector, options));

		return Promise.race(promises);
	}

	const messageFieldLocator = await waitForSelectorRace(page, inputSelectors, { timeout: timeout });

	await messageFieldLocator.type(message);

	const delay = Math.floor(Math.random() * 3000) + 1000;
	await esperarPorTempo(delay);

	try {
		await page.waitForSelector(
			"#main > footer > div._ak1k._ahmw.copyable-area > div > span:nth-child(2) > div > div._ak1r > div._ak1t._ak1u > button"
		  );
		  await page.click(
			"#main > footer > div._ak1k._ahmw.copyable-area > div > span:nth-child(2) > div > div._ak1r > div._ak1t._ak1u > button"
		  );
	} catch (error) {
		await page.keyboard.press('Enter');
	}
}

module.exports = sendMessageToWhatsApp;
