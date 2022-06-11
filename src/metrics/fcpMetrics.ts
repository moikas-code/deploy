import { NextWebVitalsMetric } from 'next/app';

export default function fcpMetrics(metric: NextWebVitalsMetric) {
  console.log(metric.value / 1000 <= 1);
  if (metric.value / 1000 <= 1) {
    console.log(metric.name, 'Result: ', metric.value / 1000, 'GOOD');
    return;
  }
  if (metric.value / 1000 <= 1 && metric.value / 1000 >= 3.0) {
    console.log(
      metric.name,
      'Result: ',
      metric.value / 1000,
      'Needs Improvement',
      'Visit https://web.dev/fcp/'
    );
    return;
  }

  console.log(
    metric.name,
    'Result: ',
    metric.value / 1000,
    'POOR',
    'Visit https://web.dev/fcp/'
  );
  return;
}
