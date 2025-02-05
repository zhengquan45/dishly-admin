// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/admin/admin_user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/admin/admin_user/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/admin/admin_user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

/** 获取商品列表 GET /api/product */
export async function product(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.ProductList>('/admin/product', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新商品 PUT /api/product */
export async function updateProduct(options?: { [key: string]: any }) {
  return request<API.ProductListItem>('/admin/product', {
    method: 'PUT',
    data: {
      ...(options || {}),
    },
  });
}

/** 新建商品 POST /api/product */
export async function addProduct(options?: { [key: string]: any }) {
  return request<API.ProductListItem>('/admin/product', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

/** 获取用户列表 GET /api/user */
export async function user(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.UserList>('/admin/user', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取广告列表 GET /api/banner */
export async function banner(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BannerList>('/admin/banner', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新广告 PUT /api/banner */
export async function updateBanner(options?: { [key: string]: any }) {
  return request<API.BannerListItem>('/admin/banner', {
    method: 'PUT',
    data: {
      ...(options || {}),
    },
  });
}

/** 新建广告 POST /api/banner */
export async function addBanner(options?: { [key: string]: any }) {
  return request<API.BannerListItem>('/admin/banner', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

/** 获取管理员列表 GET /api/admin_user */
export async function adminUser(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.AdminUserList>('/admin/admin_user', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新管理员信息 PUT /api/admin_user */
export async function updateAdminUser(options?: { [key: string]: any }) {
  return request<API.AdminUserListItem>('/admin/admin_user', {
    method: 'PUT',
    data: {
      ...(options || {}),
    },
  });
}

/** 新建管理员 POST /api/admin_user */
export async function addAdminUser(options?: { [key: string]: any }) {
  return request<API.AdminUserListItem>('/admin/admin_user', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

/** 获取优惠券模版列表 GET /admin/coupon_template */
export async function couponTemplate(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.CouponTemplateList>('/admin/coupon_template', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新优惠券模版 PUT /admin/coupon_template */
export async function updateCouponTemplate(options?: { [key: string]: any }) {
  return request<API.CouponTemplateListItem>('/admin/coupon_template', {
    method: 'PUT',
    data: {
      ...(options || {}),
    },
  });
}

/** 新建优惠券模版 POST /admin/coupon_template */
export async function addCouponTemplate(options?: { [key: string]: any }) {
  return request<API.CouponTemplateListItem>('/admin/coupon_template', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}
