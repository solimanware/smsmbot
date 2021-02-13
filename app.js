const puppeteer = require("puppeteer-core");
const CronJob = require('cron').CronJob;
const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.port || 3000

app.use(express.static('daily-ayah'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const URL = `http://localhost:${port}`;

async function main() {
    //TODO: you may need to use other configuration or installation for puppeteer
    const browser = await puppeteer.launch({
        executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox']
    })
    const page = await browser.newPage();
    await page.goto(URL);
    await page.waitForTimeout(5000)
    let photo = `Ayah-${Date.now()}`;
    await page.screenshot({ path: `${photo}.png` })
    await page.goto("https://fb.com")
    await login(page);
    await page.waitForTimeout(10000)
    await post(page, "أنا سمسم بوت 💜 اقرأ قرآن وخد بكل حرف حسنة والحسنة بعشر أمثالها 😉", photo)
    await browser.close()
}

main()
const job = new CronJob('0 0 */2 * * *', () => {
    console.log("Started");
    main()
    console.log("Done");
}, null, true, 'Africa/Cairo');

job.start();


const login = async (page) => {
    //TODO: make your own .env file
    await page.type("#email", process.env.FB_USERNAME)
    await page.type("#pass", process.env.FB_PASSWORD)
    await page.keyboard.press("Enter")
}

const post = async (page, msg, photo) => {
    let mindSelector = 'div.k4urcfbm.buofh1pr.j83agx80.ll8tlv6m > div';
    await page.waitForTimeout(10000)
    await page.$eval(mindSelector, elem => elem.click());
    await page.waitForTimeout(10000)
    if (photo) {
        const elementHandle = await page.$("input[type=file]");
        await elementHandle.uploadFile(`${photo}.png`);
    }
    await page.keyboard.type(msg)
    await page.waitForTimeout(2000);
    await page.keyboard.down('Control');
    await page.keyboard.press('Enter'); // character code for enter is 13
    await page.keyboard.up('Control');
    await page.waitForTimeout(20000)
}

const comment = async (page, postID, comment) => {
    let postUrl = `https://m.facebook.com/microsmsmx/posts/${postID}`
    await page.goto(postUrl)
    await page.type('#composerInput', comment)
    await page.waitForTimeout(5000)
    await page.click('button[name="submit"]');
}