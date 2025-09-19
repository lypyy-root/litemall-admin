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
    url: `/user/getUserDetail/${id}`,
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
// export function deleteCustomer(id) {
//   return request({
//     url: '/user/delete',
//     method: 'post',
//     data: { id }
//   })
// }
