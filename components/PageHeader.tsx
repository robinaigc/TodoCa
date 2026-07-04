export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-5">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">{title}</h1>
      {subtitle && (
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{subtitle}</p>
      )}
    </header>
  );
}
