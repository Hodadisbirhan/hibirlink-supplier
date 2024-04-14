
import { ModuleOptions } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['lodash']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['lodash']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['lodash']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['lodash']?: ModuleOptions }
}


export { ModuleOptions, default } from './module'
