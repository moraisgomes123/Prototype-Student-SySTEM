STUDENT ATTENDANCE SYSTEM – PART 3 PROTOTYPE
================================================

CONTENTS
- index.html: student login
- dashboard.html: attendance summary and navigation
- attendance.html: read-only attendance records and discrepancy report
- history.html: module and date filters
- css/styles.css: responsive interface styling
- js/app.js: prototype login, navigation, data display, filters and report interaction

HOW TO RUN
1. Extract the ZIP file.
2. Open the extracted Student_Attendance_System_Part3 folder.
3. Double-click index.html, or open it in a modern browser.
4. Use one of the demo accounts below.

DEMO ACCOUNTS
Account 1
Student number: ST10467009
Password: Student123!

Account 2
Student number: ST10467010
Password: Student123!

TESTING SUGGESTIONS
1. Submit the login form with empty fields.
2. Enter an incorrect password and observe the validation message.
3. Log in with each demo account and compare the attendance records.
4. Use the navigation links to move between Dashboard, My Attendance and Attendance History.
5. Filter the history by module and date range.
6. Enter an invalid date range (From date later than To date).
7. Submit a discrepancy report and confirm that the attendance record remains unchanged.
8. Use the Tab key to navigate controls and observe the visible focus indicator.
9. Log out and try opening dashboard.html directly.

IMPORTANT PROTOTYPE LIMITATION
This is a front-end demonstration. The demo credentials and attendance data are stored in
JavaScript, and the session is maintained in browser sessionStorage. This is suitable for
demonstrating interface behaviour for an academic prototype, but it is NOT production-grade
security. A real deployed system must use a server-side authentication service, a protected
database, authorization checks on every request, secure password hashing, and an institution
workflow for reviewing discrepancy reports. Client-side code alone cannot guarantee that a
student is prevented from accessing another student's data.
