"use client";
import { FlowButton } from "@/components/ui/flow-button";

const FlowButtonDemo = () => (
  <div className="flex min-h-screen flex-wrap items-center justify-center gap-4 bg-gray-100 p-4">
    <FlowButton text="Flow Button" />
    <FlowButton variant="gold" text="Book a Meeting" />
    <div className="rounded-xl bg-navy p-6">
      <FlowButton variant="ghost" text="Contact Us" />
    </div>
  </div>
);

export default FlowButtonDemo;
