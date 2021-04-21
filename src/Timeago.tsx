import { defineComponent, onMounted, onUnmounted, Ref, ref } from 'vue'
import { useVueTimeago } from '.'

export default defineComponent({
  name: 'Timeago',
  props: {
    autoUpdate: { type: [Boolean, Number], default: true },
    datetime: { type: [String, Number, Date], required: true },
    locale: String
  },
  setup(props) {
    const { config, format } = useVueTimeago()
    const locale = props.locale || config.defaultLocale

    const getTimeAgo = (datetime: string | number | Date) => {
      const tDate = new Date(datetime)
      return format(tDate, locale)
    }

    const timeAgo: Ref<string> = ref(getTimeAgo(props.datetime))

    const updater: Ref<number> = ref(-1)
    const startAutoUpdate = () => {
      if (props.autoUpdate) {
        let interval: number = props.autoUpdate === true ? 60 : props.autoUpdate
        updater.value = setInterval(() => {
          timeAgo.value = getTimeAgo(props.datetime)
        }, interval * 1000)
      }
    }
    const stopAutoUpdate = () => {
      clearInterval(updater.value)
    }

    onMounted(() => {
      startAutoUpdate()
    })

    onUnmounted(() => {
      stopAutoUpdate()
    })

    return {
      timeAgo
    }
  },
  render() {
    return (
      <time datetime={new Date(this.datetime).toISOString()}>
        {this.timeAgo}
      </time>
    )
  }
})