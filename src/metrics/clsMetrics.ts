import { NextWebVitalsMetric } from 'next/app';

export default function clsMetrics(metric: NextWebVitalsMetric) {
  if (metric.value / 1000 < 0.1)
    console.log(metric.name, 'Result: ', metric.value / 1000, 'GOOD');

  if (metric.value / 1000 > 0.1 && metric.value / 1000 < 0.25)
    console.log(
      metric.name,
      'Result: ',
      metric.value / 1000,
      'Needs Improvement',
      'Visit https://web.dev/cls/'
    );

  if (metric.value / 1000 > 0.25)
    console.log(
      metric.name,
      'Result: ',
      metric.value / 1000,
      'POOR',
      'Visit https://web.dev/cls/'
    );
}
