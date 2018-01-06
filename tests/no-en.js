'use strict'

const rule = require('../rules/no-en')
const RuleTester = require('eslint').RuleTester

const error = 'English text in string literals is not allowed'

const ruleTester = new RuleTester()
ruleTester.run('no-en', rule, {
  valid: [
    'invariant(1 == 1, "Assertion message")',
    'console.debug("Debugging message")',
    'console.log("Informational message")',
    'console.warn("Warning message")',
    'console.error("Error message")',
    'throw new Error("Error message")',
    'var e = new Error("Error message")',
    'var x = {"Object key": 42}',
    'var x = {test: "Object value"}',
    'x = 42',
    'x = "42"',
    'var x',
    'var x = 42',
    'var x = "42"',
    'function x() { return }',
    'function x() { return 42 }',
    'function x() { return "42" }',
    'document.addEventListener("click", function(){})',
    'suite("Test suite", function(){})',
    'test("Test something", function(){})',
    'assert.equal(1, 2, "Should be false")',
    'assert(false, "Should be true")'
  ],
  invalid: [
    {
      code: 'el.textContent = "Some message text"',
      errors: [{message: error, type: 'Literal'}]
    },
    {
      code: 'var message = "Some message text"',
      errors: [{message: error, type: 'Literal'}]
    },
    {
      code: 'message = "Some message text"',
      errors: [{message: error, type: 'Literal'}]
    },
    {
      code: 'function x() { return "Some message text" }',
      errors: [{message: error, type: 'Literal'}]
    },
    {
      code: 'displayMessage("Some message text")',
      errors: [{message: error, type: 'Literal'}]
    },
    {
      code: 'list.push("Some message text")',
      errors: [{message: error, type: 'Literal'}]
    }
  ]
})
