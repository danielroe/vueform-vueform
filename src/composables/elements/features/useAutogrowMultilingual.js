import { onMounted } from 'composition-api'
import useAutogrow from './useAutogrow'

export default function useAutogrowMultilingual (props, context, dependencies)
{
  // ============ DEPENDENCIES ============

  const form$ = dependencies.form$
  const { autogrow, rows, autosize } = useAutogrow(props, context, dependencies)

  // =============== HOOKS ================

  onMounted(() => {
    form$.value.on('language', () => {
      autosize()
    })
  })

  return {
    autogrow,
    rows,

    autosize,
  }
}