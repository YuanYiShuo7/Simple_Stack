<template>
  <div class="profile-overlay" v-if="visible" @click.self="close">
    <div class="profile-card">
      <div class="card-header">
        <h3>User Profile</h3>
        <button class="close-btn" @click="close">
          <SvgIcon name="close" />
        </button>
      </div>
      
      <div class="card-body">
        <div class="avatar-section">
          <div class="avatar-container">
            <img 
              v-if="user.avatar" 
              :src="user.avatar" 
              alt="User Avatar"
              class="profile-avatar"
            >
            <div v-else class="avatar-fallback">
              {{ userInitial }}
            </div>
          </div>
          <button class="edit-btn" @click="editAvatar">Change Avatar</button>
        </div>
        
        <div class="info-section">
          <div class="info-item">
            <label>Username</label>
            <div v-if="!editingUsername" class="info-value">
              {{ user.username }}
              <button class="edit-icon" @click="startEditingUsername">
                <SvgIcon name="edit" />
              </button>
            </div>
            <div v-else class="edit-field">
              <input 
                type="text" 
                v-model="tempUsername" 
                ref="usernameInput"
                @keyup.enter="saveUsername"
              >
              <button class="save-btn" @click="saveUsername">Save</button>
              <button class="cancel-btn" @click="cancelEditingUsername">Cancel</button>
            </div>
          </div>
          
          <div class="info-item">
            <label>Email</label>
            <div class="info-value">{{ user.email }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { showToast } from '@/utils/feedback';

const props = defineProps({
  visible: Boolean,
  user: {
    type: Object,
    default: () => ({
      username: 'User',
      email: 'user@example.com',
      avatar: '',
    })
  }
});

const emit = defineEmits(['close', 'update-username', 'update-avatar']);

const editingUsername = ref(false);
const tempUsername = ref('');
const usernameInput = ref<HTMLInputElement | null>(null);

const userInitial = computed(() => {
  return props.user.username?.charAt(0).toUpperCase() || 'U';
});

function close() {
  emit('close');
}

function startEditingUsername() {
  tempUsername.value = props.user.username;
  editingUsername.value = true;
  nextTick(() => {
    usernameInput.value?.focus();
  });
}

function saveUsername() {
  emit('update-username', {username: tempUsername.value });
  editingUsername.value = false;
}

function cancelEditingUsername() {
  editingUsername.value = false;
}

function editAvatar() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg,image/png,image/webp';
  
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    // Validate file size (e.g., 2MB max)
    if (file.size > 2 * 1024 * 1024) {
      showToast('File size must be less than 2MB', 'error');
      return;
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Only JPEG, PNG, or WebP images are allowed', 'error');
      return;
    }
    
    emit('update-avatar', file);
  };
  
  input.click();
}
</script>

<style scoped lang="scss">
@import '@/styles/index';

.profile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($black, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.profile-card {
  background-color: $background-color;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow-lg;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-medium;
    background-color: var(--color-primary);
    
    h3 {
      color: $text-light;
      margin: 0;
      font-size: 1.5rem;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: $text-light;
      cursor: pointer;
      font-size: 1.2rem;
      padding: $spacing-small;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  .card-body {
    padding: $spacing-medium;
    
    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: $spacing-medium;
      
      .avatar-container {
        width: 120px;
        height: 120px;
        border-radius: $border-radius;
        overflow: hidden;
        margin-bottom: $spacing-small;
        border: 2px solid $border-color;
        
        .profile-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: $light-gray;
          font-size: 3rem;
          font-weight: bold;
          color: $text-color;
        }
      }
      
      .edit-btn {
        background: var(--color-primary);
        color: $text-light;
        border: none;
        border-radius: $border-radius;
        padding: $spacing-small $spacing-medium;
        cursor: pointer;
        font-weight: 500;
        
        &:hover {
          background: var(--color-accent);
          box-shadow: $box-shadow-hover;
        }
      }
    }
    
    .info-section {
      .info-item {
        margin-bottom: $spacing-medium;
        padding-bottom: $spacing-small;
        border-bottom: 1px solid $border-color;
        
        label {
          display: block;
          font-weight: bold;
          margin-bottom: $spacing-small;
          color: $text-muted;
        }
        
        .info-value {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .edit-icon {
            background: none;
            border: none;
            color: var(--color-primary);
            cursor: pointer;
            padding: $spacing-small;
            
            &:hover {
              color: var(--color-accent);
            }
          }
        }
        
        .edit-field {
          display: flex;
          gap: $spacing-small;
          
          input {
            flex: 1;
            padding: $spacing-small;
            border: 1px solid $border-color;
            border-radius: $border-radius;
            font-size: 1rem;
          }
          
          .save-btn, .cancel-btn {
            padding: $spacing-small $spacing-medium;
            border-radius: $border-radius;
            cursor: pointer;
            font-weight: 500;
            transition: all $transition-duration $transition-timing;
          }
          
          .save-btn {
            background: var(--color-primary);
            color: $text-light;
            border: none;
            
            &:hover {
              background: var(--color-accent);
              box-shadow: $box-shadow-hover;
            }
          }
          
          .cancel-btn {
            background: $light-gray;
            color: $text-color;
            border: none;
            
            &:hover {
              background: $medium-gray;
            }
          }
        }
      }
    }
  }
}
</style>