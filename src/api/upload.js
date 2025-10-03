// src/api/upload.js
// 对象图片上传接口

import request from "@/utils/request";

export function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return request({
    url: "/admin/storage/create",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
