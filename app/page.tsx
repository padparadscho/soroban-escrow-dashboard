// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import { getDashboardData } from '@/lib/services';
import { CONFIG } from '@/lib/config';
import { DEFAULT_CHART_RANGE } from '@/lib/constants';
import { PaneLayout } from '@/components/panes/layout-pane';

export default async function Home() {
  const data = await getDashboardData({
    page: 1,
    pageSize: 50,
    range: DEFAULT_CHART_RANGE,
  });

  return (
    <PaneLayout
      initialData={data}
      initialRange={DEFAULT_CHART_RANGE}
      explorer={CONFIG.STELLAR_EXPLORER_BASE_URL}
      repository={CONFIG.DASHBOARD_REPOSITORY_URL}
      notifier={CONFIG.NOTIFIER_TWITTER_URL}
    />
  );
}
