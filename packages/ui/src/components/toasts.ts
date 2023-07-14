import { toast } from '@zerodevx/svelte-toast'
import colors from 'tailwindcss/colors'
import {theme} from '../theme'

export const toastOptions = {
  dismissable: true,
  pausable: true,
  theme: {
    "--toastBackground": "#000",
    "--toastProgressBackground": "#444",
    "--toastColor": "#fff",
    "--toastBorderRadius": "0.5rem",
    "--toastBoxShadow": "0 0 0.5rem rgba(0, 0, 0, 0.5)",
  },
}

export const successToast = (m: string) => toast.push(m, {
  ...toastOptions,
  theme: {
    '--toastBackground': theme.colors.greenAlpha[900],
    '--toastColor': colors.white,
    '--toastProgressBackground': colors.green[800],
  }
})

export const warningToast = (m: string) => toast.push(m, {
  ...toastOptions,
  theme: {
    '--toastBackground': theme.colors.orangeAlpha[800],
    '--toastColor': colors.black,
    '--toastProgressBackground': colors.orange[800],
   }
})

export const failureToast = (m: string) => toast.push(m, {
  ...toastOptions,
  theme: {
    '--toastBackground': theme.colors.redAlpha[900],
    '--toastColor': colors.white,
    '--toastProgressBackground': colors.red[800],
   }
})

export const infoToast = (m: string) => toast.push(m, {
  ...toastOptions,
  theme: {
    '--toastBackground': theme.colors.grayAlpha[900],
    '--toastColor': colors.white,
    '--toastProgressBackground': colors.blue[500],
  }
})