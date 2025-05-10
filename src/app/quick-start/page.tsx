import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Start Guide - FPX Markets',
  description: 'Get started quickly with FPX Markets. Your guide to opening an account and beginning your trading journey.',
};

export default function QuickStartPage() {
  return (
    <GenericPageLayout
      title="Quick Start Guide"
      description="Your first steps to trading with FPX Markets. We'll guide you through account setup and platform basics."
    />
  );
}
