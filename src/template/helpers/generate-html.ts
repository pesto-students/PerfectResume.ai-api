import { Injectable } from '@nestjs/common';
import { ajvValidator } from './validator.helper';
import { JSDOM } from 'jsdom';
import { isObject } from 'src/generic/utils';

@Injectable()
export class GenerateHtml {
  private dom = new JSDOM();
  private document = this.dom.window.document;

  private validateData(schema: object, data: object | []) {
    const validate = ajvValidator({
      ...schema,
    });
    return validate(data);
  }

  private replacePlaceholders(str: string, data: any) {
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
      element = this.document.createElement(json.tagName);

      // Set attributes
      if (json.attributes) {
        for (const attr in json.attributes) {
          element.setAttribute(attr, json.attributes[attr]);
        }
      }

      if (json.inlineStyle) {
        element.style.cssText = json.inlineStyle;
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
      element = this.document.createTextNode(content);
    }

    return element;
  }

  serializeHtml(rootElement: HTMLElement): string {
    // Use jsdom's serialize method to convert the document to HTML string
    return rootElement.outerHTML;
  }

  async build(tempate: any, metaData: any) {
    // merge template with metaData
    const mergedTemplate = await this.createHTMLFromJSON(tempate, metaData);
    const htmlString = this.serializeHtml(mergedTemplate);
    return htmlString;
  }
}
