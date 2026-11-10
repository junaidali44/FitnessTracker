import { useState } from 'react';
import { Button, Card, Input, Select, Badge, Modal, Spinner, EmptyState } from '../../components/ui';

export default function DesignDemo() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black grid-bg">
      <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-12">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden p-10 lg:p-16 radial-glow border border-black-border">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-text-primary mb-3">
            Design System <span className="text-gradient-crimson">Preview</span>
          </h1>
          <p className="text-text-secondary max-w-xl">
            All design tokens, components, and utilities in one place. This page will be removed after Phase 1.
          </p>
        </div>

        {/* Colors */}
        <section>
          <h2 className="section-title mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Primary', color: 'bg-crimson-600' },
              { name: 'Accent', color: 'bg-accent' },
              { name: 'Card', color: 'bg-black-card' },
              { name: 'Border', color: 'bg-black-border' },
              { name: 'Crimson 700', color: 'bg-crimson-700' },
              { name: 'Crimson 900', color: 'bg-crimson-900' },
              { name: 'Black', color: 'bg-black' },
              { name: 'Elevated', color: 'bg-black-elevated' },
            ].map((c) => (
              <div key={c.name} className="glass-card p-4">
                <div className={`h-16 rounded-lg ${c.color} mb-3 border border-black-border`} />
                <p className="text-xs text-text-secondary">{c.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="section-title mb-4">Typography</h2>
          <Card className="space-y-4">
            <h1 className="text-display text-4xl">Display Heading — H1</h1>
            <h2 className="text-display text-2xl">Section Heading — H2</h2>
            <h3 className="text-display text-xl">Card Title — H3</h3>
            <p className="text-text-primary">Body text — Inter regular. Used for most paragraphs.</p>
            <p className="text-text-secondary text-sm">Secondary text — used for descriptions and hints.</p>
            <p className="text-text-muted text-xs">Muted text — used for timestamps and metadata.</p>
          </Card>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="section-title mb-4">Buttons</h2>
          <Card className="flex flex-wrap gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
          </Card>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="section-title mb-4">Form Elements</h2>
          <Card className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="John Doe" />
            <Input label="Email" placeholder="john@example.com" type="email" />
            <Input label="With Error" placeholder="..." error="This field is required" />
            <Input label="With Hint" placeholder="..." hint="At least 8 characters" />
            <Select label="Fitness Goal">
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Maintain</option>
            </Select>
          </Card>
        </section>

        {/* Badges */}
        <section>
          <h2 className="section-title mb-4">Badges</h2>
          <Card className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <h2 className="section-title mb-4">Card Variants</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card variant="matte">
              <h3 className="font-display font-semibold mb-2">Matte Card</h3>
              <p className="text-sm text-text-secondary">Standard card with border.</p>
            </Card>
            <Card variant="elevated">
              <h3 className="font-display font-semibold mb-2">Elevated Card</h3>
              <p className="text-sm text-text-secondary">Lighter background.</p>
            </Card>
            <Card variant="glass">
              <h3 className="font-display font-semibold mb-2">Glass Card</h3>
              <p className="text-sm text-text-secondary">Blur + gradient.</p>
            </Card>
          </div>
        </section>

        {/* Modal */}
        <section>
          <h2 className="section-title mb-4">Modal</h2>
          <Card>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          </Card>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
            <p className="text-text-secondary mb-4">This is how modals look in the system.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setModalOpen(false)}>Confirm</Button>
            </div>
          </Modal>
        </section>

        {/* Spinner & Empty */}
        <section className="grid md:grid-cols-2 gap-4">
          <Card>
            <h2 className="section-title mb-4">Spinner</h2>
            <Spinner label="Loading your data..." />
          </Card>
          <EmptyState
            icon={<span className="text-crimson-500 text-2xl">+</span>}
            title="No data yet"
            message="This is how empty states look. Add your first item to get started."
            action={<Button>Get Started</Button>}
          />
        </section>

        {/* Glow effect demo */}
        <section>
          <h2 className="section-title mb-4">Glow Effects</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="shadow-glow-sm">
              <p className="text-sm text-text-secondary">Shadow: glow-sm</p>
            </Card>
            <Card className="shadow-glow">
              <p className="text-sm text-text-secondary">Shadow: glow</p>
            </Card>
            <Card className="shadow-glow-lg">
              <p className="text-sm text-text-secondary">Shadow: glow-lg</p>
            </Card>
          </div>
        </section>

        <div className="text-center text-text-muted text-sm py-10">
          Phase 1 complete. <br />Reply with "Looks good" to proceed to Phase 2 (Landing Page).
        </div>
      </div>
    </div>
  );
}