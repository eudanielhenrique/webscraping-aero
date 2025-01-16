const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const scrapeOfertas = async ({ origin, destination, departureDate }) => {
  const browser = await puppeteer.launch({
    headless: true, // Use headless para ambientes de produção
     args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
      ],
    executablePath: process.env.CHROMIUM_PATH || null, // Railway define CHROMIUM_PATH
  });

  const page = await browser.newPage();

  try {
    await page.evaluateOnNewDocument(() => {
      delete Function.prototype.toString;
    });

    console.log('Acessando o site...');
    await page.goto('https://livelo.com.br', { waitUntil: 'networkidle2' });

    console.log('Simulando comportamento humano...');
    await page.mouse.move(100, 100);
    await delay(6000);

    console.log('Aguardando a página carregar');
    await page.waitForSelector('img#img-brand');

    console.log('Capturando os dots');
    const dotsSelector = `div#owl-dots--default > button[aria-label*="Slide"]`;
    const dots = await page.$$(dotsSelector);
    for (const element of dots) {
      await element.click();
      await delay(500);
    }
    await delay(2000);

    // Mock retorno
    console.log('Fazendo o Mock do retorno');
    const messages = ['Extra 5 pontos', 'Amazon 3 pontos', 'Carrefour 10 pontos'];
    const infos = messages.map((m) => `${m.trim()}`);

    await delay(5000);

    return { result: infos };
  } catch (error) {
    console.error('Erro durante o scraping:', error);
    throw error;
  } finally {
    console.log('Fechando o navegador...');
    await browser.close();
  }
};

module.exports = { scrapeOfertas };
