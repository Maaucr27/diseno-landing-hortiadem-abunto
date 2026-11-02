'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { InfoSection } from '@/lib/plant-details'

export function DetailsAccordion({ sections }: { sections: InfoSection[] }) {
  return (
    <Accordion defaultValue={[sections[0].id]} className="gap-3">
      {sections.map((section) => (
        <AccordionItem
          key={section.id}
          value={section.id}
          className="glass-green overflow-hidden rounded-3xl border"
        >
          <AccordionTrigger className="rounded-3xl px-6 py-5 font-serif text-xl font-semibold text-white hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-emerald-300">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 text-base leading-relaxed text-pretty text-emerald-50/80">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
