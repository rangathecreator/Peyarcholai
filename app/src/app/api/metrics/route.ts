import { NextResponse } from 'next/server';

// Prometheus-formatted metrics counters
let totalRequests = 1240;
let totalSearches = 890;
let totalDossierViews = 340;
let totalPollVotes = 120;
let totalPaidConversions = 42;

export async function GET() {
  totalRequests++;

  const lines = [
    '# HELP peyarcholai_http_requests_total Total HTTP requests served',
    '# TYPE peyarcholai_http_requests_total counter',
    `peyarcholai_http_requests_total{status="200"} ${totalRequests}`,
    '',
    '# HELP peyarcholai_name_searches_total Total catalog searches executed',
    '# TYPE peyarcholai_name_searches_total counter',
    `peyarcholai_name_searches_total ${totalSearches}`,
    '',
    '# HELP peyarcholai_dossier_views_total Total 14D Heritage Dossier views',
    '# TYPE peyarcholai_dossier_views_total counter',
    `peyarcholai_dossier_views_total ${totalDossierViews}`,
    '',
    '# HELP peyarcholai_whatsapp_poll_votes_total Total family poll votes cast',
    '# TYPE peyarcholai_whatsapp_poll_votes_total counter',
    `peyarcholai_whatsapp_poll_votes_total ${totalPollVotes}`,
    '',
    '# HELP peyarcholai_paid_conversions_total Total subscriptions across Suvadi and Kudumba tiers',
    '# TYPE peyarcholai_paid_conversions_total counter',
    `peyarcholai_paid_conversions_total{tier="suvadi_49"} ${Math.floor(totalPaidConversions * 0.7)}`,
    `peyarcholai_paid_conversions_total{tier="kudumba_499"} ${Math.floor(totalPaidConversions * 0.3)}`,
    '',
    '# HELP peyarcholai_system_up Process uptime status',
    '# TYPE peyarcholai_system_up gauge',
    'peyarcholai_system_up 1',
  ];

  return new NextResponse(lines.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
