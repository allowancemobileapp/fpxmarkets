import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface GenericPageLayoutProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function GenericPageLayout({ title, description, children }: GenericPageLayoutProps) {
  return (
    <div className="container mx-auto py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden bg-card">
        <CardHeader className="p-6 sm:p-8 border-b">
          <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
            {title}
          </CardTitle>
          <CardDescription className="mt-3 text-md sm:text-lg text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          {children || (
            <>
              <p className="text-foreground mb-8 text-base sm:text-lg leading-relaxed">
                This page is currently under construction. Please check back later for more detailed information about {title.toLowerCase()}. We appreciate your patience as we work to enhance your experience on FPX Markets.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-secondary/30 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-primary mb-3">Key Information</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Placeholder for relevant information. This section will provide key details and insights related to {title.toLowerCase()}.
                    It is designed to be fully responsive and adapt to various screen sizes, ensuring a seamless user experience across all devices.
                  </p>
                </div>
                <div className="bg-secondary/30 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-primary mb-3">Helpful Resources</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Relevant resources, links, or tools will be listed here to further assist you with {title.toLowerCase()}.
                    This content block also adjusts its layout for optimal viewing on mobile, tablet, and desktop devices.
                  </p>
                </div>
              </div>
              <div className="text-center">
                 <Button asChild variant="link">
                   <Link href="/">Return to Homepage</Link>
                 </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  For immediate assistance, please visit our <Link href="/contact" className="text-primary hover:underline font-medium">Contact Page</Link> or explore other sections of our site.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
