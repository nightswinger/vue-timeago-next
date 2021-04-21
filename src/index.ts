import { App, inject, reactive } from "vue";
import Timeago from './Timeago'
import { format, register, TDate, Opts, LocaleFunc, LocaleMap } from 'timeago.js'
import ja from "timeago.js/lib/lang/ja";

export type TTimeago = {
  config: TPluginOptions,
  format: (date: TDate, locale?: string | undefined, opts?: Opts | undefined) => string,
  register: (locale: string, func: LocaleFunc) => void
}

export type TPluginOptions = {
  defaultLocale?: string,
  locales?: LocaleMap,
}

const defaultOptions: TPluginOptions = {
  defaultLocale: 'en_US'
}

const TimeagoSymbol = Symbol()

export function useVueTimeago() {
  const VueTimeago: TTimeago | undefined = inject(TimeagoSymbol)
  if (!VueTimeago) {
    throw new Error('VueTimeago is not installed!')
  }

  return VueTimeago
}

export default {
  install: async (app: App, options: TPluginOptions = {}) => {
    app.component(Timeago.name, Timeago)

    let configOptions: TPluginOptions = options ? { ...defaultOptions, ...options } : defaultOptions
    const VueTimeago: TTimeago = {
      config: reactive(configOptions),
      format,
      register
    }

    VueTimeago.register('ja', ja)

    if (configOptions.locales) {
      for (const [locale, func] of Object.entries(configOptions.locales)) {
        VueTimeago.register(locale, func)
      }
    }

    app.config.globalProperties.$VueTimeago = VueTimeago
    app.provide(TimeagoSymbol, VueTimeago)
  }
}
