// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { selectors, chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const articles = await page.$$('tr.athing');
  const articleData = [];
  
  for (const article of articles) {
    
    const articleId = await article.getAttribute('id');
    const nextSibling = await article.evaluateHandle(node => node.nextElementSibling);
    const ageSpan = await nextSibling.$('span.age');
    let timeStamp = await ageSpan.getAttribute('title');

    timeStamp = timeStamp.split(' ')[1]; //grab the unix timestamp

    articleData.push({ articleId, timeStamp });
    console.log({ articleId, timeStamp });
  }


  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
