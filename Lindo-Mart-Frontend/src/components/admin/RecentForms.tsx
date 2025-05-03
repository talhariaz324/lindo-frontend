import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const recentForms = [
  {
    id: 1,
    title: "Inventory Exception Report",
    submitter: "John Doe",
    status: "pending",
    timestamp: "2 hours ago",
    type: "Inventory",
  },
  {
    id: 2,
    title: "Equipment Facility Alert",
    submitter: "Jane Smith",
    status: "in-progress",
    timestamp: "3 hours ago",
    type: "Equipment",
  },
  {
    id: 3,
    title: "Customer Feedback Form",
    submitter: "Mike Johnson",
    status: "completed",
    timestamp: "5 hours ago",
    type: "Feedback",
  },
];

export function RecentForms() {
  return (
    <div className="space-y-8">
      {recentForms.map((form) => (
        <div key={form.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary">
              {form.submitter.charAt(0)}
            </div>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{form.title}</p>
            <p className="text-sm text-muted-foreground">
              by {form.submitter} • {form.timestamp}
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Badge
              variant={
                form.status === "completed"
                  ? "default"
                  : form.status === "in-progress"
                  ? "secondary"
                  : "destructive"
              }
            >
              {form.status}
            </Badge>
            <Badge variant="outline">{form.type}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
