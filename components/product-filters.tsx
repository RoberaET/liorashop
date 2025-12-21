"use client"

import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ProductFiltersProps {
  min: number
  max: number
  priceRange: number[]
  onPriceChange: (value: number[]) => void
}

export function ProductFilters({ min, max, priceRange, onPriceChange }: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="w-full" defaultValue={["price"]}>
        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 space-y-4">
              <Slider
                value={priceRange}
                onValueChange={onPriceChange}
                min={min}
                max={max}
                step={10}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>ETB {priceRange[0]}</span>
                <span>ETB {priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability Filter */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-semibold">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" defaultChecked />
                <Label htmlFor="in-stock" className="text-sm font-normal">
                  In Stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="out-of-stock" />
                <Label htmlFor="out-of-stock" className="text-sm font-normal">
                  Out of Stock
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating Filter */}
        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-semibold">Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="text-sm font-normal">
                    {rating}+ Stars
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tags Filter */}
        <AccordionItem value="tags">
          <AccordionTrigger className="text-sm font-semibold">Tags</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {["Bestseller", "Popular", "Premium", "Sustainable"].map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox id={`tag-${tag}`} />
                  <Label htmlFor={`tag-${tag}`} className="text-sm font-normal">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
