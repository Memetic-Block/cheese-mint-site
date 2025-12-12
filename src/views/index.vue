<template>
  <div class="mt-6">
    <template v-if="isLoading">
      Loading...
    </template>
    <template v-else-if="errorMessage">
      Error: {{ errorMessage }}
      <button class="border px-4 rounded cursor-pointer" @click="reloadProcessState">Reload</button>
    </template>
    <template v-else>
      <Dialog v-model:open="achievementDialogOpen">
        <DialogHeader>
          <DialogTitle>{{ isEditMode ? 'Edit Achievement' : 'Create Achievement' }}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input 
                type="text" 
                v-model="achievementForm.name" 
                class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded outline-none focus:border-blue-500 dark:focus:border-blue-400" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Category</label>
              <input 
                type="text" 
                v-model="achievementForm.category" 
                class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded outline-none focus:border-blue-500 dark:focus:border-blue-400" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Points</label>
              <input 
                type="number" 
                v-model.number="achievementForm.points" 
                class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded outline-none focus:border-blue-500 dark:focus:border-blue-400" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Description</label>
              <input 
                type="text" 
                v-model="achievementForm.description" 
                class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded outline-none focus:border-blue-500 dark:focus:border-blue-400" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Icon (Arweave TX ID)</label>
              <input 
                type="text" 
                v-model="achievementForm.icon" 
                class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded outline-none focus:border-blue-500 dark:focus:border-blue-400" 
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <button class="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" @click="achievementDialogOpen = false">
            Cancel
          </button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700" @click="handleAchievementSubmit">
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </DialogFooter>
      </Dialog>
      <div class="text-xs">
        <table class="table-fixed">
          <thead>
            <tr>
              <th @click="tab = 'achievements'" class="text-center! border px-4 py-2 cursor-pointer underline" :class="tab === 'achievements' ? '' : 'text-gray-500'">Achievements</th>
              <th @click="tab = 'awarded'" class="text-center! border px-4 py-2 cursor-pointer underline" :class="tab === 'awarded' ? '' : 'text-gray-500'">Awarded</th>
              <th @click="tab = 'acl'" class="text-center! border px-4 py-2 cursor-pointer underline" :class="tab === 'acl' ? '' : 'text-gray-500'">ACL</th>              
            </tr>
          </thead>
        </table>
        <table class="table-fixed">
          <thead>
            <tr>
              <template v-if="tab === 'achievements'">
                <th class="border">Name</th>
                <th class="border">Category</th>
                <th class="border">Points</th>
                <th class="border">Description</th>
                <th class="border">Icon</th>
                <th class="border">Created</th>
                <th class="border">Updated</th>
                <th class="border">ID</th>
                <th class="border"></th>
              </template>
              <template v-if="tab === 'awarded'">
                <th class="border">Address</th>
                <th class="border">Achievement</th>
                <th class="border">Awarded</th>
                <th class="border"></th>
              </template>
              <template v-if="tab === 'acl'">
                <th class="border">Role</th>
                <th class="border">Address</th>
                <th class="border"></th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template v-if="tab === 'achievements'">
              <tr v-for="cheeseMintId in Object.keys(state.cheese_mints_by_id)" :key="cheeseMintId">
                <td class="border px-2 py-1">
                  {{ state.cheese_mints_by_id[cheeseMintId].name }}
                </td>
                <td class="border px-2 py-1">
                  {{ state.cheese_mints_by_id[cheeseMintId].category }}
                </td>
                <td class="border px-2 py-1">
                  {{ state.cheese_mints_by_id[cheeseMintId].points }}
                </td>
                <td class="border px-2 py-1">
                  {{ state.cheese_mints_by_id[cheeseMintId].description }}
                </td>
                <td class="border px-2 py-1">
                  <a class="cursor-pointer" :href="`https://arweave.net/${state.cheese_mints_by_id[cheeseMintId].icon}`" target="_blank" rel="noopener noreferrer">
                    <img style="width: 32px; height: 32px;" :src="`https://arweave.net/${state.cheese_mints_by_id[cheeseMintId].icon}`" alt="Icon" />
                  </a>
                </td>
                <td class="border px-2 py-1">
                  {{ new Date(state.cheese_mints_by_id[cheeseMintId].created_at).toUTCString() }}
                  by
                  <a :href="aoLinkUrl(state.cheese_mints_by_id[cheeseMintId].created_by)" target="_blank" rel="noopener noreferrer" class="cursor-pointer underline">
                    {{ truncateArweaveAddress(state.cheese_mints_by_id[cheeseMintId].created_by) }}
                  </a>
                </td>
                <td class="border px-2 py-1">
                  {{ new Date(state.cheese_mints_by_id[cheeseMintId].updated_at || state.cheese_mints_by_id[cheeseMintId].created_at).toUTCString() }}
                  by
                  <a :href="aoLinkUrl(state.cheese_mints_by_id[cheeseMintId].updated_by || state.cheese_mints_by_id[cheeseMintId].created_by)" target="_blank" rel="noopener noreferrer" class="cursor-pointer underline">
                    {{ truncateArweaveAddress(state.cheese_mints_by_id[cheeseMintId].updated_by || state.cheese_mints_by_id[cheeseMintId].created_by) }}
                  </a>
                </td>
                <td class="border px-2 py-1">
                  <a :href="`https://aolink.arweave.net/#/message/${cheeseMintId}`" target="_blank" rel="noopener noreferrer" class="cursor-pointer underline">
                    {{ truncateArweaveAddress(cheeseMintId) }}
                  </a>
                </td>
                <td class="border px-2 py-1">
                  <button class="border px-4 py-1 rounded cursor-pointer hover:bg-blue-100" @click="openEditDialog(cheeseMintId)">
                    Edit
                  </button>
                  <button class="border px-4 py-1 rounded cursor-pointer hover:bg-red-100" @click="onRemoveAchievementClicked(cheeseMintId)">
                    Remove
                  </button>
                </td>
              </tr>
            </template>
            <template v-if="tab === 'awarded'">
              <template v-for="address in Object.keys(state.cheese_mints_by_address)" :key="address">
                <tr v-for="cheeseMintId in Object.keys(state.cheese_mints_by_address[address])" :key="address + cheeseMintId">
                  <td class="border">
                    <a :href="aoLinkUrl(address)" target="_blank" rel="noopener noreferrer" class="cursor-pointer underline">
                      {{ address }}
                    </a>
                  </td>
                  <td class="border">{{ state.cheese_mints_by_id[cheeseMintId].name }}</td>
                  <td class="border">
                    {{ new Date(state.cheese_mints_by_address[address][cheeseMintId].awarded_at).toUTCString() }}
                    by
                    <a :href="aoLinkUrl(state.cheese_mints_by_address[address][cheeseMintId].awarded_by)" target="_blank" rel="noopener noreferrer" class="cursor-pointer underline">
                      {{ truncateArweaveAddress(state.cheese_mints_by_address[address][cheeseMintId].awarded_by) }}
                    </a>
                    @
                    <a :href="aoLinkUrl(state.cheese_mints_by_address[address][cheeseMintId].message_id)" target="_blank" rel="noopener noreferrer" class="cursor-pointer underline">
                      {{ truncateArweaveAddress(state.cheese_mints_by_address[address][cheeseMintId].message_id) }}
                    </a>
                  </td>
                  <td class="border">
                    <button class="border px-4 rounded cursor-pointer" @click="onRevokeAchievementClicked(address, cheeseMintId)">Revoke</button>
                  </td>
                </tr>
              </template>
            </template>
            <template v-if="tab === 'acl'">
              <tr>
                <td class="border">Owner</td>
                <td class="border">
                  <a :href="aoLinkUrl(state.owner)" target="_blank" rel="noopener noreferrer" class="cursor-pointer underline">
                    {{ state.owner }}
                  </a>
                </td>
                <td class="border"></td>
              </tr>
              <template v-for="role in Object.keys(state.acl.roles)" :key="role">
                <tr v-for="address in Object.keys(state.acl.roles[role])" :key="address + role">
                  <td class="border">{{ role }}</td>
                  <td class="border">
                    <a :href="aoLinkUrl(address)" target="_blank" rel="noopener noreferrer" class="cursor-pointer underline">
                      {{ address }}
                    </a>
                  </td>
                  <td class="border">
                    <button class="border px-4 rounded cursor-pointer" @click="onRevokeAclClicked(address, role)">Revoke</button>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <template v-if="tab === 'achievements'">
                <td class="border" colspan="9">
                  <button class="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700" @click="openCreateDialog">
                    Create Achievement
                  </button>
                </td>
              </template>
              <template v-if="tab === 'awarded'">
                <td class="border">
                  <input type="text" id="award_to_address" name="award_to_address" class="inline outline border-black" />
                </td>
                <td class="border">
                  <select id="award_cheese_mint_id" name="award_cheese_mint_id" class="inline outline border-black">
                    <option v-for="cheeseMintId in Object.keys(state.cheese_mints_by_id)" :key="cheeseMintId" :value="cheeseMintId" class="text-black">
                      {{ state.cheese_mints_by_id[cheeseMintId].name }}
                    </option>
                  </select>
                </td>
                <td class="border" colspan="2">
                  <button class="border px-4 rounded cursor-pointer" @click="onAwardAchievementClicked">Award</button>
                </td>
              </template>
              <template v-if="tab === 'acl'">
                <td class="border">
                  <select id="role" name="role" class="inline outline border-black">
                    <option value="admin" class="text-black">admin</option>
                    <option value="Update-Roles" class="text-black">Update-Roles</option>
                    <option value="Create-Cheese-Mint" class="text-black">Create-Cheese-Mint</option>
                    <option value="Update-Cheese-Mint" class="text-black">Update-Cheese-Mint</option>
                    <option value="Remove-Cheese-Mint" class="text-black">Remove-Cheese-Mint</option>
                    <option value="Award-Cheese-Mint" class="text-black">Award-Cheese-Mint</option>
                    <option value="Revoke-Cheese-Mint" class="text-black">Revoke-Cheese-Mint</option>
                  </select>
                </td>
                <td class="border">
                  <input type="text" id="address" name="address" class="inline outline border-black" />
                </td>
                <td class="border">
                  <button class="border px-4 rounded cursor-pointer" @click="onGrantAclClicked">Grant</button>
                </td>
              </template>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { createDataItemSigner } from '@permaweb/aoconnect'
