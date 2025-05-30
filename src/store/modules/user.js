import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken ,getTenantId, setTenantId, removeTenantId} from '@/utils/auth'
import router, { resetRouter } from '@/router'

const user = {
  state: {
    user: '',
    token: getToken(),
    tenantId: getTenantId(),
    name: '',
    avatar: '',
    roles: [],
    perms: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMS: (state, perms) => {
      state.perms = perms
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      userInfo.username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(response => {
          const token = response.data.token
          const tenantId = response.data.tenantId
          commit('SET_TOKEN', token)
          commit('SET_TENANT_ID', tenantId)
          setToken(token)
          setTenantId(tenantId)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 扫码授权登录
    LoginByQr({ commit }, authInfo) {
      return new Promise((resolve, reject) => {
        const token = authInfo.token
        const tenantId = authInfo.tenantId
        commit('SET_TOKEN', token)
        commit('SET_TENANT_ID', tenantId)
        setToken(token)
        setTenantId(tenantId)
        resolve()
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          const data = response.data
          if (data.perms && data.perms.length > 0) { // 验证返回的perms是否是一个非空数组
            commit('SET_PERMS', data.perms)
          } else {
            reject('getInfo: perms must be a non-null array !')
          }
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_TENANT_ID', '')
          commit('SET_ROLES', [])
          commit('SET_PERMS', [])
          removeToken()
          resetRouter()
          // 重置已访问视图和缓存视图
          dispatch('tagsView/delAllViews', null, { root: true })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_TENANT_ID', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(async resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        const { roles } = await dispatch('GetUserInfo')
        resetRouter()
        const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
        // 动态添加可访问路由
        router.addRoutes(accessRoutes)
        // 重置已访问视图和缓存视图
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      })
    }
  }
}

export default user
