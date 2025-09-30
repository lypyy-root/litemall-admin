import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/errorPage/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/errorPage/401"),
    hidden: true,
  },
  {
    path: "",
    component: Layout,
    redirect: "dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: { title: "首页", icon: "dashboard", affix: true },
      },
    ],
  },
  {
    path: "/profile",
    component: Layout,
    redirect: "noredirect",
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("@/views/profile/index"),
        name: "Index",
        meta: { title: "个人中心", noCache: true },
      },
      {
        path: "build",
        component: () => import("@/views/build/index"),
        name: "systemBuild",
        meta: { title: "表单构建", noCache: true },
      },
      {
        path: "notice",
        component: () => import("@/views/profile/notice"),
        name: "Notice",
        meta: { title: "通知中心", noCache: true },
      },
    ],
  },
];

export const asyncRoutes = [
  {
    path: "/user",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "userManage",
    meta: {
      title: "用户管理",
      icon: "user",
    },
    children: [
      {
        path: "userShare",
        component: () => import("@/views/user/userShare"),
        name: "userShare",
        meta: {
          perms: ["GET /admin/share/list"],
          title: "分享记录",
          noCache: true,
        },
        hidden: true,
      },
      {
        path: "userDeal",
        component: () => import("@/views/user/userDeal"),
        name: "userDeal",
        meta: {
          perms: ["GET /admin/user/deal-list"],
          title: "余额交易记录",
          noCache: true,
        },
        hidden: true,
      },
      {
        path: "user",
        component: () => import("@/views/user/user"),
        name: "User",
        meta: {
          perms: ["GET /admin/user/list"],
          title: "会员管理",
          noCache: true,
        },
      },
      {
        path: "Salesman",
        component: () => import("@/views/user/salesmanUser"),
        name: "SalesmanUser",
        meta: {
          perms: ["GET /admin/salesmanUser/list"],
          title: "业务员管理",
          noCache: true,
        },
      },
      {
        path: "address",
        component: () => import("@/views/user/address"),
        name: "userAddress",
        meta: {
          perms: ["GET /admin/address/list"],
          title: "用户地址",
          noCache: true,
        },
      },
      {
        path: "collect",
        component: () => import("@/views/user/collect"),
        name: "userCollect",
        meta: {
          perms: ["GET /admin/collect/list"],
          title: "会员收藏",
          noCache: true,
        },
      },
      {
        path: "footprint",
        component: () => import("@/views/user/footprint"),
        name: "userFootprint",
        meta: {
          perms: ["GET /admin/footprint/list"],
          title: "会员足迹",
          noCache: true,
        },
      },
      {
        path: "history",
        component: () => import("@/views/user/history"),
        name: "userHistory",
        meta: {
          perms: ["GET /admin/history/list"],
          title: "搜索历史",
          noCache: true,
        },
      },
      {
        path: "feedback",
        component: () => import("@/views/user/feedback"),
        name: "userFeedback",
        meta: {
          perms: ["GET /admin/feedback/list"],
          title: "意见反馈",
          noCache: true,
        },
      },
    ],
  },

  {
    path: "/mall",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "mallManage",
    meta: {
      title: "商城管理",
      icon: "example",
    },
    children: [
      {
        path: "brand",
        component: () => import("@/views/mall/brand"),
        name: "mallBrand",
        meta: {
          perms: ["GET /admin/brand/list"],
          title: "店铺列表",
          noCache: true,
        },
      },
      {
        path: "keyword",
        component: () => import("@/views/mall/keyword"),
        name: "mallKeyword",
        meta: {
          perms: ["GET /admin/keyword/list"],
          title: "关键词管理",
          noCache: true,
        },
      },
      {
        path: "category",
        component: () => import("@/views/mall/category"),
        name: "mallCategory",
        meta: {
          perms: ["GET /admin/category/list"],
          title: "商品类目",
          noCache: true,
        },
      },
      {
        path: "issue",
        component: () => import("@/views/mall/issue"),
        name: "mallIssue",
        meta: {
          perms: ["GET /admin/issue/list"],
          title: "通用问题",
          noCache: true,
        },
      },
      {
        path: "region",
        component: () => import("@/views/mall/region"),
        name: "mallRegion",
        meta: {
          perms: ["/admin/region/list"],
          title: "行政区域",
          noCache: true,
        },
      },
    ],
  },

  {
    path: "/order",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "orderManage",
    meta: {
      title: "订单管理",
      icon: "shopping",
    },
    children: [
      {
        path: "order",
        component: () => import("@/views/order/order"),
        name: "Order",
        meta: {
          perms: ["GET /admin/order/list"],
          title: "销售订单",
          noCache: true,
        },
      },
      {
        path: "aftersale",
        component: () => import("@/views/order/aftersale"),
        name: "orderAftersale",
        meta: {
          perms: ["GET /admin/aftersale/list"],
          title: "订单售后",
          noCache: true,
        },
      },
      {
        path: "isissig",
        component: () => import("@/views/order/isissigning"),
        name: "Isissigning",
        meta: {
          title: "签单订单",
          noCache: true,
        },
      },
      {
        path: "shop-map",
        component: () => import("@/views/order/shop-map"),
        name: "ShopMap",
        meta: {
          title: "订单地图",
          noCache: true,
        },
      },
      {
        path: "comment",
        component: () => import("@/views/order/comment"),
        name: "orderComment",
        meta: {
          perms: ["GET /admin/comment/list"],
          title: "订单评论",
          noCache: true,
        },
      },
    ],
  },

  {
    path: "/goods",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "goodsManage",
    meta: {
      title: "商品管理",
      icon: "form",
    },
    children: [
      {
        path: "list",
        component: () => import("@/views/goods/list"),
        name: "goodsList",
        meta: {
          perms: ["GET /admin/goods/list"],
          title: "商品列表",
          noCache: true,
        },
      },
      {
        path: "create",
        component: () => import("@/views/goods/create"),
        name: "goodsCreate",
        meta: {
          perms: ["POST /admin/goods/create"],
          title: "商品上架",
          noCache: true,
        },
      },
      {
        path: "edit",
        component: () => import("@/views/goods/edit"),
        name: "goodsEdit",
        meta: {
          perms: ["POST /admin/goods/update"],
          title: "商品编辑",
          noCache: true,
        },
        hidden: true,
      },
    ],
  },
  {
    path: "/promotion",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "promotionManage",
    meta: {
      title: "推广管理",
      icon: "international",
    },
    children: [
      {
        path: "ad",
        component: () => import("@/views/promotion/ad"),
        name: "promotionAd",
        meta: {
          perms: ["GET /admin/ad/list"],
          title: "广告管理",
          noCache: true,
        },
      },
      {
        path: "dynamic",
        component: () => import("@/views/promotion/dynamic"),
        name: "promotionDynamic",
        meta: {
          perms: ["GET /admin/dynamic/list"],
          title: "动态管理",
          noCache: true,
        },
      },
      {
        path: "coupon",
        component: () => import("@/views/promotion/coupon/coupon"),
        name: "promotionCoupon",
        meta: {
          perms: ["GET /admin/coupon/list"],
          title: "优惠券管理",
          noCache: true,
        },
      },
      {
        path: "couponActivity",
        component: () => import("@/views/promotion/coupon/couponActivity"),
        name: "promotionCouponActivity",
        meta: {
          perms: ["GET /admin/coupon/read"],
          title: "优惠券详情",
          noCache: true,
        },
        hidden: true,
      },
      {
        path: "topicList",
        component: () => import("@/views/promotion/topic/topicList"),
        name: "promotionTopic",
        meta: {
          perms: ["GET /admin/topic/list"],
          title: "专题管理",
          noCache: true,
        },
      },
      {
        path: "topicCreate",
        component: () => import("@/views/promotion/topic/topicCreate"),
        name: "promotionTopicCreate",
        meta: {
          perms: ["POST /admin/topic/create"],
          title: "专题创建",
          noCache: true,
        },
        hidden: true,
      },
      {
        path: "topicEdit",
        component: () => import("@/views/promotion/topic/topicEdit"),
        name: "promotionTopicEdit",
        meta: {
          perms: ["POST /admin/topic/update"],
          title: "专题编辑",
          noCache: true,
        },
        hidden: true,
      },
      {
        path: "grouponRule",
        component: () => import("@/views/promotion/groupon/grouponRule"),
        name: "promotionGrouponRule",
        meta: {
          perms: ["GET /admin/groupon/list"],
          title: "团购活动",
          noCache: true,
        },
      },
      {
        path: "grouponActivity",
        component: () => import("@/views/promotion/groupon/grouponActivity"),
        name: "promotionGrouponActivity",
        meta: {
          perms: ["GET /admin/groupon/read"],
          title: "参与详情",
          noCache: true,
        },
        hidden: true,
      },
      {
        path: "rewardTask",
        component: () => import("@/views/promotion/reward/rewardTask"),
        name: "promotionRewardsTask",
        meta: {
          perms: ["GET /admin/reward/list"],
          title: "赏金活动",
          noCache: true,
        },
      },
      {
        path: "rewardActivity",
        component: () => import("@/views/promotion/reward/rewardActivity"),
        name: "promotionRewardsActivity",
        meta: {
          perms: ["GET /admin/reward/read"],
          title: "参与详情",
          noCache: true,
        },
        hidden: true,
      },
    ],
  },

  {
    path: "/system",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "systemManage",
    meta: {
      title: "系统管理",
      icon: "system",
    },
    children: [
      {
        path: "admin",
        component: () => import("@/views/system/admin"),
        name: "systemAdmin",
        meta: {
          perms: ["GET /admin/admin/list"],
          title: "管理账号",
          noCache: true,
        },
      },
      {
        path: "tenant",
        component: () => import("@/views/system/tenant"),
        name: "systemTenant",
        meta: {
          perms: ["GET /admin/tenant/list"],
          title: "租户管理",
          noCache: true,
        },
      },
      {
        path: "notice",
        component: () => import("@/views/system/notice"),
        name: "systemNotice",
        meta: {
          perms: ["GET /admin/notice/list"],
          title: "通知管理",
          noCache: true,
        },
      },
      {
        path: "log",
        component: () => import("@/views/system/log"),
        name: "systemLog",
        meta: {
          perms: ["GET /admin/log/list"],
          title: "操作日志",
          noCache: true,
        },
      },
      {
        path: "systemLog",
        component: () => import("@/views/system/systemLog"),
        name: "SystemLog",
        meta: {
          perms: ["GET /admin/log/system-list"],
          title: "系统日志",
          noCache: true,
        },
      },
      {
        path: "ueditor",
        component: () => import("@/views/system/ueditor"),
        name: "UEditor",
        meta: {
          perms: ["GET /admin/log/system-read"],
          title: "文件详情",
          noCache: true,
        },
        hidden: true,
      },
      {
        path: "role",
        component: () => import("@/views/system/role"),
        name: "systemRole",
        meta: {
          perms: ["GET /admin/role/list"],
          title: "角色管理",
          noCache: true,
        },
      },
      {
        path: "os",
        component: () => import("@/views/system/os"),
        name: "systemOs",
        meta: {
          perms: ["GET /admin/storage/list"],
          title: "对象存储",
          noCache: true,
        },
      },
    ],
  },

  {
    path: "/config",
    component: Layout,
    redirect: "noredirect",
    alwaysShow: true,
    name: "configManage",
    meta: {
      title: "配置管理",
      icon: "dict",
    },
    children: [
      {
        path: "mall",
        component: () => import("@/views/config/mall"),
        name: "configMall",
        meta: {
          perms: ["GET /admin/config/mall"],
          title: "商城配置",
          noCache: true,
        },
      },
      {
        path: "express",
        component: () => import("@/views/config/express"),
        name: "configExpress",
        meta: {
          perms: ["GET /admin/config/express"],
          title: "运费配置",
          noCache: true,
        },
      },
      {
        path: "order",
        component: () => import("@/views/config/order"),
        name: "configOrder",
        meta: {
          perms: ["GET /admin/config/order"],
          title: "订单配置",
          noCache: true,
        },
      },
      // {
      //   path: 'qrcode',
      //   component: () => import('@/views/config/qrcode'),
      //   name: 'configQrcode',
      //   meta: {
      //     title: '二维码配置',
      //     noCache: true
      //   }
      // },
      {
        path: "wx",
        component: () => import("@/views/config/wx"),
        name: "configWx",
        meta: {
          perms: ["GET /admin/config/wx"],
          title: "小程序配置",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/customers",
    component: Layout,
    redirect: "noRedirect",
    name: "Customers",
    alwaysShow: true, // <— force folder-style menu even with one visible child
    meta: { title: "客户管理", icon: "peoples" },
    children: [
      {
        path: "list",
        component: () => import("@/views/customers/list"), // <— ensure folder name matches your files
        name: "CustomersList",
        meta: {
          title: "客户列表",
          noCache: true,
          perms: ["GET /admin/user/getUserList"],
        },
      },
      {
        path: "edit",
        component: () => import("@/views/customers/edit"),
        name: "CustomersEdit",
        hidden: true,
        meta: {
          title: "编辑客户",
          noCache: true,
          perms: ["GET /admin/user/userDetail"],
          activeMenu: "/customers/list",
        },
      },
    ],
  },

  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
