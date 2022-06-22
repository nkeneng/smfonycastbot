const puppeteer = require('puppeteer')

const tutorials = ['https://symfonycasts.com/screencast/turbo']
const username = ""
const password = ""

async function login(browser) {
    const page = await browser.newPage()
    await page.goto('https://symfonycasts.com/login')

    await page.waitForSelector('.login form #email')

    await page.type('.login form #email', username)
    await page.type('.login form #password', password)

    await page.click('.login form button')

    await page.waitForSelector('body')

    await page.close()
}

async function download(list, browser) {
    if (list.length > 0) {
        for (const item of list) {
            let lessonPage = await browser.newPage()
            await lessonPage.goto(item, {waitUntil: 'load'})
            await lessonPage.click('#downloadDropdown')
            await lessonPage.click('.dropdown-menu span:nth-of-type(2) a')
            await new Promise(res => {
                setTimeout(res, 3000);
            });
            await lessonPage.close()
        }
    }
    return item;
}

let load = async () => {

    const browser = await puppeteer.launch({headless: false})

    await login(browser);

    for (const element of tutorials) {
        let tutoPage = await browser.newPage()

        await tutoPage.goto(element, {waitUntil: 'load'})

        await tutoPage.waitForSelector('.chapter-list')

        const list = await tutoPage.evaluate(() => {
            let dataElements = document.querySelectorAll('.chapter-list li a.p-4.d-block')
            let data = []
            dataElements.forEach(el => {
                data.push(el.href)
            })
            return data
        })
        await download(list, browser);
        await tutoPage.close()
    }
}

load().then(r => console.log("finished"))
