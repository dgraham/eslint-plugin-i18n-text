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

function isSuite(node) {
  return node.callee.type === 'Identifier' && node.callee.name === 'suite'
}

function isTest(node) {
  return node.callee.type === 'Identifier' && node.callee.name === 'test'
}

function isAssert(node) {
  const direct =
    node.callee.type === 'Identifier' && node.callee.name === 'assert'
  const member =
    node.callee.type === 'MemberExpression' &&
    node.callee.object.name === 'assert'
  return direct || member
}

function matchesExcludesOption(node, context) {
  if (!context.options[0] || !context.options[0].excludes) {
    return false
  }

  const excludes = context.options[0].excludes
  return excludes.some(exclude => {
    if (exclude.includes('.')) {
      const parts = exclude.split('.')
      const lastPart = parts.shift()
      let currentNode = node.callee
      for (const part of parts.reverse()) {
        if (!currentNode.property || part !== currentNode.property.name) {
          return false
        }
        currentNode = currentNode.object
      }

      return currentNode.name === lastPart
    }

    const direct =
      node.callee.type === 'Identifier' && node.callee.name === exclude
    const member =
      node.callee.type === 'MemberExpression' &&
      node.callee.object.name === exclude
    const child =
      node.callee.type === 'MemberExpression' &&
      node.callee.property.name === exclude
    return direct || member || child
  })
}

module.exports = function (context) {
  return {
    LogicalExpression: function (node) {
      if (node.right.type === 'Literal' && isEnglish(node.right.value)) {
        context.report({node: node.right, message})
      } else if (node.right.type === 'TemplateLiteral') {
        if (node.right.quasis.some(el => isEnglish(el.value.raw))) {
          context.report({node: node.right, message})
        }
      }
    },
    AssignmentExpression: function (node) {
      if (node.right.type === 'Literal' && isEnglish(node.right.value)) {
        context.report({node: node.right, message})
      } else if (node.right.type === 'TemplateLiteral') {
        if (node.right.quasis.some(el => isEnglish(el.value.raw))) {
          context.report({node: node.right, message})
        }
      }
    },
    CallExpression: function (node) {
      if (isConsole(node) || isInvariant(node)) return
      if (isSuite(node) || isTest(node) || isAssert(node)) return
      if (matchesExcludesOption(node, context)) return

      for (const arg of node.arguments) {
        if (arg.type === 'Literal' && isEnglish(arg.value)) {
          context.report({node: arg, message})
        } else if (arg.type === 'TemplateLiteral') {
          if (arg.quasis.some(el => isEnglish(el.value.raw))) {
            context.report({node: arg, message})
          }
        }
      }
    },
    ReturnStatement: function (node) {
      if (!node.argument) return

      if (node.argument.type === 'Literal' && isEnglish(node.argument.value)) {
        context.report({node: node.argument, message})
      } else if (node.argument.type === 'TemplateLiteral') {
        if (node.argument.quasis.some(el => isEnglish(el.value.raw))) {
          context.report({node: node.argument, message})
        }
      }
    },
    VariableDeclarator: function (node) {
      if (!node.init) return

      if (node.init.type === 'Literal' && isEnglish(node.init.value)) {
        context.report({node: node.init, message})
      } else if (node.init.type === 'TemplateLiteral') {
        if (node.init.quasis.some(el => isEnglish(el.value.raw))) {
          context.report({node: node.init, message})
        }
      }
    }
  }
}

module.exports.schema = [
  {
    type: 'object',
    properties: {
      excludes: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }
  }
]
