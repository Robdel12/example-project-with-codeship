const should = require('chai').should()
const puppeteer = require('puppeteer')
const platform = require("os").platform()
const { percySnapshot } = require('@percy/puppeteer')

// We need to change the args passed to puppeteer based on the platform they're using
const puppeteerArgs = /^win/.test(platform) ? [] : [ '--single-process' ]

const TEST_URL = "http://localhost:8000"

describe('TodoMVC', function() {

  let browser = null
  let page = null
  beforeEach(async function() {
    // Create a new Puppeteer browser instace for each test case
    browser = await puppeteer.launch({
      headless: true,
      timeout: 10000,
      args: puppeteerArgs
    })
    page = await browser.newPage()
  })

  afterEach(function() {
    // Close the Puppeteer browser instance.
    browser.close()
  })

  it('Loads the app', async function() {
    await page.goto(TEST_URL)
    await percySnapshot(page, this.test.fullTitle())
    const mainContainer = await page.$('section.todoapp')
    should.exist(mainContainer)
  })

  it('Accepts a new todo', async function() {
    await page.goto(TEST_URL)
    await page.type('.new-todo', 'New fancy todo')
    await page.keyboard.press('Enter')
    await percySnapshot(page, this.test.fullTitle(), {widths: [768, 992, 1200]})

    const todoCount = await page.evaluate(() => document.querySelectorAll('.todo-list li').length)
    todoCount.should.eq(1)
  })
})
