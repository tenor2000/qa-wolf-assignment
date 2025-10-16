// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

// *** MY CODE STARTS HERE ***

  // Set the limit of articles to extract
  const articleLimit = 100;
  let allArticles = [];

  // function to extract article ID and timestamp
  const extractData = async (article) => {
    const articleId = await article.getAttribute('id');
    const nextSibling = await article.evaluateHandle(node => node.nextElementSibling);
    const ageSpan = await nextSibling.$('span.age');
    let timeStamp = await ageSpan.getAttribute('title');

    // grab the unix timestamp for easier calculation, not the datetime string
    timeStamp = timeStamp.split(' ')[1]; 

    // console.log({ articleId, timeStamp });
    return { articleId, timeStamp }
  }

  // function to validate timestamp
  const validateTimeStampOrder = (articles) => {
    let currentTimestamp = parseInt(articles[0].timeStamp);
    for (const article of articles) {
      article.timeStamp = parseInt(article.timeStamp);
      if (article.timeStamp > currentTimestamp) {
        console.error(`Timestamp order incorrect: ${article.timeStamp} is greater than ${currentTimestamp}`);
        return false;
      }
      currentTimestamp = article.timeStamp;
    }
    return true;
  }

  // Driver code
  while (allArticles.length < articleLimit) {
    const articles = await page.$$('tr.athing');
    for (const article of articles) {
      await extractData(article).then(data => 
          allArticles.push(data)
      );
      if (allArticles.length >= articleLimit) break;
    }
    if (allArticles.length < articleLimit) {
      await page.locator('a.morelink').click();
      await page.waitForLoadState('networkidle');
    }
  }

  const isValid = validateTimeStampOrder(allArticles);

  console.log(`Extracted ${allArticles.length} articles from Hacker News`);
  console.log(isValid ? 'Timestamps are in order, newest to oldest' : 'Timestamps are NOT in correct order');

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
