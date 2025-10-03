export function createGoodsTemplate(payload) {
  return request({
    url: "/admin/goods/template/create",
    method: "post",
    data: payload,
  });
}
export function listGoodsTemplates({
  name = "",
  numberSort = "desc",
  page = 1,
  limit = 10,
} = {}) {
  return request({
    url: "/admin/goods/template/list",
    method: "get",
    params: { name, numberSort, page, limit },
  });
}
