const ORTHODOX_API =
'https://est-povod-api.onrender.com/api/orthodox'

export async function getOrthodoxDate(date) {
const response = await fetch(
`${ORTHODOX_API}?date=${encodeURIComponent(date)}`,
)

const data = await response.json()

if (!response.ok) {
throw new Error(
data?.error ||
`Ошибка православного API: ${response.status}`,
)
}

return data
}
