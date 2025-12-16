type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="w-full ">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col space-y-4">
          <div className="mb-2">
            <h1 className="mb-4 text-left font-serif text-2xl leading-tight text-white md:text-4xl">
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
