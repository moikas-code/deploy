import { NextWebVitalsMetric } from 'next/app';

export default function ttfbMetrics(metric: NextWebVitalsMetric) {
  if (metric.value <= 600)
    console.log(metric.name, 'Result: ', metric.value, 'GOOD');

  if (metric.value >= 600 && metric.value <= 1000)
    console.log(
      metric.name,
      'Result: ',
      metric.value,
      'Needs Improvement',
      'Visit https://web.dev/ttfb/'
    );

  if (metric.value >= 1000)
    console.log(
      metric.name,
      'Result: ',
      metric.value,
      'POOR',
      'Visit https://web.dev/ttfb/'
    );
}
