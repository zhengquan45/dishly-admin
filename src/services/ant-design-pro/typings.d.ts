// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type ProductListItem = {
    key?: number;
    id?: number;
    name?: string;
    subName?: string;
    imageUrl?: string;
    price?: string;
    category?: string;
    isAvailable?: number;
    updatedAt?: string;
    createdAt?: string;
  };

  type ProductList = {
    data?: ProductListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type BannerListItem = {
    key?: number;
    id?: number;
    name?: string;
    type?: string;
    priority?: number;
    contentType?: string;
    contentUrl?: string;
    clickUrl?: string;
    dateRange?: string[];
    status?: boolean;
    updatedAt?: string;
    createdAt?: string;
  };

  type BannerList = {
    data?: BannerListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type AdminUserListItem = {
    key?: number;
    id?: number;
    username?: string;
    password?: string;
    nickname?: string;
    avatar?: string;
    phone?: string;
    email?: string;
    isSuperAdmin?: boolean;
    status?: boolean;
    updatedAt?: string;
    createdAt?: string;
  };

  type AdminUserList = {
    data?: AdminUserListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type UserListItem = {
    key?: number;
    id?: number;
    avatarUrl?: string;
    nickname?: string;
    deliveryAddress?: string;
    contractName?: string;
    contractPhone?: number;
    gender?: string;
    updatedAt?: string;
    createdAt?: string;
  };

  type UserList = {
    data?: UserListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type OrderListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type OrderList = {
    data?: OrderListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type CouponTemplateListItem = {
    key?: number;
    id?: number;
    name?: string;
    type?: string;
    discountRate?: number;
    fullAmount?: number;
    reduceAmount?: number;
    cashAmount?: number;
    redeemProductId?: number;
    redeemProductName?: string;
    validityType?: string;
    validityDays?: number;
    minOrderAmount?: number;
    applicableProductTypes?: string;
    dateRange?: string[];
    status?: boolean;
    updatedAt?: string;
    createdAt?: string;
  };

  type CouponTemplateList = {
    data?: CouponTemplateListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };
}
