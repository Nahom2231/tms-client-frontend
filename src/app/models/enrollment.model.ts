export interface Enrollment {
    Id: string;
    studentId: number;
    studentName: string;
    courseId: number;
    courseName: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    enrolledAt: string;
}