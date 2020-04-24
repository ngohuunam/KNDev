export const ui = ({ user, year }) => (db, col) => (col ? user.state[year][db][col].ui : user.state[year][db].ui)
export const icon = state => (db, col) => (col ? state[db][col].icon : state[db].icon)
