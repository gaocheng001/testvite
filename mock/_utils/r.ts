export function okPage(data) {
  return ok({"total": 1365, "items": data, list: null})
}

export function ok(data) {
  return {
    "code": 0,
    "type": "success",
    "message": "ok",
    "result": data
  }
}
