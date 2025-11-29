import request from "@/utils/request";

export function getCustomerList(params) {
  return request({
    url: "/user/getUserList",
    method: "get",
    params,
  });
}

export function getCustomerDetail(id) {
  return request({
    url: `/user/userDetail`,
    method: "get",
    params: { id },
  });
}
export function updateCustomerDetail(data) {
  return request({
    url: "/user/userUpdateDetail",
    method: "post",
    data,
  });
}

export function updateCustomerStore(data) {
  return request({
    url: "/user/updateStore",
    method: "post",
    data,
  });
}

export function getRegionList() {
  return request({
    url: "/region/list",
    method: "get",
  });
}

export function getResponsiblePerson() {
  return request({
    url: "/option/getResponsiblePerson",
    method: "get",
  });
}

export function getSalesmanList() {
  return request({
    url: "/option/getSalesman",
    method: "get",
  });
}