import { useSeoMeta } from '@unhead/vue'
import { onMounted, ref } from 'vue'
import { sendAosDryRun, sendAosMessage } from '../lib/send-aos-message'
import { useWallet } from '../composables/wallet'
import { aoLinkUrl, truncateArweaveAddress } from '../lib/utils'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '../components/ui/dialog'

useSeoMeta({
  titleTemplate: ''
})

const wallet = useWallet()
const processId = 'sDQbE8v-k7hLxys85n256Xwk9AUI1-p1GbSSox652ks'
const isLoading = ref(true)
const errorMessage = ref('')
const state = ref<any>(null)
const tab = ref('achievements')

// Dialog state
const achievementDialogOpen = ref(false)
const isEditMode = ref(false)
const editCheeseMintId = ref<string | null>(null)
const achievementForm = ref({
  name: '',
  category: '',
  points: 0,
  description: '',
  icon: ''
})

function openCreateDialog() {
  isEditMode.value = false
  editCheeseMintId.value = null
  achievementForm.value = {
    name: '',
    category: '',
    points: 0,
    description: '',
    icon: ''
  }
  achievementDialogOpen.value = true
}

function openEditDialog(cheeseMintId: string) {
  const achievement = state.value.cheese_mints_by_id[cheeseMintId]
  isEditMode.value = true
  editCheeseMintId.value = cheeseMintId
  achievementForm.value = {
    name: achievement.name,
    category: achievement.category,
    points: achievement.points,
    description: achievement.description,
    icon: achievement.icon
  }
  achievementDialogOpen.value = true
}

