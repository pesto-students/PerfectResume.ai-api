import { Injectable } from '@nestjs/common';
import { validator } from '@exodus/schemasafe';
import { JSDOM } from 'jsdom';
import { isObject } from 'src/generic/utils';
import puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerHelper {
  browser;
  constructor() {}

  private async getBrowserInstance() {
    if (!this.browser) {
      const options = {
        args: [
          '--disable-extensions',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      };
      this.browser = await puppeteer.launch(options);
    }
    return this.browser;
  }

  private validateData(schema, data) {
    const validate = validator({
      ...schema,
    });
    return validate(data);
  }

  private replacePlaceholders(str, data) {
    const placeholderRegex = /{([\w.-]+)}/g;
    return str.replace(placeholderRegex, (match, key) => {
      let currentValue = data;
      if (isObject(data)) {
        currentValue = data[key];
      }
      if (Array.isArray(data)) {
        currentValue = data[key];
      }

      // Replace with the value; if null or undefined, use an empty string
      return currentValue !== null && currentValue !== undefined
        ? currentValue
        : '';
    });
  }

  createHTMLFromJSON(json, data) {
    let element;

    // Handle blocks
    if (json.type === 'block') {
      const blocksData = data;
      if (blocksData && blocksData.length) {
        const blockJson = { ...json, type: 'element' };
        const blockElements = blocksData.map((blockData) => {
          let blockElement = null;
          if (blockJson.data) {
            if (!this.validateData(blockJson.data.schema, blockData))
              return null;
            const childData = blockJson.data.key
              ? blockData[blockJson.data.key]
              : blockData;
            blockElement = this.createHTMLFromJSON(blockJson, childData);
          } else {
            blockElement = this.createHTMLFromJSON(blockJson, blockData);
          }
          return blockElement;
        });
        return blockElements;
      }
    }

    // Handle element nodes
    if (json.type === 'element') {
      // if (json.data && !validateData(json.data.schema, data)) {
      //   return false;
      // }
      const dom = new JSDOM();
      element = dom.window.document.createElement(json.tagName);

      // Set attributes
      if (json.attributes) {
        for (const attr in json.attributes) {
          element.setAttribute(attr, json.attributes[attr]);
        }
      }

      // Set class names
      if (json.className) {
        element.className = json.className;
      }

      // Set styles
      if (json.styles) {
        element.style.cssText = json.styles;
      }

      // Process children
      if (json.children) {
        json.children.forEach((childJson) => {
          let childElement = null;
          if (childJson.type !== 'block' && childJson.data) {
            if (!this.validateData(childJson.data.schema, data)) return;
            const childData = childJson.data.key
              ? data[childJson.data.key]
              : data;
            childElement = this.createHTMLFromJSON(childJson, childData);
          } else {
            childElement = this.createHTMLFromJSON(childJson, data);
          }

          if (childElement) {
            if (Array.isArray(childElement)) {
              childElement.forEach((child) => {
                if (!child) return;
                element.appendChild(child);
              });
            } else {
              element.appendChild(childElement);
            }
          }
        });
      }
    }
    // Handle text nodes
    else if (json.type === 'text') {
      const content = this.replacePlaceholders(json.content, data);
      const dom = new JSDOM();
      element = dom.window.document.createTextNode(content);
    }

    return element;
  }

  async generatePDF(htmlContent, cssContent) {
    const browser = await this.getBrowserInstance();
    const page = await browser.newPage();

    // Set request interception to avoid loading unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['stylesheet', 'image'].includes(request.resourceType())) {
        request.continue();
      } else {
        request.abort();
      }
    });

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Inject CSS
    await page.addStyleTag({ content: cssContent });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await page.close();
    await browser.close();
    return pdf;
  }

  async build(tempate: any, metaData: any) {
    // merge template with metaData
    // convert mergedTemplate with metaData
    // const mergedTemplate = await this.createHTMLFromJSON(tempate, metaData);
    // convert html to pdf
    this.generatePDF(tempate, '');
    
  }
}
