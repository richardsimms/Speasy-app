type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="w-full py-12 md:py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 pb-32">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="mb-2">
            <h1 className="mb-4 text-left text-4xl leading-tight font-bold text-white md:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="leading-relaxed text-white/90">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