async function handleAchievementSubmit() {
  if (isEditMode.value) {
    await onUpdateAchievementClicked()
  } else {
    await onCreateAchievementClicked()
  }
}

onMounted(reloadProcessState)

async function reloadProcessState() {
  try {
    errorMessage.value = ''
    isLoading.value = true
    const { result } = await sendAosDryRun({
      processId,
      tags: [{ name: 'Action', value: 'View-State' }]
    })

    if (result.Messages && result.Messages.length > 0) {
      state.value = JSON.parse(result.Messages[0].Data)
      console.log('Got state', state.value)
    } else {
      console.log(`No AO DryRun Messages returned for process ${processId}`)
    }
  } catch (error) {
    console.error(`Error during AO DryRun for process ${processId}`, error)
  }

  isLoading.value = false
}

async function onCreateAchievementClicked() {
  if (!wallet.address) {
    alert('Please connect your wallet first.')
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''
    achievementDialogOpen.value = false

    const { messageId } = await sendAosMessage({
      processId,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [
        { name: 'Action', value: 'Create-Cheese-Mint' },
        { name: 'Cheese-Mint-Name', value: achievementForm.value.name },
        { name: 'Description', value: achievementForm.value.description },
        { name: 'Points', value: achievementForm.value.points.toString() },
        { name: 'Icon', value: achievementForm.value.icon },
        { name: 'Category', value: achievementForm.value.category }
      ]
    })

    console.log(`Achievement creation message sent with ID: ${messageId}`)
    await reloadProcessState()
  } catch (error: any) {
    console.error('Error creating achievement', error)
    errorMessage.value = error.message || 'Unknown error'
  } finally {
    isLoading.value = false
  }
}

async function onUpdateAchievementClicked() {
  if (!wallet.address) {
    alert('Please connect your wallet first.')
    return
  }

  if (!editCheeseMintId.value) {
    alert('No achievement selected for editing.')
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''
    achievementDialogOpen.value = false

    const { messageId } = await sendAosMessage({
      processId,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [
        { name: 'Action', value: 'Update-Cheese-Mint' },
        { name: 'Cheese-Mint-Id', value: editCheeseMintId.value },
        { name: 'Cheese-Mint-Name', value: achievementForm.value.name },
        { name: 'Description', value: achievementForm.value.description },
        { name: 'Points', value: achievementForm.value.points.toString() },
        { name: 'Icon', value: achievementForm.value.icon },
        { name: 'Category', value: achievementForm.value.category }
      ]
    })

    console.log(`Achievement update message sent with ID: ${messageId}`)
    editCheeseMintId.value = null
    await reloadProcessState()
  } catch (error: any) {
    console.error('Error updating achievement', error)
    errorMessage.value = error.message || 'Unknown error'
  } finally {
    isLoading.value = false
  }
}

