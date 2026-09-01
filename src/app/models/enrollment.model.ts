export interface Enrollment {
    Id: string;
    id?: string;
    studentId: number;
    studentName: string;
    courseId: number;
    courseName: string;
    courseTitle?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    enrolledAt: string;
}