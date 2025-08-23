
import { redirect } from 'next/navigation';

export default function StudentDashboardPage() {
  // The root /student page should redirect to the profile page.
  redirect('/student/profile');
}
