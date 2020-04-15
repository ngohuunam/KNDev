export default {
  list: [],
  selected: [],
  table: [],
  seq: null,
  loading: true,
  btnIcon: {},
  new: null,
  labels: [
    { label: 'Product Name:', inputType: 'text', key: 'name' },
    { label: 'Type:', inputType: 'dropdown', key: 'type', options: ['Offset Print', 'Digital Print', 'Social Media', 'Web', 'Other'] },
    { label: 'End at:', inputType: 'calendar', key: 'endAt', dateFormat: 'dd/mm/yy', showTime: true },
  ],
  converted: null,
  messages: [],
}
