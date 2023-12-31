import { Injectable } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { GenerateHtml } from './generate-html';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class PuppeteerHelper {
  browser: Browser;
  private readonly cssContent: string;

  constructor(private readonly generateHtml: GenerateHtml) {
    this.cssContent = readFileSync(
      join(__dirname, '../../../public/tailwind.min.css'),
      'utf8',
    );
  }

  private async getBrowserInstance() {
    // if (!this.browser) {
    const options = {
      executablePath: `/usr/bin/google-chrome`,
      headless: 'new',
      args: [
        '--disable-extensions',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
      ],
    };
    this.browser = await puppeteer.launch(options);
    // }
    return this.browser;
  }

  async loadPage() {
    const browser = await this.getBrowserInstance();
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['stylesheet', 'image'].includes(request.resourceType())) {
        request.continue();
      } else {
        request.abort();
      }
    });
    return page;
  }

  async generatePDF(template: object, metaData: object) {
    const htmlString = await this.generateHtml.build(template, metaData);
    console.time('page');
    const page = await this.loadPage();
    console.timeEnd('page');
    await page.setContent(htmlString, { waitUntil: 'networkidle0' });
    // Inject CSS
    await page.addStyleTag({
      content: this.cssContent,
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await page.close();
    await this.browser.close();
    return pdf;
  }
}
