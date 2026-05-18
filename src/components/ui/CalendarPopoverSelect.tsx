import { CalendarSearchIcon } from "lucide-react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./Popover";
import { Calendar } from "./Calendar";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./InputGroup";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";
import { useMediaQuery } from "usehooks-ts";
import { useTypedDate } from "react-typed-date";
import { Button } from "./Button";
import { cn } from "@/utils/styles";
import type { DayPicker } from "react-day-picker";
import FormInput from "./form-components/FormInput";

type CalendarPopoverSelectProps = {
  id?: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabledBefore?: Date;
  disabledAfter?: Date;
  placeholder?: string;
  onBlur?: () => void;
  readOnly?: boolean;
  className?: string;
  error?: string;
} & React.ComponentProps<typeof DayPicker>;

const CalendarPopoverSelect = ({
  id,
  date,
  setDate,
  disabledBefore,
  disabledAfter,
  placeholder = "Elegir fecha",
  onBlur,
  readOnly = false,
  className,
  error,
  ...calendarProps
}: CalendarPopoverSelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { inputProps } = useTypedDate({
    value: date,
    onChange: setDate,
    format: "DD-MM-YYYY",
  });

  const disabledDates = [];

  if (disabledBefore) {
    disabledDates.push({ before: disabledBefore });
  }

  if (disabledAfter) {
    disabledDates.push({ after: disabledAfter });
  }

  const content = (
    <Calendar
      {...calendarProps}
      mode="single"
      disabled={disabledDates}
      selected={date}
      reverseYears
      reverseMonths
      showOutsideDays={true}
      captionLayout="dropdown"
      startMonth={disabledBefore ? disabledBefore : undefined}
      onSelect={(date) => {
        setDate(date);
        setOpen(false);
      }}
      defaultMonth={date}
      endMonth={disabledAfter ? disabledAfter : undefined}
      className={
        isMobile ? "mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]" : ""
      }
    />
  );

  // Return simple input without icon if readOnly
  if (readOnly) {
    return (
      <FormInput
        name={id || "dateField"}
        value={inputProps.value}
        readOnly
        className={cn(className)}
      />
    );
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} autoFocus={open}>
        <DrawerTrigger asChild disabled={readOnly}>
          <button
            id={id}
            type="button"
            aria-invalid={!!error}
            className={cn(
              "flex items-center justify-between gap-1 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none h-9 font-normal @container min-w-27",
              "border-input dark:bg-input/30 dark:hover:bg-input/50",
              "transition-[color,box-shadow,border-color]",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
              !date ? "text-muted-foreground" : "",
              className,
            )}
            onBlur={onBlur}
            disabled={readOnly}
          >
            {inputProps.value || "Elegir fecha"}
            <CalendarSearchIcon className="size-4 text-muted-foreground hidden @min-[85px]:block" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="p-0 w-auto overflow-hidden">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{placeholder}</DrawerTitle>
            <DrawerDescription>
              Selecciona una fecha del calendario
            </DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover
      open={readOnly ? false : open}
      onOpenChange={setOpen}
      modal={false}
    >
      <PopoverAnchor asChild>
        <InputGroup
          className={cn(
            "flex cursor-pointer select-none focus:outline-none",
            !date ? "text-muted-foreground" : "",
            className,
          )}
        >
          <InputGroupInput
            id={id}
            {...inputProps}
            onBlur={onBlur}
            disabled={readOnly}
            aria-invalid={!!error}
          />
          <InputGroupAddon align="inline-end">
            <PopoverTrigger asChild disabled={readOnly}>
              <Button
                type="button"
                variant="ghost"
                className="hover:bg-transparent! opacity-50 hover:opacity-100 p-0! mr-1"
                disabled={readOnly}
              >
                <CalendarSearchIcon className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>
          </InputGroupAddon>
        </InputGroup>
      </PopoverAnchor>
      <PopoverContent
        collisionPadding={16}
        className="p-0 w-full min-w-(--radix-select-trigger-width,8rem)"
        align="end"
      >
        {content}
      </PopoverContent>
    </Popover>
  );
};

export default CalendarPopoverSelect;
