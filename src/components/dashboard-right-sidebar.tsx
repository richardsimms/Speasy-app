'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/libs/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function DashboardRightSidebar() {
  const marketData = [
    {
      symbol: 'ESUSD',
      name: 'S&P Futures',
      change: '+62.75',
      changePercent: '+0.96%',
      value: '6,620.25',
      trend: 'up' as const,
    },
    {
      symbol: 'NQUSD',
      name: 'NASDAQ',
      change: '+174',
      changePercent: '+0.72%',
      value: '24,305.5',
      trend: 'up' as const,
    },
    {
      symbol: 'BTCUSD',
      name: 'Bitcoin',
      change: '+$1,582.89',
      changePercent: '+1.87%',
      value: '$86,262.04',
      trend: 'up' as const,
    },
    {
      symbol: '^VIX',
      name: 'VIX',
      change: '-2.99',
      changePercent: '-11.32%',
      value: '23.43',
      trend: 'down' as const,
    },
  ];

  const trendingCompanies = [
    { symbol: 'WMT', name: 'Walmart Inc.', price: '$105.32', change: '-1.67%', trend: 'down' as const },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: '$178.88', change: '-0.97%', trend: 'down' as const },
    { symbol: 'GOOG', name: 'Alphabet Inc.', price: '$299.65', change: '+3.33%', trend: 'up' as const },
    { symbol: 'META', name: 'Meta Platforms, Inc.', price: '$594.25', change: '+0.87%', trend: 'up' as const },
    { symbol: 'AVGO', name: 'Broadcom Inc.', price: '$340.20', change: '-1.91%', trend: 'down' as const },
  ];

  return (
    <aside className="fixed top-0 right-0 z-30 hidden h-screen w-80 space-y-6 overflow-y-auto border-l border-white/10 bg-[#100e12] p-6 lg:flex">
      {/* Weather Widget */}
      <Card className="border-white/10 bg-[#0A0A0A]">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-white">Weather</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white">16° C</div>
              <div className="text-sm text-white/60">Cloudy</div>
            </div>
            <div className="text-4xl">☁️</div>
          </div>
          <div className="text-sm text-white/60">
            Melbourne City Centre, Melbourne
            <br />
            <span className="text-white/40">H: 24° L: 13°</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div className="text-xs text-white/60">{day}</div>
                <div className="text-lg">☀️</div>
                <div className="text-sm text-white">
                  {[24, 27, 26, 20, 19][i]}
                  °
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Outlook */}
      <Card className="border-white/10 bg-[#0A0A0A]">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-white">Market Outlook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {marketData.map(item => (
            <div key={item.symbol} className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{item.symbol}</div>
                  <div className="text-xs text-white/60">{item.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{item.value}</div>
                  <div className={cn(
                    'text-xs flex items-center gap-1',
                    item.trend === 'up' ? 'text-green-400' : 'text-red-400',
                  )}
                  >
                    {item.trend === 'up'
                      ? (
                          <ArrowUp className="h-3 w-3" />
                        )
                      : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                    {item.changePercent}
                  </div>
                </div>
              </div>
              {/* Mini chart placeholder */}
              <div className="flex h-8 w-full items-end justify-between rounded bg-white/5 px-1 pb-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-1 rounded-t transition-all',
                      item.trend === 'up'
                        ? 'bg-green-400/60'
                        : 'bg-red-400/60',
                    )}
                    style={{
                      height: `${Math.random() * 60 + 20}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trending Companies */}
      <Card className="border-white/10 bg-[#0A0A0A]">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-white">Trending Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingCompanies.map(company => (
              <div
                key={company.symbol}
                className="flex items-center justify-between border-b border-white/5 py-2 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">{company.name}</div>
                  <div className="text-xs text-white/60">{company.symbol}</div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-medium text-white">{company.price}</div>
                  <div className={cn(
                    'text-xs flex items-center gap-1 justify-end',
                    company.trend === 'up' ? 'text-green-400' : 'text-red-400',
                  )}
                  >
                    {company.trend === 'up'
                      ? (
                          <ArrowUp className="h-3 w-3" />
                        )
                      : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                    {company.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Icons */}
      <div className="flex items-center justify-end gap-4 border-t border-white/10 pt-4">
        <button
          type="button"
          className="text-white/40 transition-colors hover:text-white/60"
          aria-label="Text size"
        >
          <span className="text-xs">Aa</span>
        </button>
        <button
          type="button"
          className="text-white/40 transition-colors hover:text-white/60"
          aria-label="Help"
        >
          <span className="text-sm">?</span>
        </button>
      </div>
    </aside>
  );
}
