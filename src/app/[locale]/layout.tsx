import type { Metadata } from "next";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { routing } from "@/libs/I18nRouting";
import { BaseTemplate } from "@/templates/BaseTemplate";
import "@/styles/global.css";

export const metadata: Metadata = {
  icons: [
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: "RootLayout",
  });

  // Check if we're on a marketing route (routes that use dashboard sidebar)
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isMarketingRoute =
    pathname === "/" ||
    pathname === "/about/" ||
    pathname === "/about" ||
    pathname.startsWith("/content/") ||
    // Add locale prefix variations
    pathname.match(/^\/[a-z]{2}$/) ||
    pathname.match(/^\/[a-z]{2}\/$/) ||
    pathname.match(/^\/[a-z]{2}\/about/) ||
    pathname.match(/^\/[a-z]{2}\/content/);

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`}
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider>
          <PostHogProvider>
            {isMarketingRoute ? (
              // Marketing routes: render children directly (they have their own layout with sidebar)
              <div>{props.children}</div>
            ) : (
              // Other routes: use BaseTemplate with navigation
              <BaseTemplate
                leftNav={
                  <>
                    <li>
                      <Link
                        href="/"
                        className="border-none text-gray-700 hover:text-gray-900"
                      >
                        {t("home_link")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/"
                        className="border-none text-gray-700 hover:text-gray-900"
                      >
                        {t("about_link")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/portfolio/"
                        className="border-none text-gray-700 hover:text-gray-900"
                      >
                        {t("portfolio_link")}
                      </Link>
                    </li>
                    <li>
                      <a
                        className="border-none text-gray-700 hover:text-gray-900"
                        href="https://github.com/ixartz/Next-js-Boilerplate"
                      >
                        GitHub
                      </a>
                    </li>
                  </>
                }
                rightNav={
                  <>
                    <li>
                      <Link
                        href="/sign-in/"
                        className="border-none text-gray-700 hover:text-gray-900"
                      >
                        {t("sign_in_link")}
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/sign-up/"
                        className="border-none text-gray-700 hover:text-gray-900"
                      >
                        {t("sign_up_link")}
                      </Link>
                    </li>

                    <li>
                      <LocaleSwitcher />
                    </li>
                  </>
                }
              >
                <div className="py-5 text-xl [&_p]:my-6">{props.children}</div>
              </BaseTemplate>
            )}
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
