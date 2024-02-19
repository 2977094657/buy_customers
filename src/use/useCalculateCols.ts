import { computed, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { getItemWidth } from '../utils/itemWidth'
import type {ItemWidthProps, ViewCard, WaterfallProps} from '../types/waterfall'
import type { Nullable } from '../types/util'

export function useCalculateCols(props: {
    readonly align: string | undefined;
    readonly delay: number | undefined;
    readonly crossOrigin: boolean | undefined;
    readonly loadProps: Object | undefined;
    readonly lazyload: boolean | undefined;
    readonly backgroundColor: string | undefined;
    readonly animationDelay: number | undefined;
    readonly animationDuration: number | undefined;
    readonly animationEffect: string | undefined;
    readonly animationPrefix: string | undefined;
    readonly hasAroundGutter: boolean | undefined;
    readonly gutter: number | undefined;
    readonly breakpoints: Object | undefined;
    readonly width: number | undefined;
    readonly imgSelector: string | undefined;
    readonly rowKey: string | undefined;
    readonly list: ViewCard[] | undefined
}) {
  const wrapperWidth = ref<number>(0)
  const waterfallWrapper = ref<Nullable<any>>(null)

  useResizeObserver(waterfallWrapper, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect
    wrapperWidth.value = width
  })

  // 列实际宽度
  const colWidth = computed(() => {
    return getItemWidth(<ItemWidthProps>{
        wrapperWidth: wrapperWidth.value,
        breakpoints: props.breakpoints,
        gutter: props.gutter,
        hasAroundGutter: props.hasAroundGutter,
        initWidth: props.width,
    })
  })

  // 列
  const cols = computed(() => {
    const offset = props.hasAroundGutter ? -props.gutter : props.gutter
    return Math.floor((wrapperWidth.value + offset) / (colWidth.value + props.gutter))
  })

  // 偏移
  const offsetX = computed(() => {
    // 左对齐
    if (props.align === 'left') {
      return 0
    }
    else if (props.align === 'center') {
      // 居中
      const offset = props.hasAroundGutter ? props.gutter : -props.gutter
      const contextWidth = cols.value * (colWidth.value + props.gutter) + offset
      return (wrapperWidth.value - contextWidth) / 2
    }
    else {
      const offset = props.hasAroundGutter ? props.gutter : -props.gutter
      const contextWidth = cols.value * (colWidth.value + props.gutter) + offset
      return (wrapperWidth.value - contextWidth)
    }
  })

  return {
    waterfallWrapper,
    wrapperWidth,
    colWidth,
    cols,
    offsetX,
  }
}
