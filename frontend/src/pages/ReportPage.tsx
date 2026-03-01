import { CategorySelector } from "@/components/report/category-selector";
import { IssueForm } from "@/components/report/issue-form";
import { LocationHeader } from "@/components/report/location-header";
import { ReportActions } from "@/components/report/report-actions";

export default function ReportPage() {
  return (
    <main className="bg-background flex w-full items-center justify-center">
      <div className="bg-muted text-muted-foreground shadow-primary/5 w-full space-y-8 rounded p-6 shadow-xl sm:p-10">
        <LocationHeader />
        <CategorySelector />
        <IssueForm />
        <ReportActions />
      </div>
    </main>
  );
}
