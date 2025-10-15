// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { selectors, chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // MY CODE STARTS HERE

  const articleLimit = 100;
  let allArticles = [];

  // function to extract article ID and timestamp
  const extractData = async (article) => {
    const articleId = await article.getAttribute('id');
    const nextSibling = await article.evaluateHandle(node => node.nextElementSibling);
    const ageSpan = await nextSibling.$('span.age');
    let timeStamp = await ageSpan.getAttribute('title');

    timeStamp = timeStamp.split(' ')[1]; //grab the unix timestamp

    console.log({ articleId, timeStamp });
    return { articleId, timeStamp }
  }

  while (allArticles.length <= articleLimit) {
    const articles = await page.$$('tr.athing');
    for (const article of articles) {
      await extractData(article).then(data => 
          allArticles.push(data)
      );
      if (allArticles.length >= articleLimit) break;
    }
    if (allArticles.length >= articleLimit) break;
    await page.locator('a.morelink').click();
    await page.waitForLoadState('networkidle');
  }

  console.log(`Extracted ${allArticles.length} articles`);
  console.log(allArticles[0]);

  await browser.close();
  
  
  
}

(async () => {
  await sortHackerNewsArticles();
})();
