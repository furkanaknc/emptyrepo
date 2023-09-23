import axios from "axios";
import router from "../router/index";

const state={
    token: localStorage.getItem('token') || '',
    user:{},
    status: '',
    error: null,
    humans: [],
};
const getters={
    isLoggedIn: state => !!state.token,
    authState: state => state.status,
    user: state => state.user,
    error: state => state.error,
    humans: (state) => state.humans,
};
const actions={
    async login({
        commit
    }, user) {
        commit('auth_request');
        try {
            let res = await axios.post('/api/users/login', user)
            
            if (res.data.success) {
                const token = res.data.token;
                const user = res.data.user;
               
               
                localStorage.setItem('token', token);
                // Set the axios defaults
                axios.defaults.headers.common['Authorization'] = token;
                commit('auth_success', token, user);
            }
            return res;
        } catch (err) {
            commit('auth_error', err);
        }
    },


    async getProfile({ commit }) {
        commit('profile_request');
        try {
            let res = await axios.get('/api/users/profile');
            if (res.data.user) {
                commit('user_profile_success', res.data.user);
            } else {
                commit('user_profile_error', 'Failed to fetch user profile');
            }
            return res;
        } catch (error) {
            commit('user_profile_error', 'Failed to fetch user profile');
            console.error("Failed to fetch user profile:", error);
        }
    },

    async logout({
        commit
    }) {
        await localStorage.removeItem('token');
        commit('logout');
        delete axios.defaults.headers.common['Authorization'];
        router.push('/login');
        return
    },

   

};
const mutations = {
    auth_request(state) {
        state.error = null
        state.status = 'loading'
    },
    auth_success(state, token, user) {
        state.token = token;
        state.user = user;
        state.status = 'success';
        state.error = null;
    },
    
    auth_error(state, err) {
        state.error = err.response.data.msg
    },

    profile_request(state) {
        state.status = 'loading';
        state.error = null;
    },

    user_profile_success(state, user) {
        state.user = user;
        state.status = 'success';
        state.error = null;
    },

    user_profile_error(state, error) {
        state.status = 'error';
        state.error = error;
    },
 

    logout(state) {
        state.error = null
        state.status = ''
        state.token = ''
        state.user = ''
    },
    setHumans(state, humans) {
      state.humans = humans;
    },
};
export default {
    state,
    actions,
    mutations,
    getters
};