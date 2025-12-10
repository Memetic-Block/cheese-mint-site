import { computed, ref } from 'vue'
import type { PermissionType } from 'arconnect'

const PERMISSIONS: PermissionType[] = [
  'ACCESS_ADDRESS',
  'SIGN_TRANSACTION',
  'ACCESS_PUBLIC_KEY',
  'SIGNATURE'
]

// Module-level refs shared across all useWallet() calls
const address = ref<string>('')
const walletWasCheckedOnLoad = ref(false)
const isConnecting = ref<boolean>(false)

// Helper function to set address
async function setAddress(newAddress?: string) {
  if (newAddress) {
    address.value = newAddress
    return
  }

  try {
    address.value = await window.arweaveWallet.getActiveAddress()
  } catch (error: any) {
    console.warn('No wallet connected')
  }
}

// Event listener interfaces
interface WalletLoadedEvent extends CustomEvent {
  detail: {
    permissions: PermissionType
  }
}

interface WalletSwitchEvent extends CustomEvent {
  detail: {
    address: string
  }
}

// Set up event listeners once at module level
if (typeof window !== 'undefined') {
  window.addEventListener('arweaveWalletLoaded', ((e: WalletLoadedEvent) => {
    const { permissions } = e.detail

    if (!permissions.length) {
      console.warn('App has no permissions')
    } else {
      setAddress()
    }
  }) as EventListener)

  window.addEventListener('walletSwitch', ((e: WalletSwitchEvent) => {
    const { address: newAddress } = e.detail
    setAddress(newAddress)
  }) as EventListener)
}

export function useWallet() {
  const isConnected = computed(() => !!address.value)

  async function connect() {
    if (!window.arweaveWallet) {
      console.error('Arweave Wallet not found')
      return
    }

    isConnecting.value = true

    try {
      await window.arweaveWallet.connect(PERMISSIONS)
      address.value = await window.arweaveWallet.getActiveAddress()
      isConnecting.value = false
    } catch (err: any) {
      console.error(`Arweave Wallet Error: ${err.message}`, err)
      isConnecting.value = false
    }
  }

  async function disconnect() {
    await window.arweaveWallet.disconnect()
    address.value = ''
  }

  function getAddress() {
    return address.value
  }

  return {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    walletWasCheckedOnLoad,
    getAddress
  }
}
