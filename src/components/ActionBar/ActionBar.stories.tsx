import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionBar } from './ActionBar'
import { Button } from '../Button/Button'
import { Switch } from '../Switch/Switch'
import { Icon } from '../Icon'

const meta = { title: 'Components/Action bar', component: ActionBar, tags: ['autodocs'],
  args: { label: 'Next question', children: null },
  parameters: { layout: 'fullscreen', docs: { description: { component: 'A bar fixed to the bottom of the screen with the main action of the page, so it never gets hidden below the fold on a phone. One primary Button, plus optional related controls. Scroll the preview to see it stay in place.' } } },
} satisfies Meta<typeof ActionBar>
export default meta
type Story = StoryObj<typeof meta>

const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '0 16px', maxWidth: 720, margin: '0 auto' }}>
    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <p key={n} style={{ margin: '32px 0' }}>Page content {n}. The bar stays at the bottom while you scroll.</p>)}
    {children}
  </div>)

export const ButtonOnly: Story = { render: (a) => (
  <Page><ActionBar {...a} label="Brew"><Button>Start espresso</Button></ActionBar></Page>) }
export const WithSwitch: Story = { render: (a) => {
  const [on, setOn] = useState(true)
  return <Page><ActionBar {...a}>
    <Button>Next</Button>
    <Switch label="Move on by itself after 5 seconds" checked={on} onChange={setOn} />
  </ActionBar></Page>
} }
export const TwoButtons: Story = { render: (a) => (
  <Page><ActionBar {...a} label="Recipe">
    <Button><Icon name="download" size={20} /> Download PDF</Button>
    <Button variant="secondary">Preview</Button>
  </ActionBar></Page>) }
