import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({
    isAuthenticated: state.isAuthenticated,
    userRole: state.userRole,
    userName: state.userName,
    userId: state.userId,
  }),
});

const store = createStore({
  state: {
    isAuthenticated: false,
    userRole: null,
    userName: null,
    userId: null,
  },
  mutations: {
    setAuthState(state, { isAuthenticated, userRole, userName, userId }) {
      state.isAuthenticated = isAuthenticated;
      state.userRole = userRole;
      state.userName = userName;
      state.userId = userId;
    },
    clearAuthState(state) {
      state.isAuthenticated = false;
      state.userRole = null;
      state.userName = null;
      state.userId = null;
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setAuthState', {
        isAuthenticated: true,
        userRole: user.role,
        userName: user.name,
        userId: user.userId,
      });
    },
    logout({ commit }) {
      commit('clearAuthState');
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getUserRole: (state) => state.userRole,
    getUserName: (state) => state.userName,
    getUserId: (state) => state.userId,
  },
  plugins: [vuexLocal.plugin],
});

export default store;
