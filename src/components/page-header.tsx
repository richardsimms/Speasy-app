type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-primary-foreground w-full py-12 md:py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="mb-2">
            <h1 className="mb-3 text-5xl font-bold text-white">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-white/70">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
