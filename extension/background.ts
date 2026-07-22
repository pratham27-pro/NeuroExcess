import { clearAuthSession, setAuthSession } from "~lib/auth/session"
import { deriveSettingsPatchFromProfile } from "~lib/settings/profile/deriveSettingsPatch"
import { setGlobalSettings } from "~lib/settings/store"



interface AuthMessage {
  type: "NEUROEXCESS_AUTH"
  token: string
  accessibilityNeeds: string[]
}

interface LogoutMessage {
  type: "NEUROEXCESS_LOGOUT"
}

type IncomingMessage = AuthMessage | LogoutMessage

chrome.runtime.onMessageExternal.addListener((message: IncomingMessage, _sender, sendResponse) => {
  if (!message || typeof message.type !== "string") {
    sendResponse({ ok: false, error: "Malformed message" })
    return false
  }

  if (message.type === "NEUROEXCESS_AUTH") {
    handleAuth(message)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }))
    return true // keep the message channel open for the async response
  }

  if (message.type === "NEUROEXCESS_LOGOUT") {
    clearAuthSession()
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }))
    return true
  }

  sendResponse({ ok: false, error: `Unknown message type` })
  return false
})

async function handleAuth(message: AuthMessage): Promise<void> {
  const accessibilityNeeds = Array.isArray(message.accessibilityNeeds) ? message.accessibilityNeeds : []

  await setAuthSession({
    token: message.token ?? null,
    accessibilityNeeds,
    signedInAt: Date.now()
  })

  const patch = deriveSettingsPatchFromProfile(accessibilityNeeds)
  await setGlobalSettings(patch)
}
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "read-selection-aloud",
    title: "Read selection aloud",
    contexts: ["selection"]
  })
  chrome.contextMenus.create({
    id: "read-page-aloud",
    title: "Read page aloud",
    contexts: ["page"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab?.id) {
    if (info.menuItemId === "read-selection-aloud") {
      chrome.tabs.sendMessage(tab.id, { type: "neuroaccess:read-selection" })
    } else if (info.menuItemId === "read-page-aloud") {
      chrome.tabs.sendMessage(tab.id, { type: "neuroaccess:read-page" })
    }
  }
})
