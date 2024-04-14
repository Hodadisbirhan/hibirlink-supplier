import { defineNuxtModule, createResolver, addImports } from '@nuxt/kit';
import * as lodash from 'lodash-es';

const excludeDefaults = [
  "wrapperValue",
  "wrapperToIterator",
  "wrapperReverse",
  "wrapperPlant",
  "wrapperNext",
  "wrapperLodash",
  "wrapperCommit",
  "wrapperChain",
  "wrapperAt",
  "templateSettings",
  "toIterator",
  "VERSION",
  "lodash",
  "value",
  "valueOf",
  "toJSON",
  "thru",
  "plant",
  "next",
  "default",
  "commit",
  "head"
];

const module = defineNuxtModule({
  meta: {
    name: "nuxt-lodash",
    configKey: "lodash",
    compatibility: {
      nuxt: "^3.0.0"
    }
  },
  defaults: {
    prefix: "use",
    prefixSkip: "is",
    exclude: [],
    alias: [],
    upperAfterPrefix: true
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const aliasMap = new Map(options.alias);
    const excludes = [...options.exclude, ...excludeDefaults];
    const prefixSkip = options.prefixSkip ? lodash.isArray(options.prefixSkip) ? options.prefixSkip : [options.prefixSkip] : [];
    for (const name of Object.keys(lodash)) {
      if (!excludes.includes(name)) {
        const alias = aliasMap.has(name) ? aliasMap.get(name) : name;
        const prefix = !prefixSkip.some((key) => alias.startsWith(key)) && options.prefix || "";
        const as = prefix ? prefix + (options.upperAfterPrefix ? lodash.upperFirst(alias) : alias) : alias;
        addImports({ name, as, from: resolve("./runtime/lodash") });
      }
    }
  }
});

export { module as default };
