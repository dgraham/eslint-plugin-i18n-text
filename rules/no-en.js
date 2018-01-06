'use strict'

const message = 'English text in string literals is not allowed'

function isEnglish(value) {
  return typeof value === 'string' && /^[A-Z][a-z]+\s/.test(value)
}

function isConsole(node) {
  return (
    node.callee.type === 'MemberExpression' &&
    node.callee.object.name === 'console'
  )
}

function isInvariant(node) {
  return node.callee.type === 'Identifier' && node.callee.name === 'invariant'
}

module.exports = function(context) {
  return {
    AssignmentExpression: function(node) {
      if (node.right.type === 'Literal' && isEnglish(node.right.value)) {
        context.report({node: node.right, message})
      }
    },
    CallExpression: function(node) {
      if (isConsole(node)) return
      if (isInvariant(node)) return

      for (const arg of node.arguments) {
        if (arg.type === 'Literal' && isEnglish(arg.value)) {
          context.report({node: arg, message})
        }
      }
    },
    ReturnStatement: function(node) {
      if (
        node.argument &&
        node.argument.type === 'Literal' &&
        isEnglish(node.argument.value)
      ) {
        context.report({node: node.argument, message})
      }
    },
    VariableDeclarator: function(node) {
      if (
        node.init &&
        node.init.type === 'Literal' &&
        isEnglish(node.init.value)
      ) {
        context.report({node: node.init, message})
      }
    }
  }
}

module.exports.schema = []
