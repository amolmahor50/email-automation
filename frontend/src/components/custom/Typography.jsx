import { cn } from "@/lib/utils";

export function TypographyH1({ children, className }) {
  return (
    <h1
      className={cn(
        "text-3xl sm:text-4xl font-bold tracking-tight text-balance",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className }) {
  return (
    <h2
      className={cn("sm:text-3xl text-2xl font-bold tracking-tight", className)}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className }) {
  return (
    <h3
      className={cn(
        "sm:text-2xl text-lg font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({ children, className }) {
  return (
    <h4
      className={cn(
        "sm:text-xl text-md font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  );
}

export function TypographyH5({ children, className }) {
  return (
    <h5
      className={cn(
        "sm:text-lg text-base font-medium tracking-tight",
        className
      )}
    >
      {children}
    </h5>
  );
}

export function TypographyH6({ children, className }) {
  return (
    <h6
      className={cn(
        "sm:text-md text-sm font-semibold tracking-normal",
        className
      )}
    >
      {children}
    </h6>
  );
}

export function TypographyMuted({ children, className }) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>{children}</p>
  );
}

export function TypographyP({ children, className }) {
  return <p className={cn("leading-7", className)}>{children}</p>;
}

export function TypographyBlockquote({ children, className }) {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
      {children}
    </blockquote>
  );
}

export function TypographyList({ items = [], className }) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function TypographyInlineCode({ children, className }) {
  return (
    <code
      className={cn(
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
    >
      {children}
    </code>
  );
}

export function TypographyLead({ children, className }) {
  return (
    <p className={cn("text-muted-foreground text-base sm:text-lg", className)}>
      {children}
    </p>
  );
}

export function TypographyLarge({ children, className }) {
  return (
    <div className={cn("sm:text-lg text-base font-semibold", className)}>
      {children}
    </div>
  );
}

export function TypographySmall({ children, className }) {
  return (
    <small className={cn("text-sm leading-none font-medium", className)}>
      {children}
    </small>
  );
}

export function TypographyTable({ headers, rows, className }) {
  return (
    <div
      className={cn(
        "w-full rounded-md border shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="grid grid-cols-2 bg-muted text-sm font-semibold px-4 py-2 border-b">
        {headers.map((header, i) => (
          <div key={i}>{header}</div>
        ))}
      </div>
      {rows.map((row, index) => (
        <div
          key={index}
          className={`grid grid-cols-2 px-4 py-3 text-sm border-b ${
            index % 2 === 0 ? "bg-muted/20" : "bg-background"
          }`}
        >
          <div className="font-medium text-muted-foreground">{row.module}</div>
          <div className="grid gap-2">{row.content}</div>
        </div>
      ))}
    </div>
  );
}
