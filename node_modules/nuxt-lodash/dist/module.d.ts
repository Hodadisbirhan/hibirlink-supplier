import * as _nuxt_schema from '@nuxt/schema';

interface ModuleOptions {
    /**
     * Prefix to be added before every lodash function
     *
     * `false` to disable uppercasing
     *
     * @defaultValue `use`
     */
    prefix: false | string;
    /**
     * Functions that starts with this keywords will be skipped by prefix
     *
     * `false` to disable uppercasing
     *
     * @defaultValue 'is'
     */
    prefixSkip: string | string[] | false;
    /**
     * Array of lodash funcions to be exluded from auto-imports
     *
     * @defaultValue []
     */
    exclude: string[];
    /**
     * Iterable of string pairs to alias each function
     *
     * @defaultValue []
     */
    alias: Iterable<[string, string]>;
    /**
     * Upper case first letter after prefix
     *
     * `false` to disable uppercasing
     *
     * @defaultValue true
     */
    upperAfterPrefix: boolean;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { type ModuleOptions, _default as default };
