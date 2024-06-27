import {barColors, borderColors} from './chart-colors';

export function configOptionsData(payload){
  return {
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: payload.xLabel
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          callback: (value) => {
            if (Math.floor(value) === value) {
              return value;
            }
          }
        },
        scaleLabel: {
          display: true,
          labelString: payload.yLabel
        }
      }]
    }
  }
}

export function configChartData(payload){
  return {
    labels: payload.labels,
    datasets: [{
      fill:false,
      label: payload.legend,
      data: payload.data,
      backgroundColor: payload?.barColor ? payload?.barColor :barColors(),
      borderColor: payload?.borderColor ? payload?.borderColor: borderColors(),
      borderWidth: 1
    }]
  };
}

export function buildChart (payload){
  const ctx = document.getElementById(payload.canvas);
  return new Chart(ctx, {
    type: payload.type,
    data: payload.chartData,
    options: payload ?.options || {}
  });
}