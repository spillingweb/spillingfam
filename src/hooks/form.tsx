import { fieldContext, formContext } from '@/store/form-context'
import { createFormHook } from '@tanstack/react-form'
import {
  FormInput,
  FormTextArea,
  FormFileInput,
  FormSelect,
  FormCheckbox,
  FormRadioGroup,
  FormAutocomplete,
  FormCalendarSelect,
} from '#/components/ui/form-components'
import { scrollToFirstError } from '@/lib/utils'

const {
  useAppForm: useAppFormBase,
  withForm,
  withFieldGroup,
} = createFormHook({
  fieldComponents: {
    Input: FormInput,
    TextArea: FormTextArea,
    FileInput: FormFileInput,
    Select: FormSelect,
    Checkbox: FormCheckbox,
    RadioGroup: FormRadioGroup,
    Autocomplete: FormAutocomplete,
    CalendarSelect: FormCalendarSelect,
  },
  formComponents: {},
  fieldContext,
  formContext,
})

// Wrap useAppForm to add default onSubmitInvalid handler while preserving all type information
export const useAppForm: typeof useAppFormBase = (options) => {
  const { onSubmitInvalid, ...restOptions } = options

  return useAppFormBase({
    ...restOptions,
    onSubmitInvalid: (context) => {
      // Call custom onSubmitInvalid if provided
      onSubmitInvalid?.(context)

      // Always scroll to first error
      scrollToFirstError()
    },
  })
}

export { withForm, withFieldGroup }
