export async function authRequest(path, body) {
  let response
  try {
    response = await fetch(`/api/auth/${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      ...(body === undefined ? {} : {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    })
  } catch {
    throw new Error('Unable to reach the server. Please try again.')
  }
  const data = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok || (response.status !== 204 && !data)) {
    const error = new Error(data?.error || 'Something went wrong. Please try again.')
    error.status = response.status
    throw error
  }
  return data
}
