const { override, addBabelPlugin, addDecoratorsLegacy, disableEsLint } = require("customize-cra");

const addProposalClassProperties = () => config => addBabelPlugin(["@babel/plugin-proposal-class-properties", { loose: true }])(config);
const addReactIntl = (reactIntlPluginOptions = {}) => config => addBabelPlugin(['react-intl', reactIntlPluginOptions])(config);


module.exports = override(
  // MobX support
  addDecoratorsLegacy(),
  addProposalClassProperties(),
  disableEsLint(),
  addReactIntl({
    messagesDir: 'messages',
    extractSourceLocation: true,
  }),
);