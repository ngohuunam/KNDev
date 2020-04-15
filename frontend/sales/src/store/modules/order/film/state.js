export default {
  list: [],
  selected: [],
  seq: null,
  loading: true,
  btnIcon: {},
  new: null,
  labels: [
    { label: 'Foreign Title:', inputType: 'text', key: 'foreignTitle' },
    { label: 'Team:', inputType: 'dropdown', key: 'team', options: ['CJHK', 'Disney', 'Local', 'UIP', 'WB'] },
    { label: 'Premiere Date:', inputType: 'calendar-full', key: 'premiereDate' },
    { label: 'End Date:', inputType: 'calendar', key: 'endAt' },
    { label: 'Vietnamese Title:', inputType: 'text', key: 'vietnameseTitle' },
  ],
  converted: null,
  messages: [],
}
