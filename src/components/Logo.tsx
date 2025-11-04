import clsx from "clsx"

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={clsx(
      className,
      "font-(family-name:--font-poiret) tracking-tight text-body",
    )}>
      L<span className="text-indigo-400 ">A</span>IN
    </div>
  )
}