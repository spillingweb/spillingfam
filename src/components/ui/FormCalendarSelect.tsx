import { formatLocalDate, parseLocalDate } from "@/utils/dates";
import CalendarPopoverSelect from "../CalendarPopoverSelect";
import { Field, FieldDescription, FieldError, FieldLabel } from "../Field";

type FormCalendarSelectProps = {
  name: string;
  label?: string;
  value?: string;
  error?: string;
  description?: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  disabledAfter?: Date;
  disabledBefore?: Date;
  readOnly?: boolean;
  className?: string;
  onlyDate?: boolean;
};

const FormCalendarSelect = ({
  name,
  label,
  value,
  error,
  onValueChange,
  description,
  onBlur,
  disabledAfter,
  disabledBefore,
  readOnly = false,
  className,
  onlyDate = true,
}: FormCalendarSelectProps) => {

  const dateValue = value ? (onlyDate ? parseLocalDate(value) : new Date(value)) : undefined;

  const handleDateChange = (date: Date | undefined) => {
    onValueChange(date ? (onlyDate ? formatLocalDate(date) : date.toISOString()) : "");
  };

  return (
    <Field>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <CalendarPopoverSelect
        id={name}
        date={dateValue}
        setDate={handleDateChange}
        disabledAfter={disabledAfter}
        disabledBefore={disabledBefore}
        onBlur={onBlur}
        readOnly={readOnly}
        className={className}
        error={error}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};

export default FormCalendarSelect;
