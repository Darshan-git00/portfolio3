import resumeData from "@/data/resume.json";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p data-testid="text-footer-copyright">
          &copy; {new Date().getFullYear()} {resumeData.personal.name}.
        </p>
        <p>
          Built with React & Tailwind.
        </p>
      </div>
    </footer>
  );
}
