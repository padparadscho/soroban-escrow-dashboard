// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

'use client';

import { useTransition, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useExpand } from '@/hooks/use-expand';
import { useMobile } from '@/hooks/use-mobile';
import { fetchDashboard, fetchChart } from '@/lib/actions';
import type {
  DashboardData,
  DashboardQueryParams,
  PageSize,
  PaneKey,
  TimeRange,
} from '@/lib/types';
import { ShellPane } from '@/components/panes/shell-pane';
import { SummaryPane } from '@/components/panes/summary-pane';
import { ChartPane } from '@/components/panes/chart-pane';
import { EventsPane } from '@/components/panes/events-pane';

export interface PaneLayoutProps {
  /** Initial dashboard data */
  initialData: DashboardData;
  /** Initial time range */
  initialRange: TimeRange;
  /** Stellar explorer base URL */
  explorer: string;
  /** Dashboard repository URL */
  repository: string;
  /** Notifier Twitter URL */
  notifier: string;
}

/**
 * Reusable layout pane component
 * @param props {@link PaneLayoutProps}
 * @returns {ReactNode}
 */
export function PaneLayout({
  initialData,
  initialRange,
  explorer,
  repository,
  notifier,
}: PaneLayoutProps): ReactNode {
  const { expanded, toggle } = useExpand<PaneKey>(null);
  const [data, setData] = useState<DashboardData>(initialData);
  const [params, setParams] = useState<DashboardQueryParams>({
    page: 1,
    pageSize: initialData.events.meta.pageSize,
    range: initialRange,
  });
  const [chartRange, setChartRange] = useState<TimeRange>(initialRange);
  const [isEventsLoading, startEventsTransition] = useTransition();
  const [, startChartTransition] = useTransition();
  const isExpanded = expanded !== null;
  const isMobile = useMobile();

  function updateParams(updates: Partial<DashboardQueryParams>): void {
    const next = { ...params, ...updates };
    setParams(next);
    startEventsTransition(async () => {
      const newData = await fetchDashboard(next);
      setData((prev) => ({
        ...prev,
        summary: newData.summary,
        events: newData.events,
      }));
    });
  }

  // Updates chart range without refetching events
  const handleChartRangeChange = useCallback((range: TimeRange) => {
    setChartRange(range);
    startChartTransition(async () => {
      const { chart } = await fetchChart(range);
      setData((prev) => ({ ...prev, chart }));
    });
  }, []);

  // Sorry, not sorry :D
  if (isMobile) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-4">
        <p className="text-center text-sm text-muted-foreground">
          No mobile support, go to desktop :)
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrap">
      <main className="dashboard-grid">
        {/* Summary pane */}
        <ShellPane
          title="Summary"
          expanded={false}
          dimmed={isExpanded}
          onExpandToggle={() => {}}
          expandable={false}
          gridArea="data"
        >
          <SummaryPane
            summary={data.summary}
            explorer={explorer}
            repository={repository}
            notifier={notifier}
          />
        </ShellPane>

        {/* Chart pane */}
        <ShellPane
          title="Chart"
          expanded={false}
          dimmed={isExpanded}
          onExpandToggle={() => {}}
          expandable={false}
          gridArea="chart"
        >
          <ChartPane
            points={data.chart}
            range={chartRange}
            onRangeChange={handleChartRangeChange}
          />
        </ShellPane>

        {/* Events pane */}
        <ShellPane
          title="Events"
          expanded={expanded === 'events'}
          dimmed={isExpanded && expanded !== 'events'}
          onExpandToggle={() => toggle('events')}
          gridArea="events"
        >
          <EventsPane
            events={data.events}
            explorer={explorer}
            loading={isEventsLoading}
            onPageChange={(page: number) => updateParams({ page })}
            onPageSizeChange={(pageSize: PageSize) =>
              updateParams({ pageSize, page: 1 })
            }
          />
        </ShellPane>
      </main>
    </div>
  );
}
