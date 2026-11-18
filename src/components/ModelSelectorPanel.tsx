import { TEXT_REASONING_EFFORT_VALUES, type ReasoningEffort } from '../types'
import { getAgentTextApiProfile, TEXT_MODEL_VALUES } from '../lib/apiProfiles'
import { isPresetProfileLocked } from '../lib/presetConfig'
import { useStore } from '../store'
import Select from './Select'

const TEXT_MODEL_DESCRIPTIONS: Record<(typeof TEXT_MODEL_VALUES)[number], string> = {
  'gpt-6.2-astra': 'gpt-6.2 顶级旗舰文本模型。',
  'gpt-6.2-sol': 'gpt-6.2 主力文本模型。',
  'gpt-6-astra': 'gpt-6 顶级旗舰文本模型。',
  'gpt-6.1-sol': 'gpt-6.1 进阶主力文本模型。',
  'gpt-6-sol': 'gpt-6 主力文本模型。',
  'gpt-6-luna': 'gpt-6 高效文本模型。',
  'gpt-5.6-sol': 'gpt-5.6 高性能文本模型。',
  'gpt-5.6-terra': 'gpt-5.6 均衡型文本模型。',
  'gpt-5.6-luna': 'gpt-5.6 轻量文本模型。',
}

const REASONING_EFFORT_LABELS: Record<ReasoningEffort, string> = {
  none: '不思考（沿用配置）',
  minimal: '最低（沿用配置）',
  low: '轻度',
  medium: '中',
  high: '高',
  xhigh: '极高',
  max: '最高（沿用配置）',
}

export default function ModelSelectorPanel() {
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  const textProfile = getAgentTextApiProfile(settings)
  const effort = textProfile?.reasoningEffort ?? 'medium'

  const selectClass = 'px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] text-xs transition-all duration-200 shadow-sm'

  return (
    <div className="fixed right-3 sm:right-6 z-40 bottom-[calc(var(--input-bar-clearance,12rem)+1rem)] w-44 rounded-2xl border border-gray-200/70 dark:border-white/[0.08] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-black/5 dark:ring-white/10 p-3 flex flex-col gap-2.5">
      <label className="flex flex-col gap-0.5">
        <span className="text-gray-400 dark:text-gray-500 ml-1 text-[11px]">图像模型</span>
        <Select
          value="gpt-image-2"
          onChange={() => {}}
          options={[{ label: 'gpt-image-2', value: 'gpt-image-2', tooltip: 'gpt-image-2\n旗舰级图像模型。' }]}
          showValueTooltips
          className={selectClass}
        />
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="text-gray-400 dark:text-gray-500 ml-1 text-[11px]">文本模型</span>
        <Select
          value={settings.textModel}
          onChange={(model) => setSettings({ textModel: model })}
          options={TEXT_MODEL_VALUES.map((value) => ({ label: value, value, tooltip: `${value}\n${TEXT_MODEL_DESCRIPTIONS[value]}` }))}
          showValueTooltips
          className={selectClass}
        />
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="text-gray-400 dark:text-gray-500 ml-1 text-[11px]">思考程度</span>
        <Select
          value={effort}
          valueLabel={REASONING_EFFORT_LABELS[effort]}
          onChange={(value) => {
            if (!textProfile) return
            setSettings({ profiles: settings.profiles.map((profile) => profile.id === textProfile.id ? { ...profile, reasoningEffort: value } : profile) })
          }}
          options={TEXT_REASONING_EFFORT_VALUES.map((value) => ({ label: REASONING_EFFORT_LABELS[value], value }))}
          disabled={!textProfile || isPresetProfileLocked(textProfile.id)}
          className={selectClass}
        />
      </label>
    </div>
  )
}
