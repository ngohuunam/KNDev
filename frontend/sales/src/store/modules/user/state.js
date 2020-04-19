const user = window.localStorage.getItem('user')
if (!user) window.location.href = `${window.location.origin}/reset`
const User = JSON.parse(user)
if (!User.token) window.location.href = `${window.location.origin}/reset`
export default User
