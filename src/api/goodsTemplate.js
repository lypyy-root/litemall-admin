import request from '@/utils/request'

// 创建商品模板
export function createGoodsTemplate(payload) {
  return request({
    url: "/goods/template/create",
    method: "post",
    data: payload,
  });
}

// 拷贝商品模板
export function copyCreateGoodsTemplate(data) {
  return request({
    url: "/goods/template/CopyCreate",
    method: "post",
    data,
  });
}

// 商品模板列表
export function listGoodsTemplates({
  name = "",
  numberSort = "desc",
  page = 1,
  limit = 10,
} = {}) {
  return request({
    url: "/goods/template/list",
    method: "get",
    params: { name, numberSort, page, limit },
  });
}

// 可以添加商品列表
export function getGoodsTemplate(params) {
  return request({
    url: "/goods/listTemplate",
    method: "get",
    params,
  });
}

// 已经绑定的商品列表
export function getGoodsTemplateDetail(params) {
  return request({
    url: "/goods/template/getTemplate",
    method: "get",
    params,
  });
}

// 获取经营方式（渠道）
export function getChannelList() {
  return request({
    url: "/option/getBrand", // 获取经营方式（渠道）
    method: "get",
  });
}

// 商品模板绑定商品
export function bindGoodsToTemplate(data) {
  return request({
    url: "/goods/template/addTemplateBindGoods",
    method: "post",
    data,
  });
}

// 商品模板解绑商品
export function deleteGoodsTemplateBindGoods(data) {
  return request({
    url: "/goods/template/deleteTemplateBindGoods",
    method: "post",
    data,
  });
}

// 更新商品模板绑定商品
export function updateGoodsTemplateBindGoods(data) {
  return request({
    url: "/goods/template/updateTemplateBindGoods",
    method: "post",
    data,
  });
}

// 上传图片
export function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return request({
    url: "/storage/create",
    method: "POST",
    data: formData
  });
}


// 获取产品类别
export function getCategoryList(params) {
  return request({
    url: "/option/getCategory",
    method: "get",
    params,
  });
}

// 获取品牌列表
export function getBrandList(params) {
  return request({
    url: "/option/getSalesScenario",
    method: "get",
    params,
  });
}