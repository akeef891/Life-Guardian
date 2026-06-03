type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-6 min-w-0 sm:mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl break-words text-base text-muted sm:text-lg">{description}</p>
      )}
    </header>
  );
}
