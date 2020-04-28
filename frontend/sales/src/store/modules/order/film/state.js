export default {
  list: [],
  selected: [],
  seq: null,
  loading: true,
  icon: { header: {}, row: {}, cell: {} },
  new: null,
  labels: [
    { label: 'Foreign Title:', comp: 'InputText', key: 'foreignTitle' },
    { label: 'Team:', comp: 'Dropdown', key: 'team', options: ['CJHK', 'Disney', 'Local', 'UIP', 'WB'] },
    { label: 'Premiere Date:', comp: 'NewCalendar', key: 'premiereDate' },
    { label: 'End Date:', comp: 'NewCalendar', key: 'endAt', showTime: false },
    { label: 'Vietnamese Title:', comp: 'InputText', key: 'vietnameseTitle' },
    { label: 'Process:', comp: 'Dropdown', key: 'process', options: [] },
  ],
  converted: null,
  messages: [],
}
