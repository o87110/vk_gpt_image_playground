// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it } from 'vitest'
import { createDefaultOpenAIProfile, DEFAULT_IMAGES_MODEL, getActiveApiProfile, normalizeSettings } from '../lib/apiProfiles'
import { useStore } from '../store'
import SettingsModal from './SettingsModal'

;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

it.each([
  ['gpt-5.6-sol', DEFAULT_IMAGES_MODEL],
  ['custom-model', 'custom-model'],
])('从 Responses 切换到 Images 时正确处理已保存的模型 %s', (model, expected) => {
  useStore.setState({
    settings: normalizeSettings({ profiles: [createDefaultOpenAIProfile({ apiMode: 'responses', model })] }),
    showSettings: true,
  })
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  try {
    act(() => root.render(<SettingsModal />))
    const trigger = Array.from(container.querySelectorAll<HTMLElement>('.cursor-pointer')).find((el) => el.textContent === 'Responses API (/v1/responses)')
    act(() => trigger!.click())
    act(() => container.querySelector<HTMLElement>('[data-option-value="images"]')!.click())
    expect(getActiveApiProfile(useStore.getState().settings)).toMatchObject({ apiMode: 'images', model: expected })
  } finally {
    act(() => root.unmount())
    container.remove()
  }
})
