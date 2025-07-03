<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { reqLogin, reqUserInfo } from '@/api/user/index';
import { useUserStore } from '@/stores/user';
import { showToast } from '@/utils/feedback';
import ThemeToggle from '@/components/ThemeToggle.vue';

console.log('Login page loaded');

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  email: '',
  password: '',
  remember: false
});

const isLoading = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  // 表单验证
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Please fill in all fields';
    showToast('Please fill in all fields', 'error');
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    // 1. 调用登录API
    const loginRes = await reqLogin({
      email: form.value.email,
      password: form.value.password
    });

    if (loginRes.code !== 200) {
      throw new Error(loginRes.message || 'Login failed');
    }

    // 2. 获取用户信息
    const userInfoRes = await reqUserInfo();
    
    if (userInfoRes.code !== 200) {
      throw new Error(userInfoRes.message || 'Failed to get user info');
    }

    // 3. 保存用户信息到store
    userStore.setUserInfo({
      token: loginRes.data.token,
      userInfo: userInfoRes.data
    });

    // 4. 记住我功能
    if (form.value.remember) {
      localStorage.setItem('rememberedEmail', form.value.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // 5. 登录成功后跳转
    showToast('Login successful', 'success');
    
    const redirect = router.currentRoute.value.query.redirect;
    const userrole = userInfoRes.data.role || 'user';
    
    if (redirect) {
      // 如果有重定向参数，优先使用
      router.push(decodeURIComponent(redirect as string));
    } else {
      // 根据角色跳转到不同页面
      if (userrole == 'user') {
        router.push('/user');
      } else if(userrole == 'admin')
      {
        ;
      }
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Invalid credentials. Please try again.';
    showToast(error.message || 'Login failed', 'error');
  } finally {
    isLoading.value = false;
  }
};

// 初始化记住的邮箱
if (localStorage.getItem('rememberedEmail')) {
  form.value.email = localStorage.getItem('rememberedEmail') || '';
  form.value.remember = true;
}
</script>

<template>
  <div class="login-container">
    <ThemeToggle class="fixed-mode"/>
    
    <div class="login-card">

      <SvgIcon name="dog" size="60px"/>
      <div class="login-header">
        <h4>Welcome to Simple Stack</h4>
        <p>Please enter your details to sign in</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
          >
        </div>
        
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.remember">
            <span>Remember me</span>
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            Forgot password?
          </router-link>
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">Sign In</span>
          <span v-else>Signing In...</span>
        </button>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
      
      <div class="login-footer">
        <p>Don't have an account? <router-link to="/register">Sign up</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/index';

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-unit;
  background-color: $background-alt;
}

.login-card {
  @include card;
  width: 100%;
  max-width: 420px;
  padding: $spacing-large;
  background-color: $background-color;
  
  .login-header {
    text-align: center;
    margin-bottom: $spacing-large;


    
    h4 {
      color: var(--color-primary);
      margin-bottom: $spacing-small;
    }
    
    p {
      color: $text-muted;
    }
  }
}

.login-form {
  .form-group {
    margin-bottom: $spacing-unit;
    
    label {
      display: block;
      margin-bottom: $spacing-small;
      font-weight: 600;
      color: $text-color;
    }
    
    input {
      width: 100%;
      padding: $spacing-small $spacing-unit;
      border: 1px solid $border-color;
      border-radius: $border-radius;
      font-size: 1rem;
      transition: border-color $transition-duration $transition-timing;
      
      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(var(--color-primary), 0.2);
      }
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: $spacing-medium 0;
    
    .remember-me {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      input {
        margin-right: $spacing-small;
      }
    }
    
    .forgot-password {
      color: var(--color-primary);
      font-size: 0.875rem;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .login-button {
    @include button-variant(var(--color-primary), $text-light);
    width: 100%;
    padding: $spacing-unit;
    font-size: 1rem;
    font-weight: 600;
    margin-top: $spacing-unit;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
  
  .error-message {
    color: #e74c3c;
    margin-top: $spacing-unit;
    text-align: center;
    font-size: 0.875rem;
  }
}

.login-footer {
  text-align: center;
  margin-top: $spacing-large;
  padding-top: $spacing-unit;
  border-top: 1px solid $border-color;
  font-size: 0.875rem;
  
  a {
    color: var(--color-primary);
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

// 响应式调整
@media (max-width: $breakpoint-sm) {
  .login-card {
    padding: $spacing-unit;
  }
}
</style>