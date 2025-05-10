
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} FPX Markets. All rights reserved.</p>
        <p className="mt-1">
          This is a fictional platform for demonstration purposes only.
        </p>
      </div>
    </footer>
  );
}
