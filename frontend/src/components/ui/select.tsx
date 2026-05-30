import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100", className)} {...props}>
    {children}
  </div>
))
SelectItem.displayName = "SelectItem"

const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm", className)} {...props}>
    {children}
  </div>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(({ className, placeholder, ...props }, ref) => (
  <span ref={ref} className={cn("text-sm", className)} {...props}>{placeholder}</span>
))
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-slate-950 shadow-md", className)} {...props}>
    {children}
  </div>
))
SelectContent.displayName = "SelectContent"

function collectSelectItems(node: React.ReactNode, out: React.ReactElement<SelectItemProps>[]) {
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return
    if (child.type === SelectItem) {
      out.push(child as React.ReactElement<SelectItemProps>)
      return
    }
    const grandchildren = (child.props as { children?: React.ReactNode })?.children
    if (grandchildren !== undefined) {
      collectSelectItems(grandchildren, out)
    }
  })
}

function findPlaceholder(node: React.ReactNode): string | undefined {
  let placeholder: string | undefined
  React.Children.forEach(node, (child) => {
    if (placeholder !== undefined) return
    if (!React.isValidElement(child)) return
    if (child.type === SelectValue) {
      placeholder = (child.props as SelectValueProps).placeholder
      return
    }
    const grandchildren = (child.props as { children?: React.ReactNode })?.children
    if (grandchildren !== undefined) {
      const nested = findPlaceholder(grandchildren)
      if (nested !== undefined) placeholder = nested
    }
  })
  return placeholder
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, onValueChange, onChange, value, defaultValue, ...props }, ref) => {
  const items: React.ReactElement<SelectItemProps>[] = []
  collectSelectItems(children, items)
  const placeholder = findPlaceholder(children)
  const hasEmptyOption = items.some((it) => it.props.value === "")
  const showPlaceholder = placeholder !== undefined && !hasEmptyOption

  return (
    <select
      className={cn("flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400", className)}
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => { onChange?.(e); onValueChange?.(e.target.value); }}
      {...props}
    >
      {showPlaceholder && (
        <option value="">{placeholder}</option>
      )}
      {items.map((item, i) => (
        <option key={(item.key as string | number | null) ?? i} value={item.props.value}>
          {item.props.children as React.ReactNode}
        </option>
      ))}
    </select>
  )
})
Select.displayName = "Select"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
