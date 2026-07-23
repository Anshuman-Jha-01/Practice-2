const puppeteer = require("puppeteer");

async function main() {
  const browser = await puppeteer.launch({ headless: false }); // visible for fun
  const page = await browser.newPage();

  // Step 1: Scrape trending movies
  await page.goto("https://www.imdb.com/chart/moviemeter/");

  await page.waitForNavigation();

  const movies = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".ipc-title__text"))
      .map((e) => {
        return e.innerText;
      })
      .slice(2, 6);
  });

  console.log("Trending movies:", movies);

  // Step 2: Search trailers on YouTube
  for (let movie of movies) {
    await page.goto("https://www.youtube.com");
    await page.type(
      ".ytSearchboxComponentInput.yt-searchbox-input.title",
      `${movie} trailer`,
    );
    await page.keyboard.press("Enter");
    await page.waitForSelector("ytd-video-renderer", { timeout: 5000 });
    await page.click("ytd-video-renderer a#thumbnail");

    await new Promise((resolve) => setTimeout(resolve, 30000)); // wait
  }

  await browser.close();
}

main();
