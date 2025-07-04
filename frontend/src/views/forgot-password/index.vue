<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { reqResetPassword, reqSendVerificationCode } from '@/api/user/index';
import { showToast } from '@/utils/feedback';
import ThemeToggle from '@/components/ThemeToggle.vue';

const router = useRouter();

const form = ref({
  email: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
});

const activeStep = ref(1); // 1: 输入邮箱, 2: 验证码, 3: 重置密码
const isLoading = ref(false);
const errorMessage = ref('');
const countdown = ref(0);
const countdownInterval = ref<number>();

// 发送验证码
const sendVerificationCode = async () => {
  if (!form.value.email) {
    showToast('Please enter your email first', 'error');
    return;
  }

  if (countdown.value > 0) return;

  try {
    await reqSendVerificationCode({ email: form.value.email, type: 'reset' });
    showToast('Verification code sent', 'success');
    activeStep.value = 2;
    startCountdown();
  } catch (error) {
    showToast('Failed to send verification code', 'error');
  }
};

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60;
  countdownInterval.value = window.setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval.value);
    }
  }, 1000);
};

// 验证验证码
const verifyCode = () => {
  if (!form.value.verificationCode) {
    showToast('Please enter verification code', 'error');
    return;
  }
  activeStep.value = 3;
};

// 重置密码
const resetPassword = async () => {
  if (!form.value.newPassword || !form.value.confirmPassword) {
    errorMessage.value = 'Please fill in all fields';
    showToast('Please fill in all fields', 'error');
    return;
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match';
    showToast('Passwords do not match', 'error');
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const resetRes = await reqResetPassword({
      email: form.value.email,
      code: form.value.verificationCode,
      newPassword: form.value.newPassword
    });

    if (resetRes.code !== 200) {
      throw new Error(resetRes.message || 'Password reset failed');
    }

    showToast('Password reset successful', 'success');
    router.push('/login');
  } catch (error: any) {
    errorMessage.value = error.message || 'Password reset failed. Please try again.';
    showToast(error.message || 'Password reset failed', 'error');
  } finally {
    isLoading.value = false;
  }
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
  }
});
</script>

<template>
  <div class="login-container">
    <ThemeToggle />
    
    <div class="login-card">
      <SvgIcon name="lock" size="60px"/>
      <div class="login-header">
        <h4>Reset Your Password</h4>
        <p>Follow the steps to reset your password</p>
      </div>
      
      <form @submit.prevent="activeStep === 3 ? resetPassword() : activeStep === 2 ? verifyCode() : sendVerificationCode()" class="login-form">
        <!-- 步骤1: 输入邮箱 -->
        <div v-if="activeStep === 1" class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          >
        </div>
        
        <!-- 步骤2: 验证码 -->
        <div v-if="activeStep === 2" class="form-group">
          <p class="instruction">We've sent a verification code to {{ form.email }}</p>
          <label for="verificationCode">Verification Code</label>
          <div class="code-input-group">
            <input
              id="verificationCode"
              v-model="form.verificationCode"
              type="text"
              placeholder="Enter verification code"
              required
            >
            <button 
              type="button" 
              class="send-code-btn"
              :disabled="countdown > 0"
              @click="sendVerificationCode"
            >
              {{ countdown > 0 ? `${countdown}s` : 'Resend Code' }}
            </button>
          </div>
        </div>
        
        <!-- 步骤3: 新密码 -->
        <div v-if="activeStep === 3" class="form-group">
          <label for="newPassword">New Password</label>
          <input
            id="newPassword"
            v-model="form.newPassword"
            type="password"
            placeholder="Create a new password"
            required
          >
        </div>
        
        <div v-if="activeStep === 3" class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            required
          >
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">
            {{ activeStep === 1 ? 'Send Code' : activeStep === 2 ? 'Verify Code' : 'Reset Password' }}
          </span>
          <span v-else>Processing...</span>
        </button>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
      
      <div class="login-footer">
        <p>Remember your password? <router-link to="/login">Sign in</router-link></p>
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

    .instruction {
      color: $text-muted;
      margin-bottom: $spacing-unit;
      font-size: 0.875rem;
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

    .code-input-group {
      display: flex;
      gap: $spacing-small;

      input {
        flex: 1;
      }

      .send-code-btn {
        @include button-variant(var(--color-primary), $text-light);
        white-space: nowrap;
        padding: 0 $spacing-unit;
        font-size: 0.875rem;
        min-width: 100px;

        &:disabled {
          background-color: $medium-gray;
          cursor: not-allowed;
        }
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