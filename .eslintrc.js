module.exports = {
  rules: {
    // 要求使用分号，但不强制报错
    'semi': 'warn',
    // 允许使用双引号和单引号
    'quotes': ['warn', 'double', { 'allowTemplateLiterals': true, 'avoidEscape': true }]
  }
} 