async function onRemoveAchievementClicked(cheeseMintId: string) {
  if (!wallet.address) {
    alert('Please connect your wallet first.')
    return
  }

  if (!confirm(`Are you sure you want to remove achievement "${state.value.cheese_mints_by_id[cheeseMintId].name}"? This action cannot be undone and will revoke it from all users who have earned it.`)) {
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    const { messageId } = await sendAosMessage({
      processId,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [
        { name: 'Action', value: 'Remove-Cheese-Mint' },
        { name: 'Cheese-Mint-Id', value: cheeseMintId }
      ]
    })

    console.log(`Achievement removal message sent with ID: ${messageId}`)
    await reloadProcessState()
  } catch (error: any) {
    console.error('Error removing achievement', error)
    errorMessage.value = error.message || 'Unknown error'
  } finally {
    isLoading.value = false
  }
}

async function onGrantAclClicked() {
  if (!wallet.address) {
    alert('Please connect your wallet first.')
    return
  }

  const roleInput = document.getElementById('role') as HTMLInputElement
  const addressInput = document.getElementById('address') as HTMLInputElement
  const role = roleInput.value
  const address = addressInput.value

  try {
    isLoading.value = true
    errorMessage.value = ''

    const { messageId } = await sendAosMessage({
      processId,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: 'Action', value: 'Update-Roles' }],
      data: JSON.stringify({ Grant: { [address]: [role] } })
    })

    console.log(`ACL grant message sent with ID: ${messageId}`)
    await reloadProcessState()
  } catch (error: any) {
    console.error('Error granting ACL', error)
    errorMessage.value = error.message || 'Unknown error'
  } finally {
    isLoading.value = false
  }
}

async function onRevokeAclClicked(address: string, role: string) {
  if (!wallet.address) {
    alert('Please connect your wallet first.')
    return
  }

  if (!confirm(`Are you sure you want to revoke role "${role}" from address ${address}?`)) {
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    const { messageId } = await sendAosMessage({
      processId,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: 'Action', value: 'Update-Roles' }],
      data: JSON.stringify({ Revoke: { [address]: [role] } })
    })

    console.log(`ACL revoke message sent with ID: ${messageId}`)
    await reloadProcessState()
  } catch (error: any) {
    console.error('Error revoking ACL', error)
    errorMessage.value = error.message || 'Unknown error'
  } finally {
    isLoading.value = false
  }
}

async function onAwardAchievementClicked() {
  if (!wallet.address) {
    alert('Please connect your wallet first.')
    return
  }

  const cheeseMintIdInput = document.getElementById('award_cheese_mint_id') as HTMLInputElement
  const addressInput = document.getElementById('award_to_address') as HTMLInputElement
  const cheeseMintId = cheeseMintIdInput.value
  const address = addressInput.value

  try {
    isLoading.value = true
    errorMessage.value = ''

    const { messageId } = await sendAosMessage({
      processId,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [
        { name: 'Action', value: 'Award-Cheese-Mint' },
        { name: 'Cheese-Mint-Id', value: cheeseMintId },
        { name: 'Award-To-Address', value: address }
      ]
    })

    console.log(`Achievement award message sent with ID: ${messageId}`)
    await reloadProcessState()
  } catch (error: any) {
    console.error('Error awarding achievement', error)
    errorMessage.value = error.message || 'Unknown error'
  } finally {
    isLoading.value = false
  }
}

async function onRevokeAchievementClicked(address: string, cheeseMintId: string) {
  if (!wallet.address) {
    alert('Please connect your wallet first.')
    return
  }

  if (!confirm(`Are you sure you want to revoke achievement "${state.value.cheese_mints_by_id[cheeseMintId].name}" from address ${address}?`)) {
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    const { messageId } = await sendAosMessage({
      processId,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [
        { name: 'Action', value: 'Revoke-Cheese-Mint' },
        { name: 'Cheese-Mint-Id', value: cheeseMintId },
        { name: 'Revoke-From-Address', value: address }
      ]
    })

    console.log(`Achievement revoke message sent with ID: ${messageId}`)
    await reloadProcessState()
  } catch (error: any) {
    console.error('Error revoking achievement', error)
    errorMessage.value = error.message || 'Unknown error'
  } finally {
    isLoading.value = false
  }
}
</script>
