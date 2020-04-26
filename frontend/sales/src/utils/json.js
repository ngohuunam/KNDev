export default {
  root: [
    {
      key: '0',
      root: true,
      data: {
        name: 'film 1',
        time: { start: { d: 1, m: 4, y: 2020 }, end: { d: 18, m: 4, y: 2020 } },
      },
      children: [
        {
          key: '0-0',
          data: {
            name: 'Download',
            time: { start: { d: 1, m: 4, y: 2020 }, end: { d: 3, m: 4, y: 2020 } },
            color: 'green',
          },
        },
        {
          key: '0-1',
          data: {
            name: 'Check File',
            time: { start: { d: 4, m: 4, y: 2020 }, end: { d: 6, m: 4, y: 2020 } },
            color: 'blue',
          },
        },
        {
          key: '0-2',
          data: {
            name: 'Localize',
            time: { start: { d: 7, m: 4, y: 2020 }, end: { d: 9, m: 4, y: 2020 } },
            color: 'red',
          },
        },
        {
          key: '0-3',
          data: {
            name: 'Approve',
            time: { start: { d: 10, m: 4, y: 2020 }, end: { d: 12, m: 4, y: 2020 } },
            color: 'purple',
          },
        },
        {
          key: '0-4',
          data: {
            name: 'Prepare',
            time: { start: { d: 13, m: 4, y: 2020 }, end: { d: 15, m: 4, y: 2020 } },
            color: 'grey',
          },
        },
        {
          key: '0-5',
          data: {
            name: 'Produce',
            time: { start: { d: 16, m: 4, y: 2020 }, end: { d: 18, m: 4, y: 2020 } },
            color: 'yellow',
          },
        },
      ],
    },
  ],
}
