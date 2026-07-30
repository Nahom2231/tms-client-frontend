import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  imports: [],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard {
  studentName =signal("Liya kebede");
  earnedCredits = signal(45);

  graduationStatus= computed(() =>

    this.earnedCredits() >=120 ? "ELigible for GRaduation " : "In Progress"
);

registerForClass() {
  this.earnedCredits.update((c) => c + 3);
}
}
