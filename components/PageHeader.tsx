export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-4">
      <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
      )}
    </header>
  );
